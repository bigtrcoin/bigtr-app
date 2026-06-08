import { useEffect, useState } from "react";
import { AizonContext } from "./AizonContext";
import { useConnection, useBalance, useChainId, useSwitchChain } from "wagmi";
import { formatUnits } from "viem";
import { useAppKit } from "@reown/appkit/react";
import { chainInfo, chainConfig } from "../contracts/chainConfig";

import { TbMoon, TbSunLow } from "react-icons/tb";

const AizonContextProvider = ({ children }) => {
  // Available theme modes
  const themeModes = [
    { id: "dark", label: "Dark", icon: TbMoon },
    { id: "light", label: "Light", icon: TbSunLow },
  ];

  // Available theme colors
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
    localStorage.getItem("aizonthemecolor") || "green",
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
  const { open } = useAppKit(); // controls modal
  const chainId = useChainId();
  const ethChainId = chainInfo[0].chainId;
  const bnbChainId = chainInfo[1].chainId;
  const [payTokenList, setPayTokenList] = useState(
    chainConfig(chainId).payTokens,
  );
  const [payTokenId, setPayTokenId] = useState(
    chainConfig(chainId).payTokens[0].id,
  );
  const [selectedImg, setSelectedImg] = useState(chainConfig(chainId).icon);
  const [titleText, setTitleText] = useState(chainConfig(chainId).title);
  const [IsActiveBuyOnEth, setIsActiveBuyOnEth] = useState(false);
  const [IsActiveBuyOnBnb, setIsActiveBuyOnBnb] = useState(true);

  //format number
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
    const result = `${formatted.toLocaleString()}${suffix}`;
    return result;
  };

  //format timestamp to custom datetime
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

  // variables
  const [userChainId, setUserChainId] = useState(chainConfig(chainId).chainId);
  const [userBalance, setUserBalance] = useState("0");
  const [userTokenBalance, setUserTokenBalance] = useState(2569);
  const [userPurchasedTokens, setUserPurchasedTokens] = useState(0);
  const [userPurchasedBonusTokens, setUserPurchasedBonusTokens] = useState(0);
  const [userReferredTokens, setUserReferredTokens] = useState(102566);
  const [userReferredPay, setUserReferredPay] = useState(569.56);
  // token
  const [tokenAddress, setTokenAddress] = useState(
    "0x6819be3120C602b64384Dc11e2178126c90AB606",
  );
  const [tokenName, setTokenName] = useState("Aizon Token");
  const [tokenSymbol, setTokenSymbol] = useState("$AIZON");
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [tokenSubDecimals, setTokenSubDecimals] = useState(0);
  const [userTokenAllowance, setUserTokenAllowance] = useState(0);
  const [tokenTotalSupply, setTokenTotalSupply] = useState(690000000);
  // presale
  const [maxStage, setMaxStage] = useState(12);
  const [listingPrice, setListingPrice] = useState("0.005");
  const [stageEnd, setStageEnd] = useState(1780483031);
  const [stages, setStages] = useState([
    "0.0005",
    "0.0006",
    "0.0007",
    "0.0008",
    "0.0009",
    "0.0010",
    "0.0011",
    "0.0012",
    "0.0013",
    "0.0014",
    "0.0015",
    "0.0016",
  ]);
  const [currentStage, setCurrentStage] = useState(2);
  const [currentPrice, setCurrentPrice] = useState("0.0005");
  const [nextStage, setNextStage] = useState(2);
  const [nextPrice, setNextPrice] = useState("0.0006");
  const [tokenSold, setTokenSold] = useState(0);
  const [raisedUsd, setRaisedUsd] = useState(2498713.28);
  const [goalUsd, setGoalUsd] = useState(2500000);
  const [tokenPercent, setTokenPercent] = useState(28.22);
  const [purchaseBonus, setPurchaseBonus] = useState(5);
  const [referralBonus, setReferralBonus] = useState(10);
  const [referralBonusPay, setReferralBonusPay] = useState(5);
  const [getBonusPayAmount, setGetBonusPayAmount] = useState(0);
  const [getBonusToken, setGetBonusToken] = useState(0);
  const [presaleStatus, setPresaleStatus] = useState(null);
  const [usdExRate, setUsdExRate] = useState(0);
  const [paymentUsd, setPaymentUsd] = useState(0);
  const [paymentPrice, setPaymentPrice] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState(0);
  const [listingPayAmount, setListingPayAmount] = useState(0);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  //paytokens
  const [usdtDecimals, setUsdtDecimals] = useState(18);
  const [usdtAllowance, setUsdtAllowance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [usdcDecimals, setUsdcDecimals] = useState(18);
  const [usdcAllowance, setUsdcAllowance] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  //stake
  const [totalStaked, setTotalStaked] = useState(10000000);
  const [totalReward, setTotalReward] = useState(0);
  const [stakeLevelId, setStakeLevelId] = useState(0);
  const [stakeLevels, setStakeLevels] = useState(null);
  const [userStakeLevelId, setUserStakeLevelId] = useState(0);
  const [userStakeAmount, setUserStakeAmount] = useState(25000);
  const [userStakeLockTime, setUserStakeLockTime] = useState(0);
  const [userGetRewardAmount, setUserGetRewardAmount] = useState(893);

  // switch network
  const { switchChain } = useSwitchChain();

  // users wallet read
  const { address: addressData, isConnected } = useConnection();
  const { data: balanceData } = useBalance({
    address: addressData,
  });

  // make empty inputs
  const makeEmptyInputs = () => {
    setPresaleStatus(null);
    setPaymentAmount("");
    setBuyAmount(0);
    setBonusAmount(0);
    setTotalAmount(0);
    setPaymentPrice(0);
    setPaymentUsd(0);
    setGetBonusPayAmount(0);
    setGetBonusToken(0);
  };

  // make empty inputs on chnging network or wallet
  useEffect(() => {
    makeEmptyInputs();
  }, [addressData]);

  // update variables with contracts data
  useEffect(() => {
    if (chainId) {
      setUserChainId(chainId);
      const config = chainConfig(chainId);
      setTitleText(config.title);
      setSelectedImg(config.icon);
      setPayTokenList(config.payTokens);
    }

    if (balanceData) {
      const _value = formatUnits(balanceData.value, balanceData.decimals);
      const _totalDeciNum = _value.split(".")[1]?.length || 0;
      const _fractionalPart = _value.split(".")[1] || "";
      const _match = _fractionalPart.match(/^0+/);
      const _matchZeros = _match ? _match[0].length : 0;
      let _toFixedNum = 0;
      if (_matchZeros > 0) {
        _toFixedNum = _matchZeros + 1;
      } else if (_totalDeciNum >= 1) {
        _toFixedNum = 2;
      } else {
        _toFixedNum = 0;
      }
      const _balance = Number(_value).toFixed(_toFixedNum);
      setUserBalance(`${_balance} ${balanceData.symbol}`);
    }
  }, [chainId]);

  // handle payment input
  const handlePaymentInput = (e) => {
    let _inputValue = e.target.value;
    setBuyAmount(_inputValue);
    const _payUsd = parseFloat(_inputValue * currentPrice);
    setPaymentUsd(_payUsd);
    const _payListing = parseFloat(_inputValue * listingPrice);
    setListingPayAmount(_payListing);
  };

  const getNativeToUsd = async (_chainSymbol) => {
    var requestOptions = { method: "GET", redirect: "follow" };
    return fetch(
      `https://api.coinbase.com/v2/exchange-rates?currency=${_chainSymbol}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        return result.data.rates.USD;
      })
      .catch((error) => {
        return ("error", error);
      });
  };

  // handle payment input
  const handlePaymentInputBuy = async (e) => {
    let _inputValue = e.target.value;
    setPaymentAmount(_inputValue);
    setBuyAmount(_inputValue);
    const symbol = payTokenList?.[0]?.name || "ETH";
    const usdRate = await getNativeToUsd(symbol);
    const _payUsd = parseFloat(_inputValue * usdRate);
    setPaymentUsd(_payUsd);
    const _getToken = parseInt(_payUsd / currentPrice);
    setBuyAmount(_getToken);
    const _bonusAmount = parseInt((_getToken * purchaseBonus) / 100);
    setBonusAmount(_bonusAmount);
    const _totalAmount = _getToken + _bonusAmount;
    setTotalAmount(_totalAmount);
  };

  // handle payment input
  const handlePayTokenInput = (e) => {
    let _inputValue = e.target.value;
    setPaymentAmount(_inputValue);
    setPaymentUsd(_inputValue);
    const _getToken = parseInt(_inputValue / currentPrice);
    setBuyAmount(_getToken);
    const _bonusAmount = parseInt((_getToken * purchaseBonus) / 100);
    setBonusAmount(_bonusAmount);
    const _totalAmount = _getToken + _bonusAmount;
    setTotalAmount(_totalAmount);
  };

  return (
    <AizonContext.Provider
      value={{
        //theme mode, color
        themeModes,
        themeColors,
        themeMode,
        setThemeMode,
        themeColor,
        setThemeColor,
        colors,

        isSidebarVisible,
        setIsSidebarVisible,
        open,
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
        //user balance
        userBalance,
        usdtBalance,
        usdcBalance,
        //token
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
        //presale
        maxStage,
        stages,
        currentStage,
        currentPrice,
        listingPrice,
        stageEnd,
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

        //stake
        totalStaked,
        totalReward,
        stakeLevelId,
        stakeLevels,
        userStakeLevelId,
        userStakeAmount,
        userStakeLockTime,
        userGetRewardAmount,
      }}
    >
      {children}
    </AizonContext.Provider>
  );
};

export default AizonContextProvider;
