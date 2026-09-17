// src/web3/wallets.js
// One wallet list shared by every connect modal so auto-connect restores the
// same configuration.
//
// EVERY connection - MetaMask, Trust, Binance, WalletConnect and email/social
// alike - runs through a smart account on the presale chain whose gas BigTR
// sponsors (accountAbstraction below). Buyers therefore never need BNB: USDT
// is the only asset they have to hold, and approve + buy are confirmed in one
// step. The connected wallet is only the signer; the address shown in the app
// (and the address USDT must be sent to) is the smart account.
import { inAppWallet, createWallet, walletConnect } from "thirdweb/wallets";
import { presaleChain } from "./presale";

// Set VITE_SPONSOR_GAS=false in Vercel to switch sponsorship off without a code change.
export const SPONSOR_GAS = import.meta.env.VITE_SPONSOR_GAS !== "false";

// Safety switch: VITE_SMART_ACCOUNT_FOR_ALL=false in Vercel puts external
// wallets back on plain EOAs (buyers then pay their own gas again) without a
// code change or redeploy of the app itself.
export const SMART_ACCOUNT_FOR_ALL =
  import.meta.env.VITE_SMART_ACCOUNT_FOR_ALL !== "false";

// Passed to every connect modal / ConnectButton so the smart account (and its
// gas sponsorship) applies to all wallets, not just email sign-in.
export const accountAbstraction = SMART_ACCOUNT_FOR_ALL
  ? { chain: presaleChain, sponsorGas: SPONSOR_GAS }
  : undefined;

// Smart-account wrapping is applied globally through accountAbstraction, so
// this wallet must NOT define its own smartAccount (that would nest one smart
// account inside another).
export const emailWallet = inAppWallet({
  auth: { options: ["email", "google", "apple", "phone"] },
  ...(SMART_ACCOUNT_FOR_ALL
    ? {}
    : { smartAccount: { chain: presaleChain, sponsorGas: SPONSOR_GAS } }),
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

// On a phone there is no wallet extension: tapping MetaMask can only hand the
// browser over to the MetaMask app, which many buyers never come back from.
// E-mail sign-in works in any mobile browser and is sponsored, so on mobile
// (without an injected wallet) it is offered first in the same modal.
export const isMobileBrowser = () =>
  typeof navigator !== "undefined" &&
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

export const hasInjectedWallet = () =>
  typeof window !== "undefined" && typeof window.ethereum !== "undefined";

export const connectWallets = () =>
  isMobileBrowser() && !hasInjectedWallet()
    ? [emailWallet, ...externalWallets]
    : externalWallets;

// Deep link that reopens this page inside the MetaMask app's own browser,
// where the wallet is injected and the normal flow works.
export const metamaskAppLink = () => {
  if (typeof window === "undefined") return "https://metamask.app.link";
  const { host, pathname, hash } = window.location;
  return `https://metamask.app.link/dapp/${host}${pathname}${hash}`;
};

export const walletList = externalWallets;
export const wallets = externalWallets;

// With smart accounts for everyone, sponsorship applies to every connection;
// with the safety switch off, only the email/social wallet is sponsored.
export const isSponsoredWallet = (wallet) =>
  SPONSOR_GAS && (SMART_ACCOUNT_FOR_ALL || wallet?.id === "inApp");
