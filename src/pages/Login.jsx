import React from "react";
import { ConnectButton } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { Navigate } from "react-router-dom";

const client = createThirdwebClient({
  clientId: "807215563adc5564b9e3ece0321aabac",
});

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
      <ConnectButton client={client} />
    </div>
  );
};

export default Login;