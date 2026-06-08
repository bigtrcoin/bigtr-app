import React, { useEffect, useState } from "react";
import Data from "../../assets/data/tokenomics";
import { useAizonData } from "../../utils/AizonContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const Tokenomics = () => {
  const { themeMode, colors, tokenSymbol } = useAizonData();

  const presalePercent = 45;
  const stakingPercent = 20;
  const communityPercent = 10;
  const liquidityPercent = 10;
  const ecosystemPercent = 10;
  const teamPercent = 5;

  // chart
  const allocationData = [
    {
      label: "Persale",
      value: presalePercent,
      color: colors.primary,
    },
    { label: "Staking", value: stakingPercent, color: colors.primary80 },
    {
      label: "Community & Marketing",
      value: communityPercent,
      color: colors.primary70,
    },
    {
      label: "Liquidity and Listing",
      value: liquidityPercent,
      color: colors.primary60,
    },
    {
      label: "Ecosystem and Development",
      value: ecosystemPercent,
      color: colors.primary50,
    },
    { label: "Team and Advisors", value: teamPercent, color: colors.primary40 },
  ];

  const chartData = {
    labels: allocationData.map((item) => item.label),
    datasets: [
      {
        data: allocationData.map((item) => item.value),
        backgroundColor: allocationData.map((item) => item.color),
        borderWidth: 2,
        borderColor: themeMode == "dark" ? "#181818" : "#ffffff",
        cutout: "50%", // Smaller inner circle for thicker ring
      },
    ],
  };

  // chart options
  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="rounded-[15px] mb-6.25 pb-3 relative bg-card">
      {/* title */}
      <div className="px-5 md:px-6.25 2xl:px-10 pt-5 md:pt-6.75">
        <h2 className="aizon-title uppercase font-chakrapetch font-bold text-secondary">
          Tokenomics
        </h2>
      </div>

      {/* tokenomics chart */}
      <div className="px-5 md:px-6.25 2xl:px-10 pt-4 md:pt-5.25 pb-5 md:pb-9 grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-10 2xl:gap-12.5">
        <div className="col-span-1 lg:col-span-4">
          <ul className="flex flex-col gap-5 md:gap-7.5">
            {allocationData?.slice(0, 3).map((item, i) => (
              <li
                key={i}
                className="rounded-[15px] p-3.5 xs:p-5 md:p-6.25 bg-linear-to-r from-secondary-8 to-transparent flex items-center gap-2.5 justify-between capitalize font-chakrapetch font-bold text-secondary"
              >
                <h4 className="text-base truncate">{item.label}</h4>
                <h2 className="text-[20px]">{item.value}%</h2>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-1 lg:col-span-4 flex items-center justify-center">
          <div className="w-77.5 max-w-full h-77.5 max-h-full">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="col-span-1 lg:col-span-4">
          <ul className="flex flex-col gap-5 md:gap-7.5">
            {allocationData?.slice(-3).map((item, i) => (
              <li
                key={i}
                className="rounded-[15px] p-3.5 xs:p-5 md:p-6.25 bg-linear-to-l from-secondary-8 to-transparent flex flex-row sm:flex-row-reverse items-center gap-2.5 justify-between capitalize font-chakrapetch font-bold text-secondary"
              >
                <h4 className="text-base truncate">{item.label}</h4>
                <h2 className="text-[20px]">{item.value}%</h2>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* title info */}
      <div className="mb-10 p-3.25 text-center bg-[linear-gradient(90deg,#ffffff00_0%,var(--color-secondary-6)_50%,#ffffff00_100%)]">
        <h2 className="uppercase font-chakrapetch font-bold text-[15px] md:text-base text-secondary flex items-center justify-center gap-1.5 flex-wrap">
          <span>Total token supply:</span>
          <span>
            <span className="text-primary">1,000,000,000</span> {tokenSymbol}
          </span>
        </h2>
      </div>

      {/* tokenomics table */}
      <div className="w-full px-5 md:px-6.25 2xl:px-10 overflow-x-auto">
        <table className="w-full text-nowrap">
          <thead>
            <tr className="uppercase text-sm font-chakrapetch font-bold text-secondary-80">
              <th className="py-2.5 text-left w-75">Category</th>
              <th className="py-2.5 px-4 text-center xs:text-left">
                Allocation
              </th>
              <th className="py-2.5 px-4 text-left">Token AMount</th>
              <th className="py-2.5 px-4 text-left">Unlock At TGE</th>
              <th className="py-2.5 px-4 text-left">Cliff</th>
              <th className="py-2.5 text-right">Vesting</th>
            </tr>
          </thead>
          <tbody>
            {Data?.map((item, i) => (
              <tr
                key={i}
                className="border-t border-t-secondary-12 font-onest font-medium text-secondary"
              >
                <td className="block relative py-4 text-sm xs:text-base">
                  {item.category}
                </td>
                <td className="py-4 px-4 uppercase text-center xs:text-left text-sm xs:text-base">
                  {item.allocation}
                </td>
                <td className="py-4 px-4 uppercase text-sm xs:text-base">
                  {Number(item.tokenAmount).toLocaleString()}
                </td>
                <td className="py-4 px-4 uppercase text-sm xs:text-base">
                  {item.unlockAtTge}
                </td>
                <td className="py-4 px-4 text-sm xs:text-base">{item.cliff}</td>
                <td className="py-4 text-right text-sm xs:text-base">
                  {item.vesting}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tokenomics;
