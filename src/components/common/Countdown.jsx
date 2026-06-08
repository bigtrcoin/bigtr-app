import React, { useEffect, useState } from "react";

const Countdown = ({ endDate }) => {
  const [remainingTime, setRemainingTime] = useState({
    seconds: "00",
    minutes: "00",
    hours: "00",
    days: "00",
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = endDate * 1000 - now;
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(
            2,
            "0",
          ),
          hours: String(
            Math.floor((difference / (1000 * 60 * 60)) % 24),
          ).padStart(2, "0"),
          minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(
            2,
            "0",
          ),
          seconds: String(Math.floor((difference / 1000) % 60)).padStart(
            2,
            "0",
          ),
        };
      } else {
        timeLeft = { days: "00", hours: "00", minutes: "00", seconds: "00" };
      }

      return timeLeft;
    };

    setRemainingTime(calculateTimeLeft());

    const timer = setInterval(() => {
      setRemainingTime(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center gap-1 xs:gap-1.5 2xl:gap-3 uppercase font-chakrapetch font-bold text-secondary text-[14px] sm:text-[20px] 2xl:text-2xl">
      <h4>{remainingTime.days}D</h4>
      <h4>:</h4>
      <h4>{remainingTime.hours}H</h4>
      <h4>:</h4>
      <h4>{remainingTime.minutes}M</h4>
      <h4>:</h4>
      <h4>{remainingTime.seconds}S</h4>
    </div>
  );
};

export default Countdown;
