import IconEth from "../assets/images//chains/eth.png";
import IconUsdt from "../assets/images//chains/usdt.png";
import IconUsdc from "../assets/images//chains/usdc.png";
import IconBnb from "../assets/images//chains/bnb.png";
import IconBusdc from "../assets/images//chains/busdc.png";
import IconBase from "../assets/images//chains/base.png";

const chains = {
  ETH: {
    id: 1,
    icon: IconEth,
    name: "Ethereum Testnet",
    title: "Ethereum",
    chainId: 11155111,
  },
  BNB: {
    id: 2,
    icon: IconBnb,
    name: "BNB Smart Chain Testnet",
    title: "BNB",
    chainId: 97,
  },
  BASE: {
    id: 3,
    icon: IconBase,
    name: "Base Sepolia Testnet",
    title: "Base",
    chainId: 84532,
  },
};

export const chainInfo = [
  {
    ...chains.ETH,
    payTokens: [
      { id: 1, name: "ETH", img: IconEth },
      { id: 2, name: "USDT", img: IconUsdt },
      { id: 3, name: "USDC", img: IconUsdc },
    ],
  },
  {
    ...chains.BNB,
    payTokens: [
      { id: 1, name: "BNB", img: IconBnb },
      { id: 2, name: "USDT", img: IconUsdt },
      { id: 3, name: "USDC", img: IconBusdc },
    ],
  },
  {
    ...chains.BASE,
    payTokens: [
      { id: 1, name: "ETH", img: IconBase },
      { id: 2, name: "USDT", img: IconUsdt },
      { id: 3, name: "USDC", img: IconUsdc },
    ],
  },
];

export const chainConfig = (chainId) => {
  const config = chainInfo.find((item) => item.chainId === chainId);

  return config || chainInfo[0];
};
