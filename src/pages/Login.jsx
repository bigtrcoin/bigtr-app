import React from "react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { Navigate } from "react-router-dom";
import { client, presaleChain } from "../web3/presale";

const Login = () => {
  const account = useActiveAccount();

  if (account) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ backgroundColor: "#147bff" }} className="min-h-screen flex flex-col items-center justify-center gap-6">
      <img src="/logo.png" alt="BigTrCoin" style={{ width: "160px" }} />
      <h1 style={{ color: "#ffffff" }} className="text-3xl font-bold font-onest">
        BigTrCoin Presale
      </h1>
      <p style={{ color: "#ffffff" }} className="font-onest">
        Connect your wallet to access the presale panel
      </p>
      <ConnectButton client={client} chain={presaleChain} />
    </div>
  );
};

export default Login;
