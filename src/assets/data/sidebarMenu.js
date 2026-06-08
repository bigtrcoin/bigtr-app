import {
  TbSmartHome,
  TbTrendingUp,
  TbWallet,
  TbStack2,
  TbCrown,
  TbChartPie,
  TbCalendarBolt,
  TbPasswordUser,
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
    url: "/staking",
    title: "Staking",
    icon: TbStack2,
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
    url: "/sale-calendar",
    title: "Sale Calendar",
    icon: TbCalendarBolt,
  },
  {
    url: "/referral",
    title: "Referral",
    icon: TbPasswordUser,
  },
  {
    url: "/transactions",
    title: "Transactions",
    icon: TbReceipt2,
  },
];

export default sidebarMenu;
