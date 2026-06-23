// src/web3/presale.js
// thirdweb istemcisi + ön satış kontratı yapılandırması.
// Adresler .env'den gelir (Vite => VITE_ önekli). Deploy edilmeden önce boş olabilirler;
// bu durumda uygulama ÇÖKMEZ, sadece kontrata bağlı alanlar pasif kalır.

import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "MISSING_CLIENT_ID",
});

// Ön satış BNB Chain üzerinde: test için 97, mainnet için 56.
export const presaleChain = defineChain(Number(import.meta.env.VITE_CHAIN_ID || 97));

export const PRESALE_ADDRESS = import.meta.env.VITE_PRESALE_ADDRESS || "";
export const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS || "";

// Kabul edilen stablecoin'ler (18 ondalık). Arayüzde ödeme seçimi için.
export const PAY_TOKENS = [
  { symbol: "USDT", address: import.meta.env.VITE_USDT_ADDRESS || "" },
  { symbol: "USDC", address: import.meta.env.VITE_USDC_ADDRESS || "" },
];

export const STABLE_DECIMALS = 18; // BSC USDT/USDC 18 ondalık
export const TOKEN_DECIMALS = 18;

// Geçerli bir 0x adres mi? (deploy öncesi boş olabilir)
const isAddress = (a) => typeof a === "string" && /^0x[a-fA-F0-9]{40}$/.test(a);

// Kontrat adresi tanımlıysa kontrat nesnesi, değilse null. Tüketen kod null kontrol etmeli.
export const presaleConfigured = isAddress(PRESALE_ADDRESS);

export const presaleContract = presaleConfigured
  ? getContract({ client, chain: presaleChain, address: PRESALE_ADDRESS })
  : null;
