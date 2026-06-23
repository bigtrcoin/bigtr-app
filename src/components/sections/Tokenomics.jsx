import React from "react";
import Data, { vestingPeriods } from "../../assets/data/tokenomics";
import { useAizonData } from "../../utils/AizonContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const TOTAL_SUPPLY = "2,975,000,000";

const Tokenomics = () => {
  const { themeMode, colors, tokenSymbol } = useAizonData();

  // 7 dilim için renk paleti (tema renklerinden türetilir)
  const palette = [
    colors.primary,
    colors.primary80,
    colors.primary70,
    colors.primary60,
    colors.primary50,
    colors.primary40,
    colors.primary70,
  ];

  // Grafik ve açıklama verisi doğrudan beyaz bülten tablosundan (tokenomics.js) gelir
  const allocationData = Data.map((item, i) => ({
    label: item.category,
    value: parseInt(item.allocation),
    color: palette[i % palette.length],
  }));

  const chartData = {
    labels: allocationData.map((item) => item.label),
    datasets: [
      {
        data: allocationData.map((item) => item.value),
        backgroundColor: allocationData.map((item) => item.color),
        borderWidth: 2,
        borderColor: themeMode == "dark" ? "#181818" : "#ffffff",
        cutout: "50%",
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
    responsive: true,
  };

  const leftItems = allocationData.slice(0, 4);
  const rightItems = allocationData.slice(4);

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
          <ul className="flex flex-col gap-4 md:gap-5">
            {leftItems.map((item, i) => (
              <li
                key={i}
                className="rounded-[15px] p-3.5 xs:p-5 md:p-5.5 bg-linear-to-r from-secondary-8 to-transparent flex items-center gap-2.5 justify-between capitalize font-chakrapetch font-bold text-secondary"
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
          <ul className="flex flex-col gap-4 md:gap-5">
            {rightItems.map((item, i) => (
              <li
                key={i}
                className="rounded-[15px] p-3.5 xs:p-5 md:p-5.5 bg-linear-to-l from-secondary-8 to-transparent flex flex-row sm:flex-row-reverse items-center gap-2.5 justify-between capitalize font-chakrapetch font-bold text-secondary"
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
            <span className="text-primary">{TOTAL_SUPPLY}</span> {tokenSymbol}
          </span>
        </h2>
      </div>

      {/* tokenomics table */}
      <div className="w-full px-5 md:px-6.25 2xl:px-10 overflow-x-auto">
        <table className="w-full text-nowrap">
          <thead>
            <tr className="uppercase text-xs sm:text-sm font-chakrapetch font-bold text-secondary-80">
              <th className="py-2.5 text-left">Category</th>
              <th className="py-2.5 px-3 text-left">Allocation</th>
              <th className="py-2.5 px-3 text-left">Token Amount</th>
              {vestingPeriods.map((p, i) => (
                <th key={i} className="py-2.5 px-3 text-center">{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Data?.map((item, i) => (
              <tr
                key={i}
                className="border-t border-t-secondary-12 font-onest font-medium text-secondary"
              >
                <td className="py-4 text-sm xs:text-base">{item.category}</td>
                <td className="py-4 px-3 uppercase text-sm xs:text-base">
                  {item.allocation}
                </td>
                <td className="py-4 px-3 uppercase text-sm xs:text-base">
                  {Number(item.tokenAmount).toLocaleString()}
                </td>
                {item.schedule.map((val, j) => (
                  <td
                    key={j}
                    className={`py-4 px-3 text-center text-sm xs:text-base ${
                      val ? "text-secondary" : "text-secondary-50"
                    }`}
                  >
                    {val || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-5 md:px-6.25 2xl:px-10 pt-3 font-onest text-xs text-secondary-50">
        Unlock schedule shows the portion of each allocation released at each period after listing.
      </p>
    </div>
  );
};

export default Tokenomics;
