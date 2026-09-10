// src/contracts/chainConfig.js
// UPDATE: the presale runs only on BNB Chain and the contract accepts a single
// stablecoin at a time (audit SDR fix). ETH/Base options and native token
// (BNB/ETH) payments were removed — they were misleading buyers.
// Mainnet/testnet naming is derived from VITE_CHAIN_ID.

import IconUsdt from "../assets/images/chains/usdt.png";
import IconBnb from "../assets/images/chains/bnb.png";

const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 97);
const IS_MAINNET = CHAIN_ID === 56;

export const chainInfo = [
  {
        id: 1,
        icon: IconBnb,
        name: IS_MAINNET ? "BNB Smart Chain" : "BNB Smart Chain Testnet",
        title: "BNB",
        chainId: CHAIN_ID,
        payTokens: [
          { id: 1, name: import.meta.env.VITE_PAY_TOKEN_SYMBOL || "USDT", img: IconUsdt },
              ],
  },
  ];

export const chainConfig = (chainId) => {
    const config = chainInfo.find((item) => item.chainId === chainId);

    return config || chainInfo[0];
};
