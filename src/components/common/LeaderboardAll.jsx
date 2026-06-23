import React from "react";
import Data from "../../assets/data/leaderbords";
import { useAizonData } from "../../utils/AizonContext";

import BgImg from "../../assets/images/bg/bg-leaderboard.svg?react";
import StarImg from "../../assets/images/bg/star.svg?react";
import Rank1Img from "../../assets/images/icons/rank1.svg?react";
import Rank2Img from "../../assets/images/icons/rank2.svg?react";
import Rank3Img from "../../assets/images/icons/rank3.svg?react";
import Rank4Img from "../../assets/images/icons/rank4.svg?react";

const LeaderboardAll = () => {
  const { themeMode, tokenSymbol } = useAizonData();

  return (
    <div
      className={`rounded-[15px] mb-6.25 overflow-hidden relative ${themeMode == "dark" ? "bg-card" : "bg-card"}`}
    >
      <div className="absolute z-1 top-25 xs:top-10 left-0 w-full">
        <BgImg className="w-full" />
      </div>

      <div className="absolute z-1 top-25 xs:top-15 sm:top-12.5 lg:top-0 left-0 w-full">
        <StarImg className="w-full animate-spin-slow2" />
      </div>

      {/* title */}
      <div className="px-5 md:px-10 pt-5 md:pt-8 pb-4">
        <h2 className="aizon-title uppercase font-chakrapetch font-bold text-secondary">
          Leaderboard
        </h2>
      </div>

      {/* leaderboard podium view */}
      {Data.length > 0 && (
      <div className="relative z-1 flex items-end justify-center">
        {/* 2nd place */}
        <div className="flex flex-col items-center gap-5">
          {/* Address + amount */}
          <div className="text-center">
            <p className="mb-2 font-chakrapetch font-bold text-xs xs:text-base sm:text-[20px] text-secondary">
              <span className="hidden sm:block">
                {Data[1]?.walletAddress?.slice(0, 5)}...
                {Data[1]?.walletAddress?.slice(-5)}
              </span>
              <span className="block sm:hidden">
                {Data[1]?.walletAddress?.slice(0, 4)}...
                {Data[1]?.walletAddress?.slice(-2)}
              </span>
            </p>
            <span className="flex items-center flex-col gap-0.5 xs:gap-1 xs:flex-row rounded-[10px] py-1.5 px-1.25 xs:px-2.5 bg-secondary-10 font-chakrapetch font-bold text-xs sm:text-base text-secondary">
              <span className="text-primary">
                {Number(Data[1]?.totalAmount || 0).toLocaleString()}
              </span>{" "}
              {tokenSymbol}
            </span>
          </div>
          {/* Podium */}
          <div className="w-full">
            {/* upper part */}
            <div
              className="w-22.5 xs:w-35 sm:w-42.5 md:w-44 lg:w-60 h-7.5 bg-primary-80"
              style={{
                clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0 100%)",
              }}
            ></div>
            {/* bar */}
            <div className="w-22.5 xs:w-35 sm:w-42.5 md:w-44 lg:w-60 h-22 xs:h-30 md:h-40 lg:h-52.5 bg-linear-to-b from-primary to-[#171717] flex items-start justify-center font-chakrapetch text-[40px] xs:text-[60px] md:text-[80px] lg:text-[100px] font-bold text-white ">
              2
            </div>
          </div>
        </div>

        {/* 1st place */}
        <div className="flex flex-col items-center gap-5">
          {/* Address + amount */}
          <div className="text-center">
            <p className="mb-2 font-chakrapetch font-bold text-xs xs:text-base sm:text-[20px] text-secondary">
              <span className="hidden sm:block">
                {Data[0]?.walletAddress?.slice(0, 5)}...
                {Data[0]?.walletAddress?.slice(-5)}
              </span>
              <span className="block sm:hidden">
                {Data[0]?.walletAddress?.slice(0, 4)}...
                {Data[0]?.walletAddress?.slice(-2)}
              </span>
            </p>
            <span className="flex items-center flex-col gap-0.5 xs:gap-1 xs:flex-row rounded-[10px] py-1.5 px-1.25 xs:px-2.5 bg-secondary-10 font-chakrapetch font-bold text-xs sm:text-base text-secondary">
              <span className="text-primary">
                {Number(Data[0]?.totalAmount || 0).toLocaleString()}
              </span>{" "}
              {tokenSymbol}
            </span>
          </div>
          {/* Podium */}
          <div className="w-full">
            {/* upper part */}
            <div
              className="w-22.5 xs:w-35 sm:w-42.5 md:w-44 lg:w-60 h-7.5 bg-primary-80"
              style={{
                clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0 100%)",
              }}
            ></div>
            {/* bar */}
            <div className="w-22.5 xs:w-35 sm:w-42.5 md:w-44 lg:w-60 h-30 xs:h-45 md:h-60 lg:h-75 bg-linear-to-b from-primary to-[#171717] flex items-start justify-center font-chakrapetch text-[40px] xs:text-[60px] md:text-[80px] lg:text-[100px] font-bold text-white ">
              1
            </div>
          </div>
        </div>

        {/* 3rd place */}
        <div className="flex flex-col items-center gap-5">
          {/* Address + amount */}
          <div className="text-center">
            <p className="mb-2 font-chakrapetch font-bold text-xs xs:text-base sm:text-[20px] text-secondary">
              <span className="hidden sm:block">
                {Data[2]?.walletAddress?.slice(0, 5)}...
                {Data[2]?.walletAddress?.slice(-5)}
              </span>
              <span className="block sm:hidden">
                {Data[2]?.walletAddress?.slice(0, 4)}...
                {Data[2]?.walletAddress?.slice(-2)}
              </span>
            </p>
            <span className="flex items-center flex-col gap-0.5 xs:gap-1 xs:flex-row rounded-[10px] py-1.5 px-1.25 xs:px-2.5 bg-secondary-10 font-chakrapetch font-bold text-xs sm:text-base text-secondary">
              <span className="text-primary">
                {Number(Data[2]?.totalAmount || 0).toLocaleString()}
              </span>{" "}
              {tokenSymbol}
            </span>
          </div>
          {/* Podium */}
          <div className="w-full">
            {/* upper part */}
            <div
              className="w-22.5 xs:w-35 sm:w-42.5 md:w-44 lg:w-60 h-7.5 bg-primary-80"
              style={{
                clipPath: "polygon(0% 0%, 80% 0%, 100% 100%, 0 100%)",
              }}
            ></div>
            {/* bar */}
            <div className="w-22.5 xs:w-35 sm:w-42.5 md:w-44 lg:w-60 h-15 xs:h-22 md:h-28 lg:h-37.5 bg-linear-to-b from-primary to-[#171717] flex items-start justify-center font-chakrapetch text-[40px] xs:text-[60px] md:text-[80px] lg:text-[100px] font-bold text-white ">
              3
            </div>
          </div>
        </div>
      </div>
      )}

      {/* user rank */}
      {Data.length > 0 && (
        <div className="mb-4 p-3.25 text-center bg-[linear-gradient(90deg,#ffffff00_0%,var(--color-secondary-6)_50%,#ffffff00_100%)]">
          <h2 className="uppercase font-chakrapetch font-bold text-[15px] md:text-[16px] text-secondary">
            Leaderboard updates as the presale progresses
          </h2>
        </div>
      )}

      {/* leaderboard table */}
      <div className="w-full overflow-x-auto pb-3">
        <table className="w-full">
          <thead>
            <tr>
              <th className="pl-5 md:pl-10 py-2.5 text-left uppercase text-sm font-bold text-secondary-80">
                # Rank
              </th>
              <th className="py-2.5 text-left uppercase text-sm font-bold text-secondary-80">
                <div className="flex items-center gap-1">
                  Wallet <span className="hidden sm:block">Address</span>
                </div>
              </th>
              <th className="pl-5 pr-5 md:pr-10 py-2.5 text-right uppercase text-sm font-bold text-secondary-80">
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
            {Data?.map((item, i) => (
              <tr
                key={i}
                className="border-t border-t-secondary-12 hover:bg-[#dbc8f90d]"
              >
                <td className="block relative pl-5 md:pl-10 py-4">
                  {i == 0 && (
                    <div className="absolute z-1 top-0 left-0 w-full max-w-112.5 h-full bg-linear-to-r from-primary-10"></div>
                  )}
                  {i == 1 && (
                    <div className="absolute z-1 top-0 left-0 w-full max-w-112.5 h-full bg-linear-to-r from-primary-6"></div>
                  )}
                  {i == 2 && (
                    <div className="absolute z-1 top-0 left-0 w-full max-w-112.5 h-full bg-linear-to-r from-primary-3"></div>
                  )}

                  <div className="flex items-center gap-5">
                    <div
                      className={`w-7 h-7 relative flex items-center justify-center text-[15px] leading-4 font-semibold text-secondary ${i == 0 || i == 1 || i == 2 ? "[text-shadow:0px_1px_2px_rgba(0,0,0,0.25)]" : ""} `}
                    >
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
                  </div>
                </td>
                <td className="py-4 uppercase text-sm xs:text-base font-medium text-secondary-80">
                  <span className="hidden sm:block">
                    {item.walletAddress.slice(0, 5)}...
                    {item.walletAddress.slice(-5)}
                  </span>
                  <span className="block sm:hidden">
                    {item.walletAddress.slice(0, 4)}...
                    {item.walletAddress.slice(-2)}
                  </span>
                </td>
                <td className="pl-1 xs:pl-5 pr-5 md:pr-10 py-4 text-right text-sm xs:text-base font-medium text-secondary-80">
                  <div className="flex items-center justify-end gap-1">
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
  );
};

export default LeaderboardAll;
