import React, { useState } from "react";
import { useAizonData } from "../../utils/AizonContext";
import Data from "../../assets/data/transactions";

import { FaArrowRight } from "react-icons/fa6";
import EthScanImg from "../../assets/images/chains/ethscan.svg?react";

const TransactionsAll = () => {
  const { tokenSymbol } = useAizonData();

  return (
    <div className="rounded-[15px] mb-6.25 pb-3 relative bg-card">
      <div className="px-5 md:px-6.25 2xl:px-10 pt-5 lg:pt-8 pb-4">
        <h2 className="uppercase font-chakrapetch text-xl sm:text-2xl md:text-3xl font-bold text-secondary">
          Live Transactions
        </h2>
      </div>

      {/* transaction table */}
      <div className="w-full overflow-x-auto px-5 md:px-6.25 2xl:px-10 ">
        <table className="w-full">
          <thead>
            <tr className="font-chakrapetch">
              <th className="py-2.5 text-left uppercase font-chakrapetch text-sm font-bold text-secondary-80">
                <div className="flex items-center gap-1">
                  Wallet <span className="hidden md:block">Address</span>
                </div>
              </th>
              <th className="hidden xs:block py-2.5 px-2 lg:px-4 text-left uppercase font-chakrapetch text-sm font-bold text-secondary-80">
                Date
              </th>
              <th className="py-2.5 px-2 lg:px-4 text-left uppercase font-chakrapetch text-sm font-bold text-secondary-80">
                Amount
              </th>
              <th className="py-2.5 text-right uppercase font-chakrapetch text-sm font-bold text-secondary-80">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {Data?.map((item, i) => (
              <tr key={i} className="border-t border-t-secondary-12">
                <td className="py-4 text-sm xs:text-[15px] 2xl:text-base uppercase font-medium text-secondary">
                  <span className="hidden sm:block">
                    {item.walletAddress.slice(0, 5)}...
                    {item.walletAddress.slice(-5)}
                  </span>
                  <span className="block sm:hidden">
                    {item.walletAddress.slice(0, 4)}...
                    {item.walletAddress.slice(-2)}
                  </span>
                </td>

                <td className="hidden xs:block py-4 px-2 lg:px-4 text-sm xs:text-[15px]  2xl:text-base font-medium text-secondary-80">
                  <span className="hidden 2xl:block">
                    {item.date}, {item.time}
                  </span>
                  <span className="block 2xl:hidden">{item.date}</span>
                </td>

                <td className="py-4 px-2 lg:px-4 text-sm xs:text-[15px] 2xl:text-base font-medium text-secondary">
                  <div className="flex items-center gap-3">
                    <span className="hidden md:flex items-center gap-1">
                      {item.payUsdAmount}
                      <span className="text-secondary-80">USDT</span>
                    </span>
                    <span className="hidden md:flex text-primary-50">
                      <FaArrowRight />
                    </span>
                    <span className="flex items-center gap-1">
                      {item.buyAmount}
                      <span className="text-secondary-80">{tokenSymbol}</span>
                    </span>
                  </div>
                </td>

                <td className="py-4 text-sm xs:text-[15px] 2xl:text-base font-medium text-secondary-80">
                  <a
                    target="_blank"
                    href={item.txLink}
                    className="w-5 h-5 rounded-full ml-auto"
                  >
                    <EthScanImg className="w-5 h-5 rounded-full ml-auto" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsAll;
