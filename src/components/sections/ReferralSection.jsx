import React, { useEffect, useState } from "react";
import { useAizonData } from "../../utils/AizonContext";
import referralInfo from "../../assets/data/referralInfo";
import MyRewards from "../common/MyRewards";

import { FaCheck } from "react-icons/fa6";
import { TbCopy } from "react-icons/tb";

const ReferralSection = () => {
  const { addressData, tokenSymbol, referralBonus, referralBonusPay } =
    useAizonData();

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
      let _refLink = domainLink + "/#/ref/" + walletAddress;
      setReferralLink(_refLink);
    }
  }, [walletAddress]);

  return (
    <section className="pb-6.25">
      {/* referral section */}
      <div className="rounded-[15px] p-5 md:p-6.25 2xl:p-10 bg-card">
        <div className="mb-10 w-full flex items-start justify-between gap-5 flex-wrap">
          <div className="w-full xl:w-fit">
            <div className="mb-6">
              <h3 className="w-full max-w-108 font-chakrapetch uppercase text-2xl md:text-3xl leading-11.25! font-bold text-secondary">
                Earn{" "}
                <span className="text-primary">
                  Up to {Number(referralBonus) + Number(referralBonusPay)}%
                </span>{" "}
                Commission on every referral!
              </h3>
            </div>

            <h4 className="mb-2 uppercase font-chakrapetch text-base font-bold text-secondary">
              Your Referral Link
            </h4>

            <div className="w-full xl:w-122.5 2xl:w-147.5 pl-3 xs:pl-5 pt-0 pr-0 rounded-[18px] border-2 border-secondary-8 bg-secondary-3 flex items-center justify-between gap-2">
              <h6 className="max-w-full md:max-w-[320px] truncate font-chakrapetch text-base xs:text-lg font-semibold text-secondary">
                {referralLink}
              </h6>

              <button
                className="rounded-[18px] p-3 xs:p-4 bg-linear-to-r from-[#6c20e600] to-primary flex items-center gap-2.5 font-chakrapetch uppercase text-base xs:text-lg font-bold text-secondary"
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

          <div className="w-full xl:w-fit rounded-[15px] border border-secondary-8 bg-card grid grid-cols-1 sm:grid-cols-2">
            <div className="px-5 py-3">
              <h4 className="mb-1 font-chakrapetch text-2xl md:text-3xl font-bold text-primary">
                {referralBonusPay}%
              </h4>
              <p className="text-base font-medium text-secondary-90">
                In the Purchase Token
              </p>
            </div>

            <div className="px-5 py-3 border-0 border-t sm:border-t-0 border-l-0 sm:border-l border-t-secondary-8 sm:border-l-secondary-8">
              <h4 className="mb-1 font-chakrapetch text-2xl md:text-3xl font-bold text-primary">
                {referralBonus}%
              </h4>
              <p className="text-base font-medium text-secondary-90">
                In the {tokenSymbol} Token
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-7.5">
          {referralInfo.refInfo?.map((item, i) => (
            <div
              key={i}
              className="rounded-[15px] px-5 lg:px-7.5 2xl:px-10 py-5 lg:py-7 2xl:py-8 bg-secondary-6 flex flex-col justify-between"
            >
              <h4 className="mb-7 max-w-full 2xl:max-w-[85%] font-chakrapetch uppercase text-base 2xl:text-[18px] font-bold text-secondary">
                {item.title}
              </h4>

              <h2 className="font-chakrapetch uppercase text-4xl md:text-[50px] leading-9 font-bold text-transparent bg-linear-to-b from-secondary to-transparent to-90% bg-clip-text">
                {item.number}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* my rewards */}
      <MyRewards />
    </section>
  );
};

export default ReferralSection;
