import React from "react";
import { useAizonData } from "../../utils/AizonContext";
import rewardListData from "../../assets/data/rewardList";

const MyRewards = () => {
  const { tokenSymbol, userReferredTokens, userReferredPay } = useAizonData();

  return (
    <div className="mt-7.5 rounded-[15px] p-6.25 2xl:p-10 bg-card">
      <div className="mb-5">
        <h2 className="aizon-title font-chakrapetch uppercase font-bold text-secondary">
          My Rewards
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 2xl:gap-7.5">
        <div className="col-span-1 lg:col-span-4 grid gap-5 2xl:gap-6">
          <div className="rounded-[15px] px-5 md:px-6.75 2xl:px-7.5 py-5 2xl:py-5.5 bg-secondary-6 flex flex-col justify-center">
            <h2 className="mb-1.5 font-chakrapetch text-2xl md:text-3xl font-bold text-secondary">
              ${userReferredPay.toLocaleString()}
            </h2>
            <h4 className="text-sm md:text-base font-medium text-secondary-90">
              Total Referral Earnings
            </h4>
          </div>

          <div className="rounded-[15px] px-5 md:px-6.75 2xl:px-7.5 py-5 2xl:py-5.5 bg-secondary-6 flex flex-col justify-center">
            <h2 className="mb-1.5 font-chakrapetch text-2xl md:text-3xl font-bold text-secondary">
              {userReferredTokens.toLocaleString()}
            </h2>
            <h4 className="text-sm md:text-base font-medium text-secondary-90">
              {tokenSymbol} Token Earnings
            </h4>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {rewardListData?.map((item, i) => (
            <div key={i} className="rounded-[15px] overflow-hidden bg-secondary-6 h-fit">
              {item.referralTotals?.map((rewardsItem, j) => (
                <div
                  key={j}
                  className="referrel-list border-0 border-b border-secondary-12 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={rewardsItem.image}
                      alt="icon"
                      className="w-5 md:w-6.5 2xl:w-7.5 h-5 md:h-6.5 2xl:h-7.5 rounded-full"
                    />

                    <h4 className="font-chakrapetch uppercase text-base font-bold text-secondary">
                      {rewardsItem.method}
                    </h4>
                  </div>
                  <div className="">
                    <h4 className="font-chakrapetch uppercase text-base font-bold text-secondary">
                      ${rewardsItem.total}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyRewards;
