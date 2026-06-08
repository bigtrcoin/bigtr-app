import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAizonData } from "../../utils/AizonContext";
import stakingInfo from "../../assets/data/stakingInfo";
import { useAizonModal } from "../../utils/ModalContext";
import StickyBox from "react-sticky-box";

const StakingSection = () => {
  const {
    themeMode,
    tokenSymbol,
    userTokenBalance,
    totalStaked,
    userStakeAmount,
    userGetRewardAmount,
  } = useAizonData();

  const { variantModalHanle } = useAizonModal();
  const [activeStakingInfoId, setActiveStakingInfoId] = useState(0);

  return (
    <section className="pb-6.25">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7.5">
        {/* left section */}
        <div className="col-span-1 lg:col-span-7">
          <StickyBox offsetTop={20} offsetBottom={0}>
            <div className="rounded-[15px] relative overflow-hidden">
              <div
                className={`absolute -z-1 top-0 left-0 w-full h-full ${themeMode == "dark" ? "opacity-[0.1] bg-linear-to-b from-secondary-20 to-secondary" : "opacity-100 bg-white"}`}
              ></div>

              <div
                className={`rounded-[15px] overflow-hidden px-5 md:px-6.25 2xl:px-10 pt-5 xl:pt-9 pb-5 xl:pb-12.5 ${themeMode == "dark" ? "bg-secondary-8" : "bg-secondary-12"}`}
              >
                <h2 className="mb-4 w-full max-w-100 md:max-w-129.75 font-chakrapetch uppercase text-3xl/10 sm:text-4xl/10 xl:text-[42px]/[52px] 2xl:text-[50px]/[60px] text- font-bold text-secondary">
                  Earn <span className="text-primary">up to 50%</span> apy
                  <br className="hidden xs:block" /> with staking
                </h2>
                <p className="w-full max-w-113.5 text-base leading-7.5! font-medium text-secondary-90">
                  By staking your {tokenSymbol}, you can earn an impressive
                  annual Percentage Yield upto 50%(APY)
                </p>
              </div>

              <div className="p-5 md:p-6.25 2xl:p-10">
                <h3 className="mb-6 font-chakrapetch uppercase text-xl sm:text-2xl md:text-3xl font-bold text-secondary">
                  Participate stake
                </h3>

                <h4 className="mb-4 font-chakrapetch uppercase text-base font-bold text-secondary">
                  Lock duration
                </h4>

                <div className="mb-9 grid grid-cols-4 gap-2 sm:gap-5">
                  {stakingInfo?.map((item, id) => (
                    <button
                      key={id}
                      className={`w-full relative rounded-[18px] px-4 sm:px-3.75 py-4 sm:py-4.75 border-2 bg-secondary-3 flex items-center justify-center font-chakrapetch uppercase text-sm sm:text-[18px] leading-none font-bold text-secondary ${
                        activeStakingInfoId == id
                          ? "border-primary"
                          : "border-secondary-8"
                      }`}
                      onClick={() => setActiveStakingInfoId(id)}
                    >
                      <div
                        className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-stroke flex items-center justify-center ${
                          activeStakingInfoId == id ? "block" : "hidden"
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>

                      <span>{item.stakeInfo.lockDuration / 86400} Days</span>
                    </button>
                  ))}
                </div>

                <div className="">
                  {stakingInfo?.map((item, id) => {
                    return (
                      <div
                        key={id}
                        className={`${
                          activeStakingInfoId == id ? "block" : "hidden"
                        }`}
                      >
                        <div className="mb-7 text-center">
                          <h3 className="font-chakrapetch uppercase text-2xl md:text-3xl font-bold text-secondary">
                            APY:{" "}
                            <span className="text-primary">
                              {item.stakeInfo.apy}%
                            </span>
                          </h3>
                        </div>

                        <div className="mb-7">
                          <label className="block mb-2 font-chakrapetch uppercase text-base font-bold text-secondary">
                            Amount to stake
                          </label>

                          <div className="relative">
                            <input
                              type="number"
                              className="w-full rounded-[18px] px-3 sm:px-5 py-4 sm:py-5.75 bg-secondary-3 border-2 border-secondary-8 font-chakrapetch text-lg sm:text-2xl font-bold text-secondary transition focus:outline-none"
                              placeholder="Enter Amount"
                            />

                            <button className="absolute top-1/2 right-3 sm:right-5 -translate-y-1/2 px-2.5 py-0.75 rounded-[10px] bg-[rgba(255,255,255,0.12)] font-chakrapetch uppercase text-lg font-bold text-secondary-50">
                              Max
                            </button>
                          </div>
                        </div>

                        <div className="">
                          <button className="aizon-btn w-full rounded-[18px] px-3 py-6 sm:py-7.75 bg-primary font-chakrapetch uppercase text-[18px] leading-none font-bold text-btn-text">
                            <span className="btn-inner">
                              <span className="btn-normal-text">Stake Now</span>
                              <span className="btn-hover-text">Stake Now</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </StickyBox>
        </div>

        {/* right section */}
        <div className="col-span-1 lg:col-span-5 grid gap-7.5">
          <div className="rounded-[15px] relative overflow-hidden">
            <div className="absolute -z-1 top-0 left-0 w-full h-full opacity-[0.2] bg-linear-to-b from-transparent to-primary"></div>

            <div className="rounded-[20px] px-5 md:px-6.25 2xl:px-10 pt-5 2xl:pt-7.25 pb-5 2xl:pb-8.75 bg-card flex items-end gap-4 flex-wrap">
              <div className="">
                <h4 className="mb-4 font-chakrapetch capitalize text-base font-bold text-secondary">
                  My Wallet
                </h4>
                <h2 className="font-chakrapetch capitalize text-2xl md:text-3xl font-bold text-secondary">
                  {userTokenBalance.toLocaleString()}{" "}
                  <span className="text-lg md:text-xl">{tokenSymbol}</span>
                </h2>
              </div>

              <div className="">
                <NavLink
                  to="/buy"
                  className="min-w-17.5 rounded-lg px-3 pt-2 pb-1.5 bg-secondary-10 flex items-center justify-center uppercase text-base leading-4 font-chakrapetch font-bold text-primary"
                >
                  Buy
                </NavLink>
              </div>
            </div>

            <div className="px-5 md:px-6.25 2xl:px-10 py-5 2xl:py-8 flex items-center justify-between gap-4 flex-wrap">
              <div className="">
                <h4 className="mb-4 font-chakrapetch capitalize text-base font-bold text-secondary">
                  Total Rewards
                </h4>
                <h2 className="font-chakrapetch capitalize text-2xl md:text-3xl font-bold text-secondary">
                  {userGetRewardAmount.toLocaleString()}{" "}
                  <span className="text-lg md:text-xl">{tokenSymbol}</span>
                </h2>
              </div>

              <div className="">
                <button
                  className={`aizon-btn min-w-45 rounded-[15px] p-3.25 font-chakrapetch uppercase text-base font-bold text-primary ${themeMode == "dark" ? "bg-secondary-10" : "bg-secondary"}`}
                  onClick={() => variantModalHanle("withdraw")}
                >
                  <span className="btn-inner">
                    <span className="btn-normal-text">Claim Rewards</span>
                    <span className="btn-hover-text">Claim Rewards</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[15px] px-5 md:px-6.25 2xl:px-10 py-5 2xl:py-10 bg-card flex items-center justify-between gap-4 flex-wrap">
            <div className="">
              <h4 className="mb-4 font-chakrapetch capitalize text-base font-bold text-secondary">
                Your token Staked
              </h4>
              <h2 className="font-chakrapetch capitalize text-2xl md:text-3xl font-bold text-secondary">
                {userStakeAmount.toLocaleString()}{" "}
                <span className="text-lg md:text-xl">{tokenSymbol}</span>
              </h2>
            </div>
            <div className="">
              <button
                className="aizon-btn min-w-45 rounded-[15px] p-3.25 bg-secondary-10 font-chakrapetch uppercase text-base font-bold text-secondary"
                onClick={() => variantModalHanle("unstake")}
              >
                <span className="btn-inner">
                  <span className="btn-normal-text">Unstake</span>
                  <span className="btn-hover-text">Unstake</span>
                </span>
              </button>
            </div>
          </div>

          <div className="rounded-[15px] px-5 md:px-6.25 2xl:px-10 py-5 2xl:py-10 bg-card">
            <h4 className="mb-4 font-chakrapetch capitalize text-base font-bold text-secondary">
              Availabe to stake
            </h4>
            <h2 className="font-chakrapetch capitalize text-2xl md:text-3xl font-bold text-secondary">
              23,500 <span className="text-lg md:text-xl">{tokenSymbol}</span>
            </h2>
          </div>

          <div className="rounded-[15px] px-5 md:px-6.25 2xl:px-10 py-5 2xl:py-10 bg-card">
            <h4 className="mb-4 font-chakrapetch capitalize text-base font-bold text-secondary">
              Total token staked
            </h4>
            <h2 className="font-chakrapetch capitalize text-2xl md:text-3xl font-bold text-secondary">
              {totalStaked.toLocaleString()}{" "}
              <span className="text-lg md:text-xl">{tokenSymbol}</span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StakingSection;
