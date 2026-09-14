import { useEffect, useState } from "react";
import { AizonContext } from "./AizonContext";
import { useActiveAccount } from "thirdweb/react";
import { chainInfo } from "../contracts/chainConfig";
import { usePresale } from "../hooks/usePresale";
import { STABLE_DECIMALS, TOKEN_DECIMALS } from "../web3/presale";

const PRESALE_CAP = 1_190_000_000; // total BIGTR offered in the presale
// Convert a 1e18-scaled price to a readable string (5e14 -> "0.0005")
const fmtPrice = (v) => {
  if (!v) return "0";
  const n = Number(v) / 10 ** STABLE_DECIMALS;
  return String(Number(n.toFixed(8)));
};

import { TbMoon, TbSunLow } from "react-icons/tb";

// The presale lives on BNB Chain, so a fixed BNB configuration is used.
const ACTIVE = chainInfo[0]; // BNB (tek zincir)

const AizonContextProvider = ({ children }) => {
  const themeModes = [
    { id: "dark", label: "Dark", icon: TbMoon },
    { id: "light", label: "Light", icon: TbSunLow },
  ];

  const themeColors = [
    { id: "green", label: "Green", color: "#05df72" },
    { id: "teal", label: "Teal", color: "#00D5BE" },
    { id: "blue", label: "Blue", color: "#00BCFF" },
    { id: "indigo", label: "Indigo", color: "#615FFF" },
    { id: "lime", label: "Lime", color: "#9AE600" },
    { id: "red", label: "Red", color: "#FF2056" },
  ];

  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("aizonthememode") || "dark",
  );

  const [themeColor, setThemeColor] = useState(
    localStorage.getItem("aizonthemecolor") || "blue",
  );

  useEffect(() => {
    document.documentElement.className = `theme-${themeMode} color-${themeColor}`;
    localStorage.setItem("aizonthememode", themeMode);
    localStorage.setItem("aizonthemecolor", themeColor);
  }, [themeMode, themeColor]);

  const getCssVar = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const [colors, setColors] = useState({});

  useEffect(() => {
    setColors({
      primary: getCssVar("--color-primary"),
      primary80: getCssVar("--color-primary-80"),
      primary70: getCssVar("--color-primary-70"),
      primary60: getCssVar("--color-primary-60"),
      primary50: getCssVar("--color-primary-50"),
      primary40: getCssVar("--color-primary-40"),
    });
  }, [themeMode, themeColor]);

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Wallet: thirdweb (single source of truth)
  const account = useActiveAccount();
  const addressData = account?.address;
  const isConnected = !!account;

  const ethChainId = chainInfo[0].chainId;
  const bnbChainId = chainInfo[0].chainId;
  const [payTokenList, setPayTokenList] = useState(ACTIVE.payTokens);
  const [payTokenId, setPayTokenId] = useState(ACTIVE.payTokens[0].id);
  const [selectedImg, setSelectedImg] = useState(ACTIVE.icon);
  const [titleText, setTitleText] = useState(ACTIVE.title);
  const [IsActiveBuyOnEth, setIsActiveBuyOnEth] = useState(false);
  const [IsActiveBuyOnBnb, setIsActiveBuyOnBnb] = useState(true);
  const switchChain = () => {}; // chain dropdown removed; no-op kept for compatibility

  const formatNumber = (num) => {
    let absNum = Math.abs(num);
    let formatted = num;
    let suffix = "";
    const formatSmart = (val) => {
      return val % 1 === 0 ? val.toFixed(0) : val.toFixed(2);
    };
    if (absNum >= 1_000_000_000) {
      formatted = formatSmart(num / 1_000_000_000);
      suffix = "B";
    } else if (absNum >= 1_000_000) {
      formatted = formatSmart(num / 1_000_000);
      suffix = "M";
    } else if (absNum >= 1_000) {
      formatted = formatSmart(num / 1_000);
      suffix = "K";
    } else {
      formatted = formatSmart(num);
    }
    return `${formatted.toLocaleString()}${suffix}`;
  };

  const formatTimestamp = (unixTimestamp) => {
    const date = new Date(unixTimestamp);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatTimestampDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // --- The presale values below are static placeholders for display;
  // once the contract is wired they switch to live values via usePresale. ---
  const [userBalance] = useState("0");
  const [userPurchasedTokens] = useState(0);
  const [userPurchasedBonusTokens] = useState(0);
  const [userReferredTokens] = useState(0);
  const [userReferredPay] = useState(0);

  const [tokenAddress] = useState(import.meta.env.VITE_PRESALE_ADDRESS || "");
  const [tokenName] = useState("BigTR Coin");
  const [tokenSymbol] = useState("BIGTR");
  const [tokenDecimals] = useState(18);
  const [tokenTotalSupply] = useState(2975000000);

  const [maxStage] = useState(8);
  // PROJECTED listing price, used only for estimates (ROI calculator, "value
  // at listing"). It is an assumption, not a promise: no future price is
  // guaranteed. Every place that shows it must label it as an estimate.
  const [listingPrice] = useState("0.096");
  const [stages] = useState([
    "0.0005", "0.001", "0.002", "0.003", "0.006", "0.012", "0.024", "0.048",
  ]);

  // --- Contract reads (usePresale is already safe pre-deployment) ---
  const {
    configured,
    price: cPrice,
    stageIndex: cStageIndex,
    totalRaised: cRaised,
    totalTokensSold: cSold,
    allocated: cAllocated,
  } = usePresale();

  const live = configured;
  const stageIdx = live && cStageIndex !== undefined ? Number(cStageIndex) : 0;
  const currentStage = Math.min(stageIdx + 1, 8);
  const currentPrice = live && cPrice ? fmtPrice(cPrice) : "0.0005";
  // Next stage price; null in the final stage (there is no next stage - the
  // listing price is an estimate and is shown separately, never as "next").
  const nextPrice = stageIdx + 1 < stages.length ? stages[stageIdx + 1] : null;
  const raisedUsd = live && cRaised ? Number(cRaised) / 10 ** STABLE_DECIMALS : 0;
  const tokenSold = live && cSold ? Number(cSold) / 10 ** TOKEN_DECIMALS : 0;
  const tokenPercent = live
    ? Math.min(100, Number(((tokenSold / PRESALE_CAP) * 100).toFixed(2)))
    : 0;
  const goalUsd = 7820000;
  const userTokenBalance =
    live && cAllocated ? Number(cAllocated) / 10 ** TOKEN_DECIMALS : 0;
  const [purchaseBonus] = useState(0);
  const [referralBonus] = useState(0);
  const [referralBonusPay] = useState(0);
  const [presaleStatus] = useState(null);
  const [paymentUsd, setPaymentUsd] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState(0);
  const [listingPayAmount, setListingPayAmount] = useState(0);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [usdtBalance] = useState(0);
  const [usdcBalance] = useState(0);

  // Used by the ROI calculator (RioCalculate)
  const handlePaymentInput = (e) => {
    const _inputValue = e.target.value;
    setBuyAmount(_inputValue);
    setPaymentUsd(parseFloat(_inputValue * Number(currentPrice)) || 0);
    setListingPayAmount(parseFloat(_inputValue * Number(listingPrice)) || 0);
  };

  // Helpers for the old BuyCard (the new BuyCard no longer uses them; kept for compatibility)
  const handlePaymentInputBuy = (e) => setPaymentAmount(e.target.value);
  const handlePayTokenInput = (e) => setPaymentAmount(e.target.value);

  const userChainId = bnbChainId;

  const makeEmptyInputs = () => {
    setPaymentAmount("");
    setBuyAmount(0);
    setBonusAmount(0);
    setTotalAmount(0);
    setPaymentUsd(0);
  };

  useEffect(() => {
    makeEmptyInputs();
  }, [addressData]);

  return (
    <AizonContext.Provider
      value={{
        themeModes,
        themeColors,
        themeMode,
        setThemeMode,
        themeColor,
        setThemeColor,
        colors,
        isSidebarVisible,
        setIsSidebarVisible,
        formatTimestamp,
        formatTimestampDate,
        payTokenList,
        payTokenId,
        setPayTokenId,
        ethChainId,
        bnbChainId,
        selectedImg,
        titleText,
        IsActiveBuyOnEth,
        setIsActiveBuyOnEth,
        IsActiveBuyOnBnb,
        setIsActiveBuyOnBnb,
        switchChain,
        makeEmptyInputs,
        formatNumber,
        addressData,
        isConnected,
        userBalance,
        usdtBalance,
        usdcBalance,
        tokenAddress,
        tokenName,
        tokenSymbol,
        tokenDecimals,
        tokenTotalSupply,
        userTokenBalance,
        userPurchasedTokens,
        userPurchasedBonusTokens,
        userReferredTokens,
        userReferredPay,
        purchaseBonus,
        referralBonus,
        referralBonusPay,
        maxStage,
        stages,
        currentStage,
        currentPrice,
        listingPrice,
        nextPrice,
        raisedUsd,
        goalUsd,
        tokenPercent,
        buyAmount,
        bonusAmount,
        totalAmount,
        paymentUsd,
        paymentAmount,
        listingPayAmount,
        presaleStatus,
        handlePaymentInput,
        handlePaymentInputBuy,
        handlePayTokenInput,
        userChainId,
      }}
    >
      {children}
    </AizonContext.Provider>
  );
};

export default AizonContextProvider;
