import React from "react";
import { useActiveAccount, useActiveWallet, useActiveWalletChain, useDisconnect } from "thirdweb/react";
import { presaleChain } from "../../web3/presale";

// Human names for the wallet ids thirdweb reports.
const NAMES = {
  "io.metamask": "MetaMask",
  "com.trustwallet.app": "Trust Wallet",
  "com.binance.wallet": "Binance Wallet",
  walletConnect: "WalletConnect",
  inApp: "Email / social sign-in",
};

const short = (a) => (a ? a.slice(0, 6) + "…" + a.slice(-4) : "");

// Always-visible answer to "is my wallet connected, and which one?"
const ConnectedWallet = () => {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const chain = useActiveWalletChain();
  const { disconnect } = useDisconnect();

  if (!account) return null;

  const name = NAMES[wallet?.id] || wallet?.id || "Wallet";
  const onChain = !chain || chain.id === presaleChain.id;

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-4 py-3 bg-secondary-3 border border-secondary-8">
      <div className="font-chakrapetch text-[13px] text-secondary-80">
        <span
          className="inline-block w-2 h-2 rounded-full mr-2 align-middle"
          style={{ background: onChain ? "var(--color-primary)" : "#F2B43C" }}
        />
        <span className="text-secondary font-bold">Connected:</span> {name} ·{" "}
        <code className="font-mono text-secondary" title={account.address}>
          {short(account.address)}
        </code>{" "}
        · {onChain ? "BNB Smart Chain" : "wrong network"}
      </div>
      <button
        type="button"
        onClick={() => wallet && disconnect(wallet)}
        className="rounded-[10px] px-3 py-1.5 bg-secondary-8 font-chakrapetch uppercase text-[11px] font-bold text-secondary hover:bg-secondary-12 transition"
      >
        Disconnect / switch wallet
      </button>
    </div>
  );
};

export default ConnectedWallet;
