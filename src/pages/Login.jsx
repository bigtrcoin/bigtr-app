import React, { useState } from "react";
import { ConnectButton, useActiveAccount, useConnectModal } from "thirdweb/react";
import { Navigate } from "react-router-dom";
import { client, presaleChain } from "../web3/presale";
import { externalWallets, emailWalletList } from "../web3/wallets";

const Login = () => {
  const account = useActiveAccount();
  const { connect } = useConnectModal();
  const [emailBusy, setEmailBusy] = useState(false);

  if (account) {
    return <Navigate to="/" replace />;
  }

  // Secondary path: a separate modal with only the email/social wallet, so the
  // primary "Connect Wallet" modal stays a plain wallet list (MetaMask first).
  const signInWithEmail = async () => {
    try {
      setEmailBusy(true);
      await connect({
        client,
        chain: presaleChain,
        wallets: emailWalletList,
        theme: "dark",
        size: "compact",
        title: "Sign in with email",
        showThirdwebBranding: false,
      });
    } catch {
      /* closed or cancelled */
    } finally {
      setEmailBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-body px-4">
      {/* Arka plan: merkezde marka rengi parlamasi */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(640px 420px at 50% 38%, color-mix(in srgb, var(--color-primary) 13%, transparent), transparent 70%)",
        }}
      />
      {/* Arka plan: ince izgara dokusu */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(520px 400px at 50% 42%, black, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(520px 400px at 50% 42%, black, transparent 78%)",
        }}
      />

      {/* Icerik karti */}
      <div
        className="relative z-10 flex w-full max-w-[440px] flex-col items-center gap-6 rounded-[24px] border border-white/10 bg-card px-8 py-10 md:px-12 md:py-12 backdrop-blur-sm"
        style={{ boxShadow: "0 24px 70px rgba(0,0,0,0.5)" }}
      >
        <img
          src="/logo.png"
          alt="BigTR Coin"
          style={{ width: "140px", animation: "bigtr-float 3.4s ease-in-out infinite" }}
        />
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-onest text-secondary">
            BigTR Coin Pre-sale
          </h1>
          <p className="mt-2 font-onest text-secondary" style={{ opacity: 0.65 }}>
            Connect your wallet to access the pre-sale panel
          </p>
        </div>
        <ConnectButton
          client={client}
          chain={presaleChain}
          wallets={externalWallets}
          theme="dark"
          connectModal={{ showThirdwebBranding: false, size: "compact", title: "Connect your wallet" }}
          detailsModal={{ showThirdwebBranding: false }}
          connectButton={{
            label: "Connect Wallet",
            style: {
              backgroundColor: "var(--color-primary)",
              color: "var(--color-btn-text)",
              fontWeight: 700,
              borderRadius: "14px",
              minWidth: "230px",
              height: "52px",
              fontSize: "16px",
            },
          }}
        />
        <p className="font-onest text-xs text-secondary text-center" style={{ opacity: 0.55 }}>
          MetaMask · Trust Wallet · Binance Wallet · WalletConnect
        </p>
        <button
          type="button"
          onClick={signInWithEmail}
          disabled={emailBusy}
          className="font-onest text-sm text-secondary underline underline-offset-4 hover:opacity-100 transition disabled:opacity-40"
          style={{ opacity: 0.6 }}
        >
          No crypto wallet? Sign in with email
        </button>
        <p className="font-onest text-xs text-secondary" style={{ opacity: 0.4 }}>
          Secure connection · BNB Smart Chain
        </p>
      </div>

      <style>{`@keyframes bigtr-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }`}</style>
    </div>
  );
};

export default Login;
