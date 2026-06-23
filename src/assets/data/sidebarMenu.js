import {
  TbSmartHome,
  TbTrendingUp,
  TbWallet,
  TbCrown,
  TbChartPie,
  TbReceipt2,
} from "react-icons/tb";

const sidebarMenu = [
  {
    url: "/",
    title: "Presale Overview",
    icon: TbSmartHome,
  },
  {
    url: "/buy",
    title: "Buy Now  🚀",
    icon: TbTrendingUp,
  },
  {
    url: "/mywallet",
    title: "My Wallet",
    icon: TbWallet,
  },
  {
    url: "/leaderboard",
    title: "Leaderboard",
    icon: TbCrown,
  },
  {
    url: "/tokenomics",
    title: "Tokenomics",
    icon: TbChartPie,
  },
  {
    url: "/transactions",
    title: "Transactions",
    icon: TbReceipt2,
  },
];

export default sidebarMenu;