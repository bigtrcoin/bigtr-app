import React, { useState } from "react";
import { useAizonData } from "../../utils/AizonContext";
import Data from "../../assets/data/myTransactions";

import EthScanImg from "../../assets/images/chains/ethscan.svg?react";
import { FaArrowRight } from "react-icons/fa6";

const MyTransactions = () => {
  const { tokenSymbol } = useAizonData();

  return (
    <div className="rounded-[15px] overflow-hidden mb-6.25 relative bg-card">
      <div className="p-5 pb-4 px-5 md:px-6.25 2xl:px-10 2xl:pt-6.5 2xl:pb-4">
        <h2 className="aizon-title uppercase font-chakrapetch font-bold text-secondary">
          Your Transactions
        </h2>
      </div>

      {/* transaction table */}
      <div className="py-2 px-5 md:px-6.25 2xl:px-10 w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="pb-2.5 text-left uppercase font-chakrapetch text-sm font-bold text-secondary-80 text-nowrap">
                Type
              </th>
              <th className="pb-2.5 px-4 text-left uppercase font-chakrapetch text-sm font-bold text-secondary-80 text-nowrap">
                Date
              </th>
              <th className="pb-2.5 px-4 text-left uppercase font-chakrapetch text-sm font-bold text-secondary-80 text-nowrap">
                Amount
              </th>
              <th className="pb-2.5 px-4 text-left uppercase font-chakrapetch text-sm font-bold text-secondary-80 text-nowrap">
                Status
              </th>
              <th className="pb-2.5 text-right uppercase font-chakrapetch text-sm font-bold text-secondary-80 text-nowrap">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {Data?.map((item, i) => (
              <tr key={i} className="border-t border-t-secondary-12">
                <td className="py-4 text-base font-medium text-secondary-80 text-nowrap">
                  Purchase
                </td>

                <td className="py-4 px-4 text-base font-medium text-secondary-80 text-nowrap">
                  {item.date}, {item.time}
                </td>

                <td className="py-4 px-4 flex items-center gap-2 text-base font-medium text-secondary text-nowrap">
                  <span>
                    {item.payUsdAmount}{" "}
                    <span className="text-secondary-80">USDT</span>
                  </span>
                  <span className=" text-primary-50">
                    <FaArrowRight />
                  </span>
                  <span>
                    {item.buyAmount}{" "}
                    <span className="text-secondary-80">{tokenSymbol}</span>
                  </span>
                </td>

                <td className="py-4 px-4 text-base font-medium text-[#30EF70] text-nowrap">
                  {item.status == "completed" && (
                    <span className="capitalize">Completed</span>
                  )}
                  {item.status == "failed" && (
                    <span className="capitalize text-danger">Failed</span>
                  )}
                </td>

                <td className="py-4 text-base font-medium text-secondary-80 text-nowrap">
                  <a
                    target="_blank"
                    href={item.txLink}
                    className="w-6 h-6 rounded-full ml-auto"
                  >
                    <EthScanImg className="w-6 h-6 rounded-full ml-auto" />
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

export default MyTransactions;
