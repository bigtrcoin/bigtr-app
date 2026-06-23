import React from "react";
import { NavLink } from "react-router-dom";
import { useAizonData } from "../../utils/AizonContext";
import Data from "../../assets/data/transactions";

import { FaArrowRight } from "react-icons/fa6";
import EthScanImg from "../../assets/images/chains/ethscan.svg?react";

const TransactionsLatest = () => {
  const { tokenSymbol } = useAizonData();

  return (
    <div className="h-full rounded-[15px] px-5 md:px-6.25 2xl:px-10 relative overflow-hidden bg-card">
      <div className="pt-5 2xl:pt-7 pb-5 2xl:pb-5 flex items-center gap-3 flex-wrap justify-between">
        <h2 className="aizon-title uppercase font-chakrapetch font-bold text-secondary flex items-center gap-2.5">
          <span className="hidden sm:block">Last</span> Transactions
        </h2>

        <NavLink
          to="/transactions"
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
              <th className="pb-2.5 text-left uppercase font-chakrapetch text-sm font-bold text-secondary-80">
                Amount
              </th>
              <th className="pb-2.5 px-2 2xl:px-4 text-left uppercase font-chakrapetch text-sm font-bold text-secondary-80">
                Date
              </th>
              <th className="pb-2.5 text-right uppercase font-chakrapetch text-sm font-bold text-secondary-80">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {Data.length === 0 && (
              <tr><td colSpan={3} className="py-6 text-center text-secondary-80 font-chakrapetch uppercase">No transactions yet</td></tr>
            )}
            {Data?.slice(0, 6).map((item, i) => (
              <tr key={i} className="border-t border-t-secondary-12">
                <td className="py-4 text-sm xs:text-[15px] 2xl:text-base font-medium text-secondary">
                  <div className="flex items-center gap-2 2xl:gap-3">
                    <span className="hidden xs:flex items-center gap-1">
                      {item.payUsdAmount}
                      <span className="text-secondary-80">USDT</span>
                    </span>
                    <span className="hidden xs:flex text-primary-50">
                      <FaArrowRight />
                    </span>
                    <span className="flex items-center gap-1">
                      {item.buyAmount}
                      <span className="text-secondary-80">{tokenSymbol}</span>
                    </span>
                  </div>
                </td>

                <td className="py-4 px-2 2xl:px-4 text-sm xs:text-[15px]  2xl:text-base font-medium text-secondary-80">
                  <span className="hidden 2xl:block">
                    {item.date}, {item.time}
                  </span>
                  <span className="block 2xl:hidden">{item.date}</span>
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

export default TransactionsLatest;
