// src/hooks/usePresale.js
// React hook that reads the presale contract and runs the approve/buy flow.
// If the contract is not deployed yet (empty address) NO reads happen; no crash.
//
// UPDATE (after audit fixes):
//  - buy(payToken, payAmount, minTokensOut) migrated to the new signature (NSP).
//    A fresh quote is taken right before sending the transaction and
//    minTokensOut is derived with the SLIPPAGE_BPS tolerance. If the price
//    moves against the buyer meanwhile, the contract reverts — no funds taken.
//  - Extra reads for stage progress: stagesCount, tokensSoldInCurrentStage,
//    remainingForSale and the active stage's (price, cap) info.

import { useCallback } from "react";
import {
    useActiveAccount,
    useActiveWallet,
    useReadContract,
    useSendBatchTransaction,
    useSendTransaction,
} from "thirdweb/react";
import {
    getContract,
    prepareContractCall,
    readContract,
    sendTransaction,
    toUnits,
    waitForReceipt,
} from "thirdweb";
import {
    client,
    presaleChain,
    presaleContract,
    presaleConfigured,
    STABLE_DECIMALS,
    SLIPPAGE_BPS,
} from "../web3/presale";

// Empty stand-in when no contract is configured (real useReadContract is not called).
const EMPTY = { data: undefined };

// Real read when the contract exists, empty otherwise — hooks must still be
// called in the same order on every render.
function useReadIfConfigured(method, params) {
    // presaleConfigured is constant for the whole render (comes from env), so hook order is stable.
  if (!presaleConfigured) return EMPTY;
    // eslint-disable-next-line react-hooks/rules-of-hooks
  return useReadContract({
        contract: presaleContract,
        method,
        params,
        queryOptions: {
                enabled: params ? params.every((p) => p !== undefined) : true,
        },
  });
}

export function usePresale() {
    const account = useActiveAccount();
    const { mutateAsync: sendTx, isPending } = useSendTransaction({ payModal: false });
    // Smart accounts (email/social sign-in) can bundle approve + buy into one
    // confirmation; plain wallets fall back to two sequential transactions.
    const { mutateAsync: sendBatch, isPending: isBatchPending } = useSendBatchTransaction();

  const { data: price } = useReadIfConfigured("function currentPrice() view returns (uint256)");
    const { data: stageIndex } = useReadIfConfigured("function currentStageIndex() view returns (uint256)");
    const { data: stagesCount } = useReadIfConfigured("function stagesCount() view returns (uint256)");
    const { data: soldInStage } = useReadIfConfigured("function tokensSoldInCurrentStage() view returns (uint256)");
    const { data: remainingForSale } = useReadIfConfigured("function remainingForSale() view returns (uint256)");
    const { data: totalTokensSold } = useReadIfConfigured("function totalTokensSold() view returns (uint256)");
    const { data: totalRaised } = useReadIfConfigured("function totalRaised() view returns (uint256)");
    const { data: allocated } = useReadIfConfigured(
          "function tokensAllocated(address) view returns (uint256)",
          account ? [account.address] : undefined
        );
    // Purchases made before the smart-account switch sit on the signer wallet
    // address, so that allocation is read as well and shown alongside.
    const wallet = useActiveWallet();
    let signerAddress = null;
    try {
          const admin = wallet?.getAdminAccount?.();
          if (admin && admin.address && admin.address.toLowerCase() !== account?.address?.toLowerCase()) {
                signerAddress = admin.address;
          }
    } catch {
          signerAddress = null;
    }
    const { data: allocatedSigner } = useReadIfConfigured(
          "function tokensAllocated(address) view returns (uint256)",
          signerAddress ? [signerAddress] : undefined
        );
    // Active stage (price, cap) info. When the sale is fully over stageIndex ==
  // stagesCount and stages(idx) reverts, hence the bounds check.
  const stageParamsValid =
        stageIndex !== undefined && stagesCount !== undefined && stageIndex < stagesCount;
    const { data: currentStage } = useReadIfConfigured(
          "function stages(uint256) view returns (uint256 price, uint256 cap)",
          stageParamsValid ? [stageIndex] : undefined
        );

  const quote = useCallback(async (humanAmount) => {
        if (!presaleConfigured) throw new Error("Contract is not connected yet");
        const payAmount = toUnits(String(humanAmount || "0"), STABLE_DECIMALS);
        if (payAmount === 0n) return { tokens: 0n, spent: 0n, endStage: 0n };
        const [tokens, spent, endStage] = await readContract({
                contract: presaleContract,
                method: "function quote(uint256) view returns (uint256,uint256,uint256)",
                params: [payAmount],
        });
        return { tokens, spent, endStage };
  }, []);

  const buy = useCallback(
        async (payTokenAddress, humanAmount, onStep) => {
                if (!presaleConfigured) throw new Error("Contract is not connected yet");
                if (!account) throw new Error("Wallet not connected");
                if (!payTokenAddress) throw new Error("Payment token is not configured");
                const payAmount = toUnits(String(humanAmount), STABLE_DECIMALS);

          // NSP: take a fresh quote right before the tx and apply slippage tolerance.
          const [freshTokens] = await readContract({
                    contract: presaleContract,
                    method: "function quote(uint256) view returns (uint256,uint256,uint256)",
                    params: [payAmount],
          });
                if (freshTokens === 0n) throw new Error("Amount too small");
                const minTokensOut = (freshTokens * (10_000n - SLIPPAGE_BPS)) / 10_000n;

          const payToken = getContract({ client, chain: presaleChain, address: payTokenAddress });

          // Buying runs from the smart account, but a buyer who signed in with
          // an existing wallet usually still holds their USDT there. Whatever
          // is missing is moved across first, in one transfer they confirm in
          // that wallet — no separate step in the UI.
          const balance = await readContract({
                    contract: payToken,
                    method: "function balanceOf(address) view returns (uint256)",
                    params: [account.address],
          });
          if (balance < payAmount) {
                    const missing = payAmount - balance;
                    const admin = wallet?.getAdminAccount?.();
                    if (!admin || admin.address.toLowerCase() === account.address.toLowerCase()) {
                                throw new Error("transfer amount exceeds balance");
                    }
                    const signerBalance = await readContract({
                                contract: payToken,
                                method: "function balanceOf(address) view returns (uint256)",
                                params: [admin.address],
                    });
                    if (signerBalance < missing) throw new Error("transfer amount exceeds balance");
                    if (onStep) onStep("Confirm in your wallet: moving the USDT for this purchase...");
                    const moveTx = prepareContractCall({
                                contract: payToken,
                                method: "function transfer(address,uint256) returns (bool)",
                                params: [account.address, missing],
                    });
                    const sent = await sendTransaction({ account: admin, transaction: moveTx });
                    if (onStep) onStep("Waiting for the transfer to confirm on BNB Chain...");
                    await waitForReceipt(sent);
          }

          if (onStep) onStep("Confirm the purchase...");

          const current = await readContract({
                    contract: payToken,
                    method: "function allowance(address,address) view returns (uint256)",
                    params: [account.address, presaleContract.address],
          });

          const txs = [];
          if (current < payAmount) {
                    txs.push(prepareContractCall({
                                contract: payToken,
                                method: "function approve(address,uint256) returns (bool)",
                                params: [presaleContract.address, payAmount],
                    }));
          }
          txs.push(prepareContractCall({
                    contract: presaleContract,
                    method: "function buy(address,uint256,uint256)",
                    params: [payTokenAddress, payAmount, minTokensOut],
          }));

          if (txs.length > 1 && typeof account.sendBatchTransaction === "function") {
                    return await sendBatch(txs);
          }
          let receipt;
          for (const tx of txs) receipt = await sendTx(tx);
          return receipt;
        },
        [account, wallet, sendTx, sendBatch]
      );

  return {
        account,
        configured: presaleConfigured,
        price,
        stageIndex,
        stagesCount,
        soldInStage,
        currentStage, // [price, cap] or undefined
        remainingForSale,
        totalTokensSold,
        totalRaised,
        allocated,
        allocatedSigner,
        signerAddress,
        quote,
        buy,
        isBuying: isPending || isBatchPending,
  };
}
