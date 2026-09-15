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

// The main connect modal lists ONLY self-custody wallets, MetaMask first: as
// soon as an in-app wallet is in the list, thirdweb's modal puts the
// email/social form on top, which is not the flow Bigtr wants. Email sign-in
// is offered through a separate, secondary modal (emailWalletList).
export const externalWallets = [
  createWallet("io.metamask"),
  createWallet("com.trustwallet.app"),
  createWallet("com.binance.wallet"),
  walletConnect(),
];

export const emailWalletList = [emailWallet];

export const walletList = externalWallets;
export const wallets = externalWallets;

// True when the active wallet is the email/social wallet whose fees we sponsor.
export const isSponsoredWallet = (wallet) => SPONSOR_GAS && wallet?.id === "inApp";
