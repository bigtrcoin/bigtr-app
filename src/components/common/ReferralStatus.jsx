import React, { useEffect, useState } from "react";
import { useAizonData } from "../../utils/AizonContext";
import referralInfo from "../../assets/data/referralInfo";

import { FaCheck } from "react-icons/fa6";
import { TbCopy } from "react-icons/tb";

const ReferralStatus = () => {
  const { addressData, tokenSymbol } = useAizonData();

  const walletAddress = addressData || "0xA1B2C3D4E5FGHIJKLMNOPQRSTUVWX6Y8Z9";
  const [domainLink, setDomainLink] = useState(referralInfo?.domainLink);
  const [referralLink, setReferralLink] = useState(domainLink);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 4000);
  };

  useEffect(() => {
    if (walletAddress) {
      let _refLink = domainLink + "?ref=" + walletAddress;
      setReferralLink(_refLink);
    }
  }, [walletAddress]);

  return (
    <div className="h-full rounded-[15px] bg-card flex flex-col justify-between">
      <div className="">
        <div className="p-5 md:p-6.25 2xl:px-10 2xl:pt-6.5 2xl:pb-7">
          <h2 className="aizon-title uppercase font-chakrapetch font-bold text-secondary">
            Your Referral Stats
          </h2>
        </div>

        <div className="grid grid-cols-2">
          <div className="py-3 sm:py-6 pl-6.25 2xl:pl-10 pr-5 2xl:pr-0 border border-l-0 border-secondary-10 flex flex-col justify-between gap-1">
            <h4 className="uppercase font-chakrapetch text-sm sm:text-base font-semibold text-secondary-90">
              Your Referrals
            </h4>
            <h2 className="uppercase font-chakrapetch text-[18px] xs:text-xl sm:text-2xl 2xl:text-3xl font-bold text-secondary">
              56
            </h2>
          </div>

          <div className="py-3 sm:py-6 px-3.75 2xl:px-7.5 border border-l-0 border-r-0 border-secondary-10 flex flex-col justify-between gap-1">
            <h4 className="uppercase font-chakrapetch text-sm sm:text-base font-semibold text-secondary-90">
              Referral earning
            </h4>
            <h2 className="uppercase font-chakrapetch text-[18px] xs:text-xl sm:text-2xl 2xl:text-3xl font-bold text-secondary">
              $580.20
            </h2>
          </div>

          <div className="py-3 sm:py-6 pl-5 2xl:pl-10 pr-0 2xl:pr-0 border border-t-0 border-l-0 border-secondary-10 flex flex-col justify-between gap-1">
            <h4 className="uppercase font-chakrapetch text-sm sm:text-base font-semibold text-secondary-90">
              Pay token earning <span className="text-primary">(5%)</span>
            </h4>
            <h2 className="uppercase font-chakrapetch text-[18px] xs:text-xl sm:text-2xl 2xl:text-3xl font-bold text-secondary">
              $85.23
            </h2>
          </div>

          <div className="py-3 sm:py-6 px-3.75 2xl:px-7.5 border border-t-0 border-l-0 border-r-0 border-secondary-10 flex flex-col justify-between gap-1">
            <h4 className="uppercase font-chakrapetch text-sm sm:text-base font-semibold text-secondary-90">
              {tokenSymbol} earning <span className="text-primary">(10%)</span>
            </h4>
            <h2 className="uppercase font-chakrapetch text-[18px] xs:text-xl sm:text-2xl 2xl:text-3xl font-bold text-secondary">
              2830 <span className="text-base sm:text-xl">{tokenSymbol}</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="py-5 2xl:py-7.5 px-5 md:px-6.25 2xl:px-10">
        <h4 className="mb-2 uppercase font-chakrapetch text-base font-bold text-secondary">
          Your Referral Link
        </h4>

        <div className="w-full pl-3 xs:pl-5 pt-0 pr-0 rounded-[18px] border-2 border-secondary-8 bg-secondary-3 flex items-center justify-between gap-2">
          <h6 className="max-w-full md:max-w-[320px] truncate font-chakrapetch text-base xs:text-lg font-semibold text-secondary">
            {referralLink}
          </h6>

          <button
            className="rounded-[18px] p-3 xs:p-4 bg-linear-to-r from-transparent to-primary flex items-center gap-2.5 font-chakrapetch font-bold uppercase text-base xs:text-lg text-secondary"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <FaCheck /> Copied
              </>
            ) : (
              <>
                <TbCopy /> Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralStatus;
