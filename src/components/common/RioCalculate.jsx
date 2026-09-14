import React, { useMemo, useState } from "react";
import { useAizonData } from "../../utils/AizonContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

// Estimated ROI calculator.
// Every figure that depends on listingPrice is an ESTIMATE based on the
// projected listing price from the context (0.096 USDT). It is not a promise
// or a guarantee of any future price, and the UI says so explicitly.
const RioCalculate = () => {
  const { tokenSymbol, maxStage, stages, currentStage, listingPrice } =
    useAizonData();

  const MIN = 1;
  const MAX = maxStage;

  const [buyAmount, setBuyAmount] = useState("");
  const [stage, setStage] = useState(currentStage);

  // All derived values come from (stage, buyAmount) so the stage slider,
  // arrows and the amount field can never get out of sync.
  const price = Number(stages[stage - 1]);
  const amount = Number(buyAmount) || 0;
  const paymentUsd = useMemo(() => amount * price, [amount, price]);
  const listingPayAmount = useMemo(
    () => amount * Number(listingPrice),
    [amount, listingPrice],
  );
  const roiPercentage = useMemo(() => {
    if (!price || price <= 0 || !listingPrice) return 0;
    return (((Number(listingPrice) - price) / price) * 100).toFixed(0);
  }, [price, listingPrice]);

  const filled = ((stage - MIN) / (MAX - MIN)) * 100;

  const decrease = () => stage > MIN && setStage(Number(stage) - 1);
  const increase = () => stage < MAX && setStage(Number(stage) + 1);
  const handleStageChange = (e) => setStage(Number(e.target.value));
  const handlePaymentInput = (e) => setBuyAmount(e.target.value);

  return (
    <div className="h-full rounded-[15px] px-5 md:px-6.25 2xl:px-10 pb-4.25 bg-card">
      {/* title */}
      <div className="pt-5 md:pt-7 mb-1">
        <h2 className="aizon-title uppercase font-chakrapetch font-bold text-secondary">
          Estimated ROI
        </h2>
      </div>
      <p className="mb-4 sm:mb-5.5 font-chakrapetch text-xs text-secondary-70">
        Based on a projected listing price of {listingPrice} USDT. This is an
        estimate, not a promise or guarantee of any future price.
      </p>

      <div className="mb-6.25 font-chakrapetch font-bold uppercase">
        <label className="block mb-1 text-base text-secondary">
          Amount of {tokenSymbol}
        </label>

        <div className="relative">
          <input
            type="number"
            min="0"
            className="w-full rounded-xl border-2 border-secondary-8 px-3.75 py-3.5 bg-secondary-3 text-xl text-secondary"
            placeholder="Enter Amount"
            value={buyAmount}
            onChange={handlePaymentInput}
          />

          <button className="absolute top-1/2 right-5 -translate-y-1/2 px-2.5 py-0.75 rounded-[10px] bg-primary-10 font-chakrapetch uppercase text-base font-bold text-primary">
            {tokenSymbol}
          </button>
        </div>
      </div>

      <div className="mb-6.25 font-chakrapetch font-bold uppercase">
        <label className="block mb-1 text-base text-secondary">
          Cost at this stage (USDT)
        </label>
        <input
          type="number"
          className="w-full rounded-xl border-2 border-secondary-8 px-3.75 py-3.5 bg-secondary-3 text-xl text-secondary"
          placeholder="0.00"
          value={paymentUsd.toFixed(2)}
          disabled
        />
      </div>

      <div className="mb-6.25 font-chakrapetch font-bold uppercase">
        <label className="block mb-1 text-base text-secondary">
          Est. value at listing (USDT)
        </label>
        <input
          type="number"
          className="w-full rounded-xl border-2 border-secondary-8 px-3.75 py-3.5 bg-secondary-3 text-xl text-secondary"
          placeholder="0.00"
          value={listingPayAmount.toFixed(2)}
          disabled
        />
      </div>

      <div className="mb-6.25">
        {/* stage & price info */}
        <div className="mb-5 flex gap-2 flex-wrap items-center justify-between font-chakrapetch font-bold uppercase">
          <h4 className="text-[20px] text-secondary">
            Stage <span className="text-primary">{stage}</span>
          </h4>

          <h5 className="text-base text-secondary">
            Price: <span className="text-primary">${stages[stage - 1]}</span>
          </h5>
        </div>

        {/* Slider */}
        <div className="flex items-center gap-1.25">
          {/* Left Button */}
          <button
            onClick={decrease}
            className="grow-0 shrink-0 w-7.5 h-7.5 rounded-full flex items-center justify-center bg-secondary-10 text-base text-secondary-50 transition-all hover:bg-secondary-20 hover:text-secondary"
            disabled={stage === MIN}
          >
            <FaChevronLeft />
          </button>

          {/* Range */}
          <input
            type="range"
            min={MIN}
            max={MAX}
            value={stage}
            onChange={handleStageChange}
            className="range-slider"
            style={{
              background: `linear-gradient(
          to right,
          var(--color-primary) ${filled}%,
          var(--color-secondary-10) ${filled}%
        )`,
            }}
          />

          {/* Right Button */}
          <button
            onClick={increase}
            className="grow-0 shrink-0 w-7.5 h-7.5 rounded-full flex items-center justify-center bg-secondary-10 text-base text-secondary-50 transition-all hover:bg-secondary-20 hover:text-secondary"
            disabled={stage === MAX}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="text-center">
        <h2 className="uppercase font-chakrapetch font-bold text-[22px] xs:text-[24px] 2xl:text-[30px] text-secondary">
          Est. ROI: <span className="text-primary">{roiPercentage}%</span>
        </h2>
        <p className="mt-1 font-chakrapetch text-xs text-secondary-70">
          Projection only. Actual results depend on market conditions.
        </p>
      </div>
    </div>
  );
};

export default RioCalculate;
