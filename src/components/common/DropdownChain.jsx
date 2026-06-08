import React, { useState } from "react";
import { chainInfo } from "../../contracts/chainConfig";

import { FaChevronDown } from "react-icons/fa6";

const DropdownChain = ({
  selectedImg,
  titleText,
  switchChain,
  makeEmptyInputs,
}) => {
  const chainList = chainInfo;

  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const dropdownHandle = () => {
    setIsDropdownActive(!isDropdownActive);
  };

  const handleDropdownData = (item) => {
    event.preventDefault();
    switchChain({ chainId: item.chainId });
    makeEmptyInputs();
    setIsDropdownActive(false);
  };

  return (
    <div className="relative">
      {/* button */}
      <button
        className="relative rounded-[18px] min-w-46.5 2xl:min-w-48.5 w-full px-2.5 2xl:px-3.75 pr-12.5 py-3.25 border-2 border-secondary-8 bg-secondary-3 flex items-center gap-2 2xl:gap-3 font-chakrapetch capitalize text-lg font-bold text-secondary"
        onClick={dropdownHandle}
      >
        <div
          className={`absolute top-5 right-4 transition duration-300 ${
            isDropdownActive ? " rotate-180" : ""
          }`}
        >
          <FaChevronDown />
        </div>
        <img
          src={selectedImg}
          alt="icon"
          className="w-7.5 h-7.5 rounded-full"
        />
        <span>{titleText}</span>
      </button>

      {/* bg-[#262627] */}
      {/* chain list */}
      {isDropdownActive && (
        <ul className="absolute z-10 top-[110%] left-0 w-full px-4.5 py-4 rounded-xl border-2 border-secondary-8 bg-surface flex flex-col gap-3">
          {chainList?.map((item, i) => (
            <li key={i}>
              <a
                href="#"
                className="flex items-center gap-3 font-chakrapetch text-base font-bold text-secondary"
                onClick={() => handleDropdownData(item)}
              >
                <img
                  src={item.icon}
                  alt="icon"
                  className="w-6 h-6 rounded-full"
                />
                <span>{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownChain;
