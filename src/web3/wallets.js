// src/web3/wallets.js
// One wallet list shared by every connect modal so auto-connect restores the
// same configuration. Email/social sign-in creates a smart account on the
// presale chain with sponsored gas: those buyers never need BNB and confirm
// approve + buy in a single step. External wallets stay plain EOAs and follow
// the usual approve + buy flow.
import { inAppWallet, createWallet, walletConnect } from "thirdweb/wallets";
import { presaleChain } from "./presale";

// Set VITE_SPONSOR_GAS=false in Vercel to switch sponsorship off without a code change.
export const SPONSOR_GAS = import.meta.env.VITE_SPONSOR_GAS !== "false";

export const emailWallet = inAppWallet({
  auth: { options: ["email", "google", "apple", "phone"] },
  smartAccount: { chain: presaleChain, sponsorGas: SPONSOR_GAS },
});

// Order = order in the modal: email/social first for newcomers, then the
// wallets crypto-native buyers already use. WalletConnect covers the rest.
export const walletList = [
  emailWallet,
  createWallet("io.metamask"),
  createWallet("com.trustwallet.app"),
  createWallet("com.binance.wallet"),
  walletConnect(),
];

export const wallets = walletList;

// True when the active wallet is the email/social wallet whose fees we sponsor.
export const isSponsoredWallet = (wallet) => SPONSOR_GAS && wallet?.id === "inApp";
