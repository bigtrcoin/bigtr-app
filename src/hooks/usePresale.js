// src/hooks/usePresale.js
// Ön satış kontratını okuyan + approve/buy akışını yürüten React hook'u.
// Kontrat henüz deploy edilmediyse (adres boş) HİÇ okuma yapılmaz; çökmez.
//
// GÜNCELLEME (audit düzeltmeleri sonrası):
//  - buy(payToken, payAmount, minTokensOut) yeni imzaya geçirildi (NSP).
//    İşlem gönderilmeden hemen önce taze bir quote alınır ve SLIPPAGE_BPS
//    toleransıyla minTokensOut hesaplanır. Fiyat bu sırada aleyhe değişirse
//    kontrat işlemi geri alır — kullanıcının parası çekilmez.
//  - Stage ilerlemesi için ek okumalar: stagesCount, tokensSoldInCurrentStage,
//    remainingForSale ve aktif aşamanın (price, cap) bilgisi.

import { useCallback } from "react";
import {
    useActiveAccount,
    useReadContract,
    useSendTransaction,
} from "thirdweb/react";
import { getContract, prepareContractCall, readContract, toUnits } from "thirdweb";
import {
    client,
    presaleChain,
    presaleContract,
    presaleConfigured,
    STABLE_DECIMALS,
    SLIPPAGE_BPS,
} from "../web3/presale";

// Kontrat yoksa kullanılacak boş hook (gerçek useReadContract çağrılmaz).
const EMPTY = { data: undefined };

// Kontrat varsa gerçek okuma, yoksa boş — ama hook her render'da aynı sırada çağrılmalı.
function useReadIfConfigured(method, params) {
    // presaleConfigured render boyunca sabittir (env'den gelir), bu yüzden hook sırası bozulmaz.
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
    // Aktif aşamanın (price, cap) bilgisi. Satış tamamen bittiyse stageIndex ==
  // stagesCount olur ve stages(idx) revert eder; bu yüzden sınır kontrolü yapılır.
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
        async (payTokenAddress, humanAmount) => {
                if (!presaleConfigured) throw new Error("Contract is not connected yet");
                if (!account) throw new Error("Wallet not connected");
                if (!payTokenAddress) throw new Error("Payment token is not configured");
                const payAmount = toUnits(String(humanAmount), STABLE_DECIMALS);

          // NSP: işlemden hemen önce taze quote al ve slippage toleransı uygula.
          const [freshTokens] = await readContract({
                    contract: presaleContract,
                    method: "function quote(uint256) view returns (uint256,uint256,uint256)",
                    params: [payAmount],
          });
                if (freshTokens === 0n) throw new Error("Amount too small");
                const minTokensOut = (freshTokens * (10_000n - SLIPPAGE_BPS)) / 10_000n;

          const payToken = getContract({ client, chain: presaleChain, address: payTokenAddress });

          const current = await readContract({
                    contract: payToken,
                    method: "function allowance(address,address) view returns (uint256)",
                    params: [account.address, presaleContract.address],
          });

          if (current < payAmount) {
                    const approveTx = prepareContractCall({
                                contract: payToken,
                                method: "function approve(address,uint256) returns (bool)",
                                params: [presaleContract.address, payAmount],
                    });
                    await sendTx(approveTx);
          }

          const buyTx = prepareContractCall({
                    contract: presaleContract,
                    method: "function buy(address,uint256,uint256)",
                    params: [payTokenAddress, payAmount, minTokensOut],
          });
                return await sendTx(buyTx);
        },
        [account, sendTx]
      );

  return {
        account,
        configured: presaleConfigured,
        price,
        stageIndex,
        stagesCount,
        soldInStage,
        currentStage, // [price, cap] veya undefined
        remainingForSale,
        totalTokensSold,
        totalRaised,
        allocated,
        quote,
        buy,
        isBuying: isPending,
  };
}
