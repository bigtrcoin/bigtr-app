import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useAizonData } from "../../utils/AizonContext";
import DropdownChain from "./DropdownChain";

import { FaCircle } from "react-icons/fa6";

const BuyCard = () => {
  const {
    themeMode,
    formatNumber,
    userBalance,
    usdtBalance,
    usdcBalance,
    payTokenList,
    payTokenId,
    setPayTokenId,
    switchChain,
    makeEmptyInputs,
    ethChainId,
    bnbChainId,
    selectedImg,
    titleText,
    setIsActiveBuyOnEth,
    setIsActiveBuyOnBnb,
    tokenSymbol,
    currentPrice,
    nextPrice,
    raisedUsd,
    goalUsd,
    tokenPercent,
    purchaseBonus,
    buyAmount,
    bonusAmount,
    totalAmount,
    paymentUsd,
    paymentAmount,
    handlePaymentInputBuy,
    handlePayTokenInput,
  } = useAizonData();

  const { referralAddress } = useParams();

  useEffect(() => {
    if (referralAddress) {
      sessionStorage.setItem("referralAddress", referralAddress);
    } else {
      sessionStorage.removeItem("referralAddress");
    }
  }, [referralAddress]);

  const handleTab = (item) => {
    event.preventDefault();
    makeEmptyInputs();
    setPayTokenId(item.id);
  };

  return (
    <div className="rounded-[15px] overflow-hidden bg-card">
      <div className="px-5 md:px-6.25 2xl:px-10 py-5 2xl:py-5.75 bg-surface flex items-start md:items-center justify-between gap-5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <FaCircle className="text-[12px] text-primary" />
          <h4 className="font-chakrapetch uppercase text-[15px] 2xl:text-base font-bold text-primary-70">
            Current Price: 1 {tokenSymbol} = ${currentPrice}
          </h4>
        </div>

        <div className="flex items-center gap-2.5">
          <FaCircle className="text-[12px] text-primary" />
          <h4 className="font-chakrapetch uppercase text-[15px] 2xl:text-base font-bold text-primary-70">
            Next Price: 1 {tokenSymbol} = ${nextPrice}
          </h4>
        </div>
      </div>

      <div className="px-5 md:px-6.25 2xl:px-10 pt-6 2xl:pt-7 pb-5 2xl:pb-10">
        <div className="mb-5 sm:mb-9">
          <div className="mb-5 sm:mb-7 flex items-center gap-4 flex-wrap justify-between">
            <h2 className="aizon-title font-chakrapetch uppercase font-bold text-secondary">
              Sale Progress
            </h2>
            <h4 className="aizon-title font-chakrapetch uppercase font-bold text-secondary">
              {tokenPercent}%
            </h4>
          </div>

          <div className="mb-6 w-full h-7.5 rounded-[10px] overflow-hidden bg-secondary-10 ">
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

        <Tabs>
          <div className="mb-5 sm:mb-9 flex items-center gap-5 2xl:gap-10 flex-wrap md:flex-nowrap">
            <div className="w-full sm:w-fit">
              <h4 className="block mb-2 font-chakrapetch uppercase text-base font-bold text-secondary">
                Select chain
              </h4>

              {/* dropdown chain */}
              <DropdownChain
                selectedImg={selectedImg}
                titleText={titleText}
                setIsActiveBuyOnEth={setIsActiveBuyOnEth}
                setIsActiveBuyOnBnb={setIsActiveBuyOnBnb}
                switchChain={switchChain}
                makeEmptyInputs={makeEmptyInputs}
                ethChainId={ethChainId}
                bnbChainId={bnbChainId}
              />
            </div>

            <div className="w-full sm:w-fit">
              <h4 className="block mb-2 font-chakrapetch uppercase text-base font-bold text-secondary">
                Payment Method
              </h4>

              <TabList className="w-full grid grid-cols-3 gap-2 2xl:gap-3.75">
                {payTokenList?.map((item, i) => (
                  <Tab key={i} onClick={() => handleTab(item)}>
                    <div className="w-7.5 h-7.5 rounded-full relative">
                      <img
                        src={item.img}
                        alt="icon"
                        className="w-full h-full"
                      />

                      <div
                        className={`absolute -bottom-0.75 -right-1.5 w-4.5 h-4.5 rounded-full flex items-center justify-center  ${themeMode == "dark" ? "bg-[#26242B]" : "bg-[#f7f8f8]"}`}
                      >
                        <img
                          src={selectedImg}
                          alt="icon"
                          className="w-3.5 h-3.5"
                        />
                      </div>
                    </div>
                    <span className="text-secondary">{item.name}</span>
                  </Tab>
                ))}
              </TabList>
            </div>
          </div>

          {payTokenList?.map((item, i) => (
            <TabPanel key={i}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-7.5">
                <div className="mb-5 sm:mb-10">
                  <div className="mb-2 flex items-center gap-2 justify-between">
                    <label className="block font-chakrapetch uppercase text-base font-bold text-secondary">
                      Pay Token
                    </label>

                    {payTokenId == 1 && (
                      <p className="font-chakrapetch uppercase text-right text-sm text-secondary">
                        {userBalance} : Balance
                      </p>
                    )}
                    {payTokenId == 2 && (
                      <p className="font-chakrapetch uppercase text-right text-sm text-secondary">
                        {formatNumber(usdtBalance)} {item.name} : Balance
                      </p>
                    )}
                    {payTokenId == 3 && (
                      <p className="font-chakrapetch uppercase text-right text-sm text-secondary">
                        {formatNumber(usdcBalance)} {item.name} : Balance
                      </p>
                    )}
                  </div>

                  {payTokenId == 1 && (
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full rounded-[18px] px-4 sm:px-5 py-3 sm:py-5.5 pr-20 bg-secondary-3 border-2 border-secondary-8 font-chakrapetch text-lg sm:text-2xl font-bold text-secondary transition focus:outline-none"
                        placeholder="Enter Amount"
                        value={paymentAmount}
                        onChange={handlePaymentInputBuy}
                      />

                      <div className="absolute top-1/2 right-4 sm:right-5 -translate-y-1/2 flex items-center gap-2">
                        <button className="cursor-default px-2.5 py-0.75 rounded-[10px] bg-secondary-12 font-chakrapetch uppercase text-base sm:text-lg font-bold text-secondary-50">
                          {payTokenList[0]?.name}
                        </button>
                      </div>
                    </div>
                  )}

                  {payTokenId == 2 && (
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full rounded-[18px] px-4 sm:px-5 py-3 sm:py-5.5 pr-20 bg-secondary-3 border-2 border-secondary-8 font-chakrapetch text-lg sm:text-2xl font-bold text-secondary transition focus:outline-none"
                        placeholder="Enter Amount"
                        value={
                          paymentAmount === "" || paymentAmount === 0
                            ? "Enter Amount"
                            : paymentAmount
                        }
                        onChange={handlePayTokenInput}
                      />

                      <div className="absolute top-1/2 right-4 sm:right-5 -translate-y-1/2 flex items-center gap-2">
                        <button className="cursor-default px-2.5 py-0.75 rounded-[10px] bg-secondary-12 font-chakrapetch uppercase text-base sm:text-lg font-bold text-secondary-50">
                          {item.name}
                        </button>
                      </div>
                    </div>
                  )}

                  {payTokenId == 3 && (
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full rounded-[18px] px-4 sm:px-5 py-3 sm:py-5.5 pr-20 bg-secondary-3 border-2 border-secondary-8 font-chakrapetch text-lg sm:text-2xl font-bold text-secondary transition focus:outline-none"
                        placeholder="Enter Amount"
                        value={
                          paymentAmount === "" || paymentAmount === 0
                            ? "Enter Amount"
                            : paymentAmount
                        }
                        onChange={handlePayTokenInput}
                      />

                      <div className="absolute top-1/2 right-4 sm:right-5 -translate-y-1/2 flex items-center gap-2">
                        <button className="cursor-default px-2.5 py-0.75 rounded-[10px] bg-secondary-12 font-chakrapetch uppercase text-base sm:text-lg font-bold text-secondary-50">
                          {item.name}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-5 sm:mb-10">
                  <label className="block mb-2 font-chakrapetch uppercase text-base font-bold text-secondary">
                    Usd Value
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      className="w-full rounded-[18px] px-4 sm:px-5 py-3 sm:py-5.5 pr-20 bg-secondary-3 border-2 border-secondary-8 font-chakrapetch text-lg sm:text-2xl font-bold text-secondary transition focus:outline-none"
                      disabled
                      value={Number(paymentUsd).toFixed(2)}
                    />

                    <button className="cursor-default absolute top-1/2 right-4 sm:right-5 -translate-y-1/2 px-2.5 py-0.75 rounded-[10px] bg-secondary-12 font-chakrapetch uppercase text-base sm:text-lg font-bold text-secondary-50">
                      USD
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-5 sm:mb-10">
                <label className="block mb-2 font-chakrapetch uppercase text-base font-bold text-secondary">
                  Get Token
                </label>

                <div className="relative w-full rounded-[18px] px-4 sm:px-5 py-3 sm:py-5.5 bg-secondary-3 border-2 border-secondary-8">
                  <input
                    type="number"
                    className="w-full bg-transparent font-chakrapetch text-lg sm:text-2xl font-bold text-secondary transition focus:outline-none"
                    disabled
                    value={totalAmount}
                  />

                  <div className="flex sm:hidden items-center gap-2 flex-wrap">
                    <p className="uppercase font-chakrapetch text-base font-bold text-secondary">
                      {buyAmount} + {bonusAmount}{" "}
                      <span className="text-primary">
                        ({purchaseBonus}% Bonus)
                      </span>
                    </p>
                    <button className="cursor-default px-2.5 py-0.75 rounded-[10px] bg-secondary-12 font-chakrapetch uppercase text-base sm:text-lg font-bold text-secondary-50">
                      {tokenSymbol}
                    </button>
                  </div>

                  <div className="absolute top-1/2 right-4 sm:right-5 -translate-y-1/2 hidden sm:flex items-center gap-2">
                    <p className="uppercase font-chakrapetch text-base font-bold text-secondary">
                      {buyAmount} + {bonusAmount}{" "}
                      <span className="text-primary">
                        ({purchaseBonus}% Bonus)
                      </span>
                    </p>
                    <button className="cursor-default px-2.5 py-0.75 rounded-[10px] bg-secondary-12 font-chakrapetch uppercase text-base sm:text-lg font-bold text-secondary-50">
                      {tokenSymbol}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-7.5">
                <button className="aizon-btn w-full rounded-[18px] px-3 py-5 md:py-7.5 bg-primary font-chakrapetch uppercase text-[18px] leading-none font-bold text-btn-text">
                  <span className="btn-inner">
                    <span className="btn-normal-text">Buy Now</span>
                    <span className="btn-hover-text">Buy Now</span>
                  </span>
                </button>
              </div>

              <button className="aizon-btn w-full rounded-[18px] px-3 py-5 md:py-7.5 bg-primary-15 font-chakrapetch uppercase text-[18px] leading-7 font-bold text-primary">
                <span className="btn-inner">
                  <span className="btn-normal-text">
                    Buy And Stake for 150% Rewards
                  </span>
                  <span className="btn-hover-text">
                    Buy And Stake for 150% Rewards
                  </span>
                </span>
              </button>
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default BuyCard;
