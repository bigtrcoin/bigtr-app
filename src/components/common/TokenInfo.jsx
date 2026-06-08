import React, { useState } from "react";
import { useAizonData } from "../../utils/AizonContext";

import { FaCheck } from "react-icons/fa6";
import { TbCopy } from "react-icons/tb";

const TokenInfo = ({ variant }) => {
  const { tokenAddress, tokenName, tokenSymbol, tokenTotalSupply } =
    useAizonData();

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tokenAddress);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 4000);
  };

  return (
    <div className="h-full rounded-[15px] px-5 md:px-6.25 2xl:px-10 pb-6.75 bg-card">
      <div className="pt-5 md:pt-6.25 mb-5 sm:mb-5.5">
        <h2 className="aizon-title uppercase font-chakrapetch font-bold text-secondary">
          Token Info
        </h2>
      </div>

      <ul className="">
        <li className="pb-3.5 border-b border-b-secondary-12 flex items-center gap-3 justify-between">
          <p className="capitalize text-[15px] 2xl:text-base font-medium text-secondary-80">
            Token name
          </p>
          <h4 className="text-right text-[15px] 2xl:text-base font-semibold text-secondary">
            {tokenName}
          </h4>
        </li>
        <li className="py-3.5 border-b border-b-secondary-12 flex items-center gap-3 justify-between">
          <p className="capitalize text-[15px] 2xl:text-base font-medium text-secondary-80">
            symbol
          </p>
          <h4 className="text-right text-[15px] 2xl:text-base font-semibold text-secondary">
            {tokenSymbol}
          </h4>
        </li>
        <li className="py-3.5 border-b border-b-secondary-12 flex items-center gap-3 justify-between">
          <p className="capitalize text-[15px] 2xl:text-base font-medium text-secondary-80">
            Total Supply
          </p>
          <h4 className="text-right text-[15px] 2xl:text-base font-semibold text-secondary">
            {tokenTotalSupply.toLocaleString()}
          </h4>
        </li>
        <li className="pt-3.5 flex items-center gap-3 justify-between">
          <p className="capitalize text-[15px] 2xl:text-base font-medium text-secondary-80">
            Address
          </p>

          <div className="flex items-center gap-1">
            <button
              className="text-xl font-bold text-primary"
              onClick={copyToClipboard}
            >
              {copied ? <FaCheck /> : <TbCopy />}
            </button>

            {tokenAddress && (
              <h4 className="text-right text-[15px] 2xl:text-base font-semibold text-secondary">
                {tokenAddress.slice(0, 4) + "..." + tokenAddress.slice(-4)}
              </h4>
            )}
          </div>
        </li>

        {variant == "buy" && (
          <li className="pt-2 text-right">
            <p className="text-xs font-medium text-secondary-70">
              Don’t pay directly to this address*
            </p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default TokenInfo;
