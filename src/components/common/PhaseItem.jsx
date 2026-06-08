import React, { useEffect, useState } from "react";
import { useAizonData } from "../../utils/AizonContext";
import { formatEther } from "viem";

import ActiveImg from "../../assets/images/icons/active.png";
import { TbClockHour2 } from "react-icons/tb";
import { HiBadgeCheck } from "react-icons/hi";

const PhaseItem = ({ item }) => {
  const { tokenSymbol } = useAizonData();
  const [status, setStatus] = useState("");

  useEffect(() => {
    const checkTimestamp = () => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const startTime = item.start.toString();
      const endTime = item.end.toString();

      if (startTime < currentTimestamp && endTime < currentTimestamp) {
        setStatus("sold");
      }

      if (startTime < currentTimestamp && currentTimestamp < endTime) {
        setStatus("active");
      }

      if (startTime > currentTimestamp) {
        setStatus("upcoming");
      }
    };

    // Initial check
    checkTimestamp();
    // Set up an interval to check every second
    const interval = setInterval(checkTimestamp, 1000);
    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [item]);

  const convertTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  return (
    <div
      className={`group relative rounded-[15px] px-5 md:px-6.25 2xl:px-7 py-5 md:py-7 border-2 font-chakrapetch ${
        status == "sold" ? "sold bg-secondary-10 border-secondary-12" : ""
      } ${status == "active" ? "active bg-secondary-15 border-secondary-12" : ""} ${
        status == "upcoming" ? "upcoming bg-card border-secondary-8" : ""
      }`}
    >
      <div className="absolute top-9 -left-2 w-4 h-2 rounded-sm bg-[#3E5645]"></div>
      <div className="absolute bottom-9 -left-2 w-4 h-2 rounded-sm bg-[#3E5645]"></div>

      {status == "sold" && (
        <div className="mb-5 md:mb-7 w-fit rounded-[15px] px-1.75 py-1 flex items-center gap-2 bg-[#454545]">
          <div className="text-xl text-primary">
            <HiBadgeCheck />
          </div>

          <p className="uppercase text-sm leading-4 font-bold text-primary">
            Sold out
          </p>
        </div>
      )}

      {status == "active" && (
        <div className="mb-5 md:mb-7 w-fit rounded-[15px] px-1.75 py-1 flex items-center gap-2 bg-primary">
          <img className="w-3 h-4" src={ActiveImg} alt="icon" />
          <p className="uppercase text-sm leading-4 font-bold text-title">
            Active Sale
          </p>
        </div>
      )}

      {status == "upcoming" && (
        <div className="mb-5 md:mb-7 w-fit rounded-[15px] px-1.5 py-1 flex items-center gap-2 border-2 border-secondary-15 bg-secondary-5">
          <div className="text-xl text-secondary">
            <TbClockHour2 />
          </div>

          <p className="uppercase text-sm leading-4 font-bold text-secondary">
            Upcoming
          </p>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="flex gap-2 xl:gap-4 2xl:gap-5 justify-between flex-wrap">
          <div className="shrink-0 grow-0 w-27.5">
            <h2 className="uppercase text-lg sm:text-xl md:text-2xl font-bold text-secondary group-[.upcoming]:text-secondary-80">
              Phase {item.id}
            </h2>
          </div>

          <div className="w-38.75">
            <p className="uppercase text-sm font-semibold text-secondary-90 group-[.upcoming]:text-secondary-60">
              Price
            </p>
            <h4 className="uppercase text-sm sm:text-base font-bold text-secondary group-[.upcoming]:text-secondary-80">
              1 {tokenSymbol} = ${formatEther(item.price.toString())}
            </h4>
          </div>
        </div>

        <div className="flex gap-2 2xl:gap-5 justify-between">
          <div className="shrink-0 grow-0 w-27.5">
            <p className="uppercase text-sm font-semibold text-secondary-90 group-[.upcoming]:text-secondary-60">
              Start Date
            </p>
            <h4 className="capitalize text-sm sm:text-base font-bold text-secondary group-[.upcoming]:text-secondary-80">
              {convertTimestamp(item.start.toString())}
            </h4>
          </div>

          <div className="w-38.75">
            <p className="uppercase text-sm font-semibold text-secondary-90 group-[.upcoming]:text-secondary-60">
              End Date
            </p>
            <h4 className="capitalize text-sm sm:text-base font-bold text-secondary group-[.upcoming]:text-secondary-80">
              {convertTimestamp(item.end.toString())}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseItem;
