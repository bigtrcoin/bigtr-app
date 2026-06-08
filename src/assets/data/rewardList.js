import EthImg from "../images/chains/eth.png";
import BnbImg from "../images/chains/bnb.png";
import UsdtImg from "../images/chains/usdt.png";
import UsdcImg from "../images/chains/usdc.png";
import BusdImg from "../images/chains/busdc.png";
import MaticImg from "../images/chains/polygon.svg";

const rewardListData = [
  {
    referralTotals: [
      { image: EthImg, method: "ETH", total: 0.45 },
      { image: UsdtImg, method: "USDT", total: 2.2 },
      { image: UsdcImg, method: "USDC", total: 8.9 },
    ],
  },
  {
    referralTotals: [
      { image: BnbImg, method: "BNB", total: 0.0 },
      { image: UsdtImg, method: "USDT", total: 1.8 },
      { image: BusdImg, method: "BUSD", total: 0.9 },
    ],
  },
  {
    referralTotals: [
      { image: MaticImg, method: "MATIC", total: 5.5 },
      { image: UsdtImg, method: "USDT", total: 0.0 },
    ],
  },
];

export default rewardListData;
