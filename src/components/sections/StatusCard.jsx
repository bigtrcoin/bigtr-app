import React from "react";
import StatusCardItem from "../common/StatusCardItem";
import { useAizonData } from "../../utils/AizonContext";

import StatusImg1 from "../../assets/images/status/wallet.svg?react";
import StatusImg2 from "../../assets/images/status/invested.svg?react";
import StatusImg3 from "../../assets/images/status/launch.svg?react";
import StatusImg4 from "../../assets/images/status/staked.svg?react";

const StatusCard = () => {
  const {
    formatNumber,
    userTokenBalance,
    currentPrice,
    listingPrice,
    userStakeAmount,
  } = useAizonData();

  const StatusData = [
    {
      title: "Total Balance",
      value: "$" + userTokenBalance,
      icon: StatusImg1,
    },
    {
      title: "Total Invested",
      value: "$" + formatNumber(userTokenBalance * currentPrice),
      icon: StatusImg2,
    },
    {
      title: "Listing Price",
      value: "$" + formatNumber(userTokenBalance * listingPrice),
      icon: StatusImg3,
    },
    {
      title: "Your Staked",
      value: "$" + formatNumber(Number(userStakeAmount)),
      icon: StatusImg4,
    },
  ];

  return (
    <section className="pb-7.5">
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-7.5">
        {StatusData?.map((item, i) => (
          <StatusCardItem key={i} item={item} />
        ))}
      </div>
    </section>
  );
};

export default StatusCard;
