import React, { useEffect, useState } from "react";
import { useAizonData } from "../../utils/AizonContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const RioCalculate = () => {
  const { tokenSymbol, maxStage, stages, currentStage, listingPrice } =
    useAizonData();

  const [buyAmount, setBuyAmount] = useState(0);
  const [paymentUsd, setPaymentUsd] = useState(0);
  const [listingPayAmount, setListingPayAmount] = useState(0);
  const [rioPercentage, setRioPercentage] = useState(0);

  const MIN = 1;
  const MAX = maxStage;

  const [stage, setStage] = useState(currentStage);

  const price = stages[stage - 1];
  const filled = ((stage - MIN) / (MAX - MIN)) * 100;

  const decrease = () => {
    if (stage > MIN) {
      setStage(Number(stage) - 1);

      const _price = stages[stage - 2];
      const _payUsd = parseFloat(buyAmount * _price);
      setPaymentUsd(_payUsd);
      const _payListing = parseFloat(buyAmount * listingPrice);
      setListingPayAmount(_payListing);
    }
  };

  const increase = () => {
    if (stage < MAX) {
      setStage(Number(stage) + 1);

      const _price = stages[stage];
      const _payUsd = parseFloat(buyAmount * _price);
      setPaymentUsd(_payUsd);
      const _payListing = parseFloat(buyAmount * listingPrice);
      setListingPayAmount(_payListing);
    }
  };

  const handleStageChange = (e) => {
    e.preventDefault();
    let _inputValue = e.target.value;
    setStage(_inputValue);

    if (buyAmount != "") {
      const _payUsd = parseFloat(buyAmount * price);
      setPaymentUsd(_payUsd);
      const _payListing = parseFloat(buyAmount * listingPrice);
      setListingPayAmount(_payListing);
    }
  };

  // handle payment input
  const handlePaymentInput = (e) => {
    e.preventDefault();
    let _inputValue = e.target.value;
    setBuyAmount(_inputValue);
    const _payUsd = parseFloat(_inputValue * price);
    setPaymentUsd(_payUsd);
    const _payListing = parseFloat(_inputValue * listingPrice);
    setListingPayAmount(_payListing);
  };

  useEffect(() => {
    const calculateRIO = (stagePrice, listingPrice) => {
      if (!stagePrice || stagePrice <= 0 || !listingPrice) return 0;

      const _rio = (((listingPrice - stagePrice) / stagePrice) * 100).toFixed(
        0,
      );
      setRioPercentage(_rio);
    };

    calculateRIO(price, listingPrice);
  }, [stage, price, listingPrice]);

  return (
    <div className="h-full rounded-[15px] px-5 md:px-6.25 2xl:px-10 pb-4.25 bg-card">
      {/* title */}
      <div className="pt-5 md:pt-7 mb-4 sm:mb-5.5">
        <h2 className="aizon-title uppercase font-chakrapetch font-bold text-secondary">
          Rio Calculate
        </h2>
      </div>

      <div className="mb-6.25 font-chakrapetch font-bold uppercase">
        <label className="block mb-1 text-base text-secondary">
          Amount of {tokenSymbol}
        </label>

        <div className="relative">
          <input
            type="number"
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
          USD Amount
        </label>
        <input
          type="number"
          className="w-full rounded-xl border-2 border-secondary-8 px-3.75 py-3.5 bg-secondary-3 text-xl text-secondary"
          placeholder="0.00"
          value={Number(paymentUsd).toFixed(2)}
          disabled
        />
      </div>

      <div className="mb-6.25 font-chakrapetch font-bold uppercase">
        <label className="block mb-1 text-base text-secondary">
          Listing Price
        </label>
        <input
          type="number"
          className="w-full rounded-xl border-2 border-secondary-8 px-3.75 py-3.5 bg-secondary-3 text-xl text-secondary"
          placeholder="0.00"
          value={Number(listingPayAmount).toFixed(2)}
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
            Price: <span className="text-primary">${price}</span>
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
          RIO: <span className="text-primary">{rioPercentage}%</span>
        </h2>
      </div>
    </div>
  );
};

export default RioCalculate;
