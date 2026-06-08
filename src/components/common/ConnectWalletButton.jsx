import { useEffect, useState } from "react";
import { useAppKit } from "@reown/appkit/react";
import { useConnection, useBalance, useChainId, useChains } from "wagmi";
import { formatUnits } from "viem";
import chainsInfo from "../../assets/data/chainsInfo";
import { useAizonData } from "../../utils/AizonContext";

import { FiChevronDown } from "react-icons/fi";

const ConnectWalletButton = ({width}) => {
  const { themeMode } = useAizonData();

  const { open } = useAppKit(); // controls modal

  const [walletAddress, setWalletAddress] = useState("");
  const [shortWalletAddress, setShortWalletAddress] = useState("");
  const [userChainInfo, setUserChainInfo] = useState({
    name: chainsInfo[0].name,
    symbol: chainsInfo[0].symbol,
    icon: chainsInfo[0].icon,
  });
  const [userBalance, setUserBalance] = useState("0");

  const chainId = useChainId();
  const chains = useChains();
  const { address: addressData, isConnected, chain } = useConnection();
  const { data: balanceData } = useBalance({
    address: addressData,
  });

  useEffect(() => {
    if (isConnected) {
      let first = addressData.slice(0, 4);
      let last = addressData.slice(-4);
      setWalletAddress(first + "..." + last);

      let first2 = addressData.slice(0, 4);
      let last2 = addressData.slice(-2);
      setShortWalletAddress(first2 + "..." + last2);

      if (chainId && chainsInfo) {
        const _chainInfo = chainsInfo.find((chain) => chain.id === chainId);
        const _result = {
          name: _chainInfo.name,
          symbol: _chainInfo.symbol,
          icon: _chainInfo.icon,
        };
        setUserChainInfo(_result);
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
    }
  }, [chainId, chains, isConnected, addressData, chain, balanceData]);

  return (
    <div className="flex items-center gap-2.5">
      {/* Connect Wallet Button */}
      {!isConnected && (
        <button
          className="aizon-btn bg-primary rounded-[15px] h-12.5 px-6 py-4 flex gap-2 font-chakrapetch text-base leading-none font-bold text-btn-text uppercase"
          onClick={() => open({ view: "Connect" })}
          style={{width: width}}
        >
          <span className="btn-inner">
            <span className="btn-normal-text flex items-center gap-1">
              Connect <div className="hidden xl:block">Wallet</div>
            </span>
            <span className="btn-hover-text flex! items-center gap-1">
              Connect <div className="hidden xl:block">Wallet</div>
            </span>
          </span>
        </button>
      )}

      {/* Chain Selector */}
      {isConnected && (
        <button
          className={`rounded-[15px] h-12.5 px-2 2xl:px-3 py-4 hidden xl:flex items-center gap-2 font-chakrapetch text-base leading-none font-bold text-secondary uppercase ${themeMode == "dark" ? "bg-secondary-15" : "bg-secondary-8"}`}
          onClick={() => open({ view: "Networks" })}
          style={{width: width}}
        >
          <img
            src={userChainInfo.icon}
            alt="icon"
            className="w-6 h-6 rounded-[50%]"
          />
          <span className="hidden 2xl:block">{userChainInfo.symbol}</span>
          <FiChevronDown />
        </button>
      )}

      {/* Account Button */}
      {isConnected && (
        <button
          className={`rounded-[15px] h-12.5 p-1.25 flex items-center justify-center gap-2 font-chakrapetch text-base leading-none font-bold text-secondary uppercase ${themeMode == "dark" ? "bg-secondary-15" : "bg-secondary-8"}`}
          onClick={() => open({ view: "Account" })}
          style={{width: width}}
        >
          <p className="hidden 2xl:block px-1.75">{userBalance}</p>

          <div className="2xl:bg-secondary-8 rounded-[13px] h-10 px-2 2xl:px-3 py-3 flex items-center gap-1">
            <span className="hidden 2xl:block">{walletAddress}</span>
            <span className="block 2xl:hidden">{shortWalletAddress}</span>
            <FiChevronDown />
          </div>
        </button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
