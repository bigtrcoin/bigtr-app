import React from "react";
import { useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain } from "thirdweb/react";
import { Navigate } from "react-router-dom";
import { presaleChain } from "./web3/presale";

// Cuzdan bagli ama yanlis agdaysa kullaniciyi login'e atmak yerine
// net bir uyari + tek tikla ag degistirme goster.
const WrongNetwork = () => {
  const switchChain = useSwitchActiveWalletChain();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b14] px-4">
      <div className="max-w-md w-full rounded-[15px] bg-card p-8 text-center">
        <h2 className="font-chakrapetch uppercase text-xl font-bold text-secondary mb-3">
          Wrong network
        </h2>
        <p className="font-chakrapetch text-sm text-secondary-80 mb-6">
          Your wallet is connected to a different network. The BIGTR presale runs on
          <span className="text-primary font-bold"> BNB Smart Chain</span>. Switch to continue.
        </p>
        <button
          onClick={() => switchChain(presaleChain)}
          className="w-full rounded-[14px] px-4 py-4 bg-primary font-chakrapetch uppercase font-bold text-btn-text hover:opacity-90 transition"
        >
          Switch to BNB Smart Chain
        </button>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const account = useActiveAccount();
  const chain = useActiveWalletChain();

  if (!account) {
    return <Navigate to="/login" replace />;
  }
  if (chain && chain.id !== presaleChain.id) {
    return <WrongNetwork />;
  }
  return children;
};

export default ProtectedRoute;
