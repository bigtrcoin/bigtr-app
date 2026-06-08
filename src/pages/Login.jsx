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
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-6">
      <img src="/images/logo.png" alt="BigTrCoin" className="w-40" />
      <h1 className="text-secondary text-2xl font-bold font-onest">
        BigTrCoin Presale
      </h1>
      <p className="text-secondary-60 font-onest">
        Panele girmek için cüzdanınızı bağlayın
      </p>
      <ConnectButton client={client} />
    </div>
  );
};

export default Login;