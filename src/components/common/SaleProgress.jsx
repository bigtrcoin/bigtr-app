import React from "react";
import { useAizonData } from "../../utils/AizonContext";
import SaleChart from "./SaleChart";

import { FaCircle } from "react-icons/fa6";

const SaleProgress = () => {
  const {
    tokenSymbol,
    currentPrice,
    nextPrice,
    raisedUsd,
    goalUsd,
    tokenPercent,
  } = useAizonData();

  return (
    <div className="h-full rounded-[15px] overflow-hidden bg-card">
      <div className="px-5 md:px-6.25 2xl:px-10 pt-5 md:pt-7 pb-9">
        <div className="mb-7 flex items-center gap-4 flex-wrap justify-between">
          <h2 className="aizon-title font-chakrapetch uppercase font-bold text-secondary">
            Sale Progress
          </h2>
          <h4 className="font-chakrapetch uppercase text-xl md:text-3xl font-bold text-secondary">
            {tokenPercent}%
          </h4>
        </div>

        <div className="mb-4 w-full h-7.5 rounded-[10px] overflow-hidden bg-secondary-10 ">
          <div
            className="h-full bg-primary"
            style={{ width: `${tokenPercent}%` }}
          ></div>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-between">
          <p className="font-chakrapetch uppercase text-base font-bold text-secondary">
            <span className="text-secondary-80">Raised:</span>{" "}
            {raisedUsd.toLocaleString()} USD
          </p>
          <p className="font-chakrapetch uppercase text-base font-bold text-secondary">
            <span className="text-secondary-80">Goal:</span>{" "}
            {goalUsd.toLocaleString()} USD
          </p>
        </div>
      </div>

      <div className="px-5 md:px-6.25 2xl:px-10 py-3.25 mb-7.5 bg-surface flex items-center gap-4 2xl:gap-7 flex-wrap">
        <div className="flex items-center gap-2.5">
          <FaCircle className="text-[12px] text-primary" />
          <h4 className="font-chakrapetch uppercase text-[14px] sm:text-base font-bold text-primary-70">
            Current Price: 1 {tokenSymbol} = ${currentPrice}
          </h4>
        </div>

        <div className="flex items-center gap-2.5">
          <FaCircle className="text-[12px] text-primary" />
          <h4 className="font-chakrapetch uppercase text-[14px] sm:text-base font-bold text-primary-70">
            Next Price: 1 {tokenSymbol} = ${nextPrice}
          </h4>
        </div>
      </div>

      {/* chart */}
      <SaleChart />
    </div>
  );
};

export default SaleProgress;
