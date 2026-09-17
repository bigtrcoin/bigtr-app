// src/components/common/SmartAccountRecovery.jsx
// While the app briefly ran every connection through a thirdweb smart account,
// buyers could move USDT to that smart address. thirdweb's mainnet bundler is
// not enabled for this project, so those funds cannot be spent through the
// normal smart-account flow. The smart account is still owned by the wallet
// that signed in, though: its admin can deploy it and call execute() directly,
// paying an ordinary BNB fee. This card does exactly that and sends the USDT
// back to the connected wallet. It only appears when such a balance exists.
import React, { useCallback, useEffect, useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { encode, getContract, prepareContractCall, readContract } from "thirdweb";
import { eth_getCode, getRpcClient } from "thirdweb/rpc";
import { PAY_TOKEN, STABLE_DECIMALS, client, presaleChain } from "../../web3/presale";
import { friendlyTxError } from "./WalletReadiness";

// thirdweb DefaultAccountFactory (EntryPoint v0.6) — the factory the app used
// while smart accounts were enabled.
const FACTORY = "0x85e23b94e7F5E9cC1fF78BCe78cfb15B81f0DF00";

const fmt = (n) => Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 4 });

const SmartAccountRecovery = () => {
  const account = useActiveAccount();
  const { mutateAsync: sendTx } = useSendTransaction({ payModal: false });

  const [smartAddress, setSmartAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [deployed, setDeployed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    if (!account?.address || !PAY_TOKEN.address) return;
    try {
      const factory = getContract({ client, chain: presaleChain, address: FACTORY });
      const predicted = await readContract({
        contract: factory,
        method: "function getAddress(address,bytes) view returns (address)",
        params: [account.address, "0x"],
      });
      const token = getContract({ client, chain: presaleChain, address: PAY_TOKEN.address });
      const raw = await readContract({
        contract: token,
        method: "function balanceOf(address) view returns (uint256)",
        params: [predicted],
      });
      const rpc = getRpcClient({ client, chain: presaleChain });
      const code = await eth_getCode(rpc, { address: predicted });
      setSmartAddress(predicted);
      setBalance(Number(raw) / 10 ** STABLE_DECIMALS);
      setDeployed(Boolean(code && code !== "0x"));
    } catch {
      /* nothing to recover, or the chain is unreachable right now */
    }
  }, [account?.address]);

  useEffect(() => {
    load();
  }, [load]);

  const recover = async () => {
    setStatus("");
    setBusy(true);
    try {
      const factory = getContract({ client, chain: presaleChain, address: FACTORY });
      if (!deployed) {
        setStatus("Confirm step 1 of 2 in your wallet: opening the address...");
        await sendTx(
          prepareContractCall({
            contract: factory,
            method: "function createAccount(address,bytes) returns (address)",
            params: [account.address, "0x"],
          })
        );
        setDeployed(true);
      }
      const smart = getContract({ client, chain: presaleChain, address: smartAddress });
      const token = getContract({ client, chain: presaleChain, address: PAY_TOKEN.address });
      const held = await readContract({
        contract: token,
        method: "function balanceOf(address) view returns (uint256)",
        params: [smartAddress],
      });
      if (held === 0n) throw new Error("There is no USDT left on that address.");
      const callData = await encode(
        prepareContractCall({
          contract: token,
          method: "function transfer(address,uint256) returns (bool)",
          params: [account.address, held],
        })
      );
      setStatus("Confirm the last step in your wallet: sending the USDT back...");
      await sendTx(
        prepareContractCall({
          contract: smart,
          method: "function execute(address,uint256,bytes)",
          params: [PAY_TOKEN.address, 0n, callData],
        })
      );
      setStatus("Done. The USDT is back in your wallet.");
      setBalance(0);
      load();
    } catch (e) {
      setStatus(friendlyTxError(e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  if (!account || balance <= 0) return null;

  return (
    <div className="mb-6.25 rounded-[15px] p-5 md:p-6.25 2xl:px-10 bg-card border-2" style={{ borderColor: "#F2B43C" }}>
      <h2 className="aizon-title mb-2 uppercase font-chakrapetch font-bold text-secondary">
        USDT waiting on your BigTR address
      </h2>
      <p className="font-chakrapetch text-sm text-secondary-80">
        <span className="text-secondary font-bold">{fmt(balance)} USDT</span> is held at{" "}
        <span className="font-mono text-[13px] break-all">{smartAddress}</span>, the BigTR address created for
        your wallet. It belongs to you. Send it back to your wallet with the button below, then buy as usual.
      </p>
      <button
        type="button"
        onClick={recover}
        disabled={busy}
        className="mt-4 rounded-[12px] px-4 py-3 bg-primary font-chakrapetch uppercase text-sm font-bold text-btn-text hover:opacity-90 transition disabled:opacity-40"
      >
        {busy ? "Confirm in your wallet..." : `Send ${fmt(balance)} USDT back to my wallet`}
      </button>
      <p className="mt-2 font-chakrapetch text-[12px] text-secondary-70">
        {deployed ? "One confirmation" : "Two confirmations"} in your wallet, a few cents of BNB in total.
      </p>
      {status && <p className="mt-2 font-chakrapetch text-[13px] text-secondary-80">{status}</p>}
    </div>
  );
};

export default SmartAccountRecovery;
