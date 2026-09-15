// src/web3/presale.js
// thirdweb client + presale contract configuration.
// Addresses come from .env (Vite => VITE_ prefixed). They may be empty before
// deployment; the app does NOT crash then, contract-bound fields just stay idle.
//
// UPDATE (after audit fixes):
//  - The contract now accepts a SINGLE active payment token at a time (SDR fix),
//    so a single PAY_TOKEN is used instead of the old PAY_TOKENS list.
//  - buy() now takes a minTokensOut parameter (NSP fix). The tolerance is set
//    via SLIPPAGE_BPS (default 0.5% = 50 basis points).

import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { createWallet, walletConnect } from "thirdweb/wallets";

export const client = createThirdwebClient({
    clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "MISSING_CLIENT_ID",
});

// Wallets offered in the connect modal, in this order. Wallet-only on purpose:
// social/e-mail sign-in creates an empty in-app wallet that buyers then have to
// fund separately, so it is not offered. WalletConnect covers every other wallet.
export const walletList = [
    createWallet("io.metamask"),
    createWallet("com.trustwallet.app"),
    createWallet("com.binance.wallet"),
    walletConnect(),
];

// Presale runs on BNB Chain: 97 for testnet, 56 for mainnet.
export const presaleChain = defineChain(Number(import.meta.env.VITE_CHAIN_ID || 97));

export const PRESALE_ADDRESS = import.meta.env.VITE_PRESALE_ADDRESS || "";
export const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS || "";

// The single ACTIVE payment token (must match activePayToken on the contract).
export const PAY_TOKEN = {
    symbol: import.meta.env.VITE_PAY_TOKEN_SYMBOL || "USDT",
    address: import.meta.env.VITE_PAY_TOKEN_ADDRESS || "",
};

export const STABLE_DECIMALS = 18; // BSC USDT/USDC use 18 decimals
export const TOKEN_DECIMALS = 18;

// Slippage tolerance in basis points. 50 = 0.5%.
// If the buyer would receive less than this below the quoted amount, the
// contract reverts the transaction.
export const SLIPPAGE_BPS = 50n;

// Is this a valid 0x address? (may be empty before deployment)
const isAddress = (a) => typeof a === "string" && /^0x[a-fA-F0-9]{40}$/.test(a);

// Contract object when the address is configured, otherwise null.
// Consuming code must null-check.
export const presaleConfigured = isAddress(PRESALE_ADDRESS);
export const payTokenConfigured = isAddress(PAY_TOKEN.address);

export const presaleContract = presaleConfigured
  ? getContract({ client, chain: presaleChain, address: PRESALE_ADDRESS })
    : null;
