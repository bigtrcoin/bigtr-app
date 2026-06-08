import React from "react";
import { useAizonData } from "../../utils/AizonContext";

const StatusCardItem = ({ item }) => {
  const { themeMode } = useAizonData();

  return (
    <div
      className={`relative h-full py-5 2xl:py-9.75 px-5 md:px-6.25 2xl:px-10 rounded-[15px] flex items-center lg:items-start xl:items-center justify-between gap-3 flex-row lg:flex-col xl:flex-row ${themeMode == "dark" ? "bg-secondary-10" : "bg-card"}`}
    >
      <div className="">
        <h4 className="mb-1 sm:mb-2 2xl:mb-3 uppercase font-chakrapetch text-[15px] 2xl:text-base font-semibold text-secondary-90">
          {item.title}
        </h4>
        <h2 className="uppercase font-chakrapetch text-[22px] md:text-[26px] 2xl:text-3xl font-semibold text-secondary">
          {item.value.toLocaleString()}
        </h2>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 2xl:right-8">
        <item.icon className="w-9 2xl:w-12.5 h-9 2xl:h-12.5" />
      </div>
    </div>
  );
};

export default StatusCardItem;
