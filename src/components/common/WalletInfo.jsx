import React, { useState } from "react";
import { useAizonData } from "../../utils/AizonContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

import { FaCheck } from "react-icons/fa6";
import { TbCopy } from "react-icons/tb";

const WalletInfo = () => {
  const { themeMode, colors, addressData } = useAizonData();

  const walletAddress = addressData || "0xA1B2C3D4E5FGHIJKLMNOPQRSTUVWX6Y8Z9";
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 4000);
  };

  const [purchasePercent, setPurchasePercent] = useState(76);
  const [bonusPercent, setBonusPercent] = useState(16);
  const [referralPercent, setReferralPercent] = useState(8);

  // chart
  const allocationData = [
    { label: "Purchase", value: purchasePercent, color: colors.primary },
    { label: "Bonus", value: bonusPercent, color: colors.primary70 },
    { label: "Referrals", value: referralPercent, color: colors.primary50 },
  ];

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

  // demo chart
  const allocationDataDemo = [
    { label: "placeholder", value: 100, color: "#ffffff1f" },
  ];

  const chartDataDemo = {
    labels: allocationDataDemo.map((item) => item.label),
    datasets: [
      {
        data: allocationDataDemo.map((item) => item.value),
        backgroundColor: allocationDataDemo.map((item) => item.color),
        borderWidth: 0,
        cutout: "50%", // Smaller inner circle for thicker ring
      },
    ],
  };

  // chart options
  const chartOptionsDemo = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="h-full p-5 md:p-6.25 2xl:px-10 2xl:pt-6.5 2xl:pb-10 rounded-[15px] bg-card">
      <h2 className="aizon-title mb-5 uppercase font-chakrapetch font-bold text-secondary">
        Wallet
      </h2>

      <h5 className="mb-2 uppercase text-[15px] md:text-base font-semibold text-secondary-90">
        Wallet Address
      </h5>

      <div className="flex items-center gap-2">
        <h4 className="uppercase text-[18px] md:text-xl font-semibold text-secondary">
          <span className="hidden sm:block">
            {walletAddress?.slice(0, 10) + "..." + walletAddress?.slice(-9)}
          </span>
          <span className="block sm:hidden">
            {walletAddress?.slice(0, 4) + "..." + walletAddress?.slice(-4)}
          </span>
        </h4>

        <button
          className="text-xl font-bold text-primary"
          onClick={copyToClipboard}
        >
          {copied ? <FaCheck /> : <TbCopy />}
        </button>
      </div>

      <div className="mt-5 lg:mt-10 flex items-center gap-5 justify-between flex-wrap 2xl:flex-nowrap">
        <ul className="flex flex-col gap-5 md:gap-7.5">
          {allocationData?.map((item, i) => (
            <li key={i} className="flex items-center gap-2.5">
              {item.label == "Purchase" && (
                <div className={`w-4 h-4 rounded-full bg-primary`}></div>
              )}
              {item.label == "Bonus" && (
                <div className={`w-4 h-4 rounded-full bg-primary-70`}></div>
              )}
              {item.label == "Referrals" && (
                <div className={`w-4 h-4 rounded-full bg-primary-50`}></div>
              )}

              <h4 className="uppercase font-chakrapetch text-[15px] md:text-base font-semibold text-secondary">
                {item.label} ({item.value}%)
              </h4>
            </li>
          ))}
        </ul>

        <div className="w-full sm:w-40 xl:w-47 2xl:w-60 h-full sm:h-40 xl:h-47 2xl:h-60">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;
