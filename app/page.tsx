"use client";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

const wallets = [
  inAppWallet({
    auth: {
      options: ["email", "google", "facebook"],
    },
  }),
  createWallet("io.metamask"),
];

export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#0e0e14",
      gap: "32px"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "800",
          color: "#ffffff",
          marginBottom: "8px"
        }}>
          Big<span style={{ color: "#29ABE2" }}>tr</span>
        </h1>
        <p style={{ color: "#888", fontSize: "1rem" }}>
          Hesabınıza giriş yapın
        </p>
      </div>
      <ConnectButton
        client={client}
        wallets={wallets}
        connectModal={{
          title: "Bigtr'e Giriş Yap",
          showThirdwebBranding: false,
        }}
      />
    </main>
  );
}