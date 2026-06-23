import React from "react";
import { NavLink } from "react-router-dom";
import { useAizonData } from "../../utils/AizonContext";
import Data from "../../assets/data/leaderbords";

import Rank1Img from "../../assets/images/icons/rank1.svg?react";
import Rank2Img from "../../assets/images/icons/rank2.svg?react";
import Rank3Img from "../../assets/images/icons/rank3.svg?react";
import Rank4Img from "../../assets/images/icons/rank4.svg?react";

const Leaderboard = () => {
  const { tokenSymbol } = useAizonData();

  return (
    <div className="h-full rounded-[15px] relative overflow-hidden bg-card flex flex-col justify-between">
      <div className="px-5 md:px-6.25 2xl:px-10">
        <div className="pt-5 2xl:pt-7 pb-5 2xl:pb-5 flex items-center gap-3 flex-wrap justify-between">
          <h2 className="aizon-title uppercase font-chakrapetch font-bold text-secondary">
            Leaderboard
          </h2>

          <NavLink
            to="/leaderboard"
            className="flex items-center gap-1.5 uppercase text-base font-medium text-primary"
          >
            <span className="hidden xs:block">View</span>
            <span>More</span>
          </NavLink>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="font-chakrapetch">
                <th className="w-35 pb-2.5 text-left uppercase text-sm font-bold text-secondary-80">
                  #Rank
                </th>
                <th className="pb-2.5 px-2 xs:px-4 text-left uppercase text-sm font-bold text-secondary-80">
                  Wallet
                </th>
                <th className="pb-2.5 text-right uppercase text-sm font-bold text-secondary-80">
                  <div className="flex items-center justify-end gap-1">
                    Total <span className="hidden sm:block">Transactions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {Data.length === 0 && (
                <tr><td colSpan={3} className="py-6 text-center text-secondary-80 font-chakrapetch uppercase">No participants yet</td></tr>
              )}
              {Data?.slice(0, 5).map((item, i) => (
                <tr key={i} className="border-t border-t-secondary-12">
                  <td className="w-[33%] relative py-4">
                    <div className="w-6.5 h-6.5 relative flex items-center justify-center text-base font-semibold">
                      {i == 0 && (
                        <Rank1Img className="absolute z-0 top-0 left-0 w-6.5 h-6.5" />
                      )}

                      {i == 1 && (
                        <Rank2Img className="absolute z-0 top-0 left-0 w-6.5 h-6.5" />
                      )}
                      {i == 2 && (
                        <Rank3Img className="absolute z-0 top-0 left-0 w-6.5 h-6.5" />
                      )}
                      {!(i == 0 || i == 1 || i == 2) && (
                        <Rank4Img className="absolute z-0 top-0 left-0 w-6.5 h-6.5" />
                      )}

                      <span
                        className={`z-1 ${i < 3 ? "text-white" : "text-secondary"}`}
                      >
                        {i + 1}
                      </span>
                    </div>
                  </td>
                  <td className="w-[33%] py-4 px-2 xs:px-4 uppercase text-sm xs:text-base font-medium text-secondary-80">
                    <span className="hidden sm:block">
                      {item.walletAddress.slice(0, 5)}...
                      {item.walletAddress.slice(-5)}
                    </span>
                    <span className="block sm:hidden">
                      {item.walletAddress.slice(0, 3)}...
                      {item.walletAddress.slice(-2)}
                    </span>
                  </td>
                  <td className="w-[33%] py-4 text-right text-sm xs:text-base font-medium text-secondary-80">
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-secondary">
                        {Number(item.totalAmount).toLocaleString()}
                      </span>{" "}
                      {tokenSymbol}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {Data.length > 0 && (
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <tbody>
              <tr className="bg-surface flex items-center justify-between">
                <td className="w-[66%] pl-5 md:pl-6.25 2xl:pl-10 py-4 uppercase text-sm xs:text-base font-medium text-secondary">
                  <span>Leaderboard updates as the presale progresses</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
