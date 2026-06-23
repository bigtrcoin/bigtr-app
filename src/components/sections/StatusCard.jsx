import React from "react";
import StatusCardItem from "../common/StatusCardItem";
import { useAizonData } from "../../utils/AizonContext";

import StatusImg1 from "../../assets/images/status/wallet.svg?react";
import StatusImg2 from "../../assets/images/status/invested.svg?react";
import StatusImg3 from "../../assets/images/status/launch.svg?react";

const StatusCard = () => {
  const {
    formatNumber,
    userTokenBalance,
    currentPrice,
    listingPrice,
  } = useAizonData();

  const StatusData = [
    {
      title: "Your BIGTR",
      value: formatNumber(userTokenBalance),
      icon: StatusImg1,
    },
    {
      title: "Total Invested",
      value: "$" + formatNumber(userTokenBalance * currentPrice),
      icon: StatusImg2,
    },
    {
      title: "Value at Listing",
      value: "$" + formatNumber(userTokenBalance * listingPrice),
      icon: StatusImg3,
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
