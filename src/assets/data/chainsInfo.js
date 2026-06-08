import EthIcon from "../images/chains/eth.png";
import BnbIcon from "../images/chains/bnb.png";
import PolygonIcon from "../images/chains/polygon.svg";
import ArbitrumIcon from "../images/chains/arbitrum.svg";
import OptimismIcon from "../images/chains/optimism.svg";
import BaseIcon from "../images/chains/base.png";

const chainsInfo = [
  {
    id: 1,
    name: "Ethereum",
    symbol:"ETH",
    icon: EthIcon,
  },
  {
    id: 11155111,
    name: "Sepolia",
    symbol:"ETH",
    icon: EthIcon,
  },
  {
    id: 137,
    name: "Polygon",
    symbol:"POL",
    icon: PolygonIcon,
  },
  {
    id: 10,
    name: "Op Mainnent",
    symbol:"ETH",
    icon: OptimismIcon,
  },
  {
    id: 42161,
    name: "Arbitrum",
    symbol:"ETH",
    icon: ArbitrumIcon,
  },
  {
    id: 56,
    name: "Bsc Mainent",
    symbol:"BNB",
    icon: BnbIcon,
  },
  {
    id: 97,
    name: "Bsc Testnet",
    symbol:"BNB",
    icon: BnbIcon,
  },
  {
    id: 8453,
    name: "Base",
    symbol:"BASE",
    icon: BaseIcon,
  },
   {
    id: 84532,
    name: "Base Sepolia",
    symbol:"BASE",
    icon: BaseIcon,
  },
];

export default chainsInfo;
