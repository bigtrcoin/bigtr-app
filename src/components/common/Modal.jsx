import React, { useState } from "react";
import { useAizonModal } from "../../utils/ModalContext";
import Data from "../../assets/data/stakingInfo";

import { CgClose } from "react-icons/cg";
import { FaChevronDown } from "react-icons/fa";
import { useAizonData } from "../../utils/AizonContext";

const Modal = ({ variant }) => {
  const { themeMode } = useAizonData();
  const { modalHandle } = useAizonModal();

  const [selectedPackage, setSelectedPackage] = useState("");
  const [stakedAmount, setStakedAmount] = useState(0);

  return (
    <div className="fixed z-9999999 top-0 left-0 w-full h-full bg-black-50 backdrop-blur-[10px]">
      <div className="min-h-full flex items-center justify-center">
        <div
          className={`w-112.5 max-w-full border-0 rounded-[15px] animate-modalcontent ${themeMode == "dark" ? "bg-[#1d1d1d]" : "bg-card"}`}
        >
          <div className="px-10 py-6 font-chakrapetch flex items-center justify-between flex-wrap gap-5">
            {variant === "unstake" && (
              <h2 className="uppercase text-3xl font-bold text-secondary">
                Unstake
              </h2>
            )}
            {variant === "restake" && (
              <h2 className="uppercase text-3xl font-bold text-secondary">
                Restake
              </h2>
            )}
            {variant === "withdraw" && (
              <h2 className="uppercase text-3xl font-bold text-secondary">
                Withdraw
              </h2>
            )}

            <button className="text-xl text-secondary" onClick={modalHandle}>
              <CgClose />
            </button>
          </div>

          <div className="font-chakrapetch">
            <div className="rounded-[15px] p-10 bg-linear-to-b from-secondary-10 to-[#ffffff00] flex flex-col gap-10">
              <div className="">
                <label className="block mb-2 uppercase text-base font-bold text-secondary">
                  Select Package
                </label>

                <div className="w-full relative">
                  <select
                    className="w-full appearance-none rounded-[15px] border-2 border-secondary-10 px-5 py-3 bg-secondary-5 font-onest font-medium text-base text-secondary"
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                  >
                    <option value="-1" className={`${themeMode=='dark'?'border-0 bg-black-80':'bg-white-80'}`}>
                      Select Package
                    </option>
                    {Data?.map((item, i) => (
                      <option
                        value={item.stakeLevelId}
                        key={i}
                        className={`${themeMode=='dark'?'border-0 bg-black-80':'bg-white-80'}`}
                      >
                        {item.stakeInfo.lockDuration / 86400} Days
                      </option>
                    ))}
                  </select>

                  <div className="absolute top-1/2 right-4 -translate-y-1/2 text-base text-secondary">
                    <FaChevronDown />
                  </div>
                </div>
              </div>

              <div className="">
                {/* unstake token */}
                {variant === "unstake" && (
                  <>
                    <label className="block mb-2 uppercase text-base font-bold text-secondary">
                      Amount to unstake ({stakedAmount})
                    </label>

                    <div className="relative">
                      <input
                        className="w-full rounded-[15px] border-2 border-secondary-10 px-5 py-3 bg-secondary-5 text-base text-secondary"
                        type="number"
                        placeholder="0"
                      />

                      <div className="overlay">
                        <button className="absolute top-1/2 right-2 -translate-y-1/2 px-2.5 py-0.75 rounded-[10px] bg-[rgba(255,255,255,0.12)] font-chakrapetch uppercase text-lg font-bold text-secondary-50">
                          Max
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* restake token */}
                {variant === "restake" && (
                  <>
                    <label className="block mb-2 uppercase text-base font-bold text-secondary">
                      Amount to restake
                    </label>
                    <input
                      className="w-full rounded-[15px] border-2 border-secondary-10 px-5 py-3 bg-secondary-5 text-base text-secondary"
                      type="number"
                      placeholder="0"
                      disabled
                    />
                  </>
                )}

                {/* withdraw token */}
                {variant === "withdraw" && (
                  <>
                    <label className="block mb-2 uppercase text-base font-bold text-secondary">
                      Amount to Withdraw
                    </label>
                    <input
                      className="w-full rounded-[15px] border-2 border-secondary-10 px-5 py-3 bg-secondary-5 text-base text-secondary"
                      type="number"
                      placeholder="0"
                      disabled
                    />
                  </>
                )}
              </div>
            </div>

            <div className="rounded-[15px] p-10 bg-linear-to-b from-secondary-8 to-[#ffffff00] ">
              {variant === "unstake" && (
                <button className="aizon-btn w-full rounded-[15px] p-4 bg-primary uppercase text-base font-bold text-btn-text">
                  <span className="btn-inner">
                    <span className="btn-normal-text">Unstake</span>
                    <span className="btn-hover-text">Unstake</span>
                  </span>
                </button>
              )}

              {variant === "restake" && (
                <button className="aizon-btn w-full rounded-[15px] p-4 bg-primary uppercase text-base font-bold text-btn-text">
                  <span className="btn-inner">
                    <span className="btn-normal-text">Restake</span>
                    <span className="btn-hover-text">Restake</span>
                  </span>
                </button>
              )}

              {variant === "withdraw" && (
                <button className="aizon-btn w-full rounded-[15px] p-4 bg-primary uppercase text-base font-bold text-btn-text">
                  <span className="btn-inner">
                    <span className="btn-normal-text">Withdraw</span>
                    <span className="btn-hover-text">Withdraw</span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
