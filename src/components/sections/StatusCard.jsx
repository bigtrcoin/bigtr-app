import React from "react";
import StatusCardItem from "../common/StatusCardItem";
import { useAizonData } from "../../utils/AizonContext";
import usePurchases from "../../hooks/usePurchases";
import useMyAddresses from "../../hooks/useMyAddresses";

import StatusImg1 from "../../assets/images/status/wallet.svg?react";
import StatusImg2 from "../../assets/images/status/invested.svg?react";
import StatusImg3 from "../../assets/images/status/launch.svg?react";

const StatusCard = () => {
  const { formatNumber, userTokenBalance, listingPrice } = useAizonData();
  const { addresses } = useMyAddresses();
  const { myTotals } = usePurchases();

  // "Total Invested" = USDT the wallet actually paid (sum of its Purchased
  // events), NOT tokens x current stage price — that figure grows with every
  // stage and would overstate early buyers' investment.
  const { paid } = myTotals(addresses);

  const StatusData = [
    {
      title: "Your BIGTR",
      value: formatNumber(userTokenBalance),
      icon: StatusImg1,
    },
    {
      title: "Total Invested",
      value: "$" + formatNumber(paid),
      icon: StatusImg2,
    },
    {
      // Estimate only: projected listing price from context (0.096 USDT).
      title: "Est. Value at Listing*",
      value: "$" + formatNumber(userTokenBalance * Number(listingPrice)),
      icon: StatusImg3,
    },
  ];

  return (
    <section className="pb-7.5">
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-7.5">
        {StatusData?.map((item, i) => (
          <StatusCardItem key={i} item={item} />
        ))}
      </div>
      <p className="mt-3 font-chakrapetch text-xs text-secondary-70">
        *Estimated at a projected listing price of {listingPrice} USDT per BIGTR.
        This is a projection, not a promise or guarantee of any future price.
      </p>
    </section>
  );
};

export default StatusCard;
