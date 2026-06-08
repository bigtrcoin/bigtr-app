import React from "react";
import { useAizonData } from "../../utils/AizonContext";
import CloseArrowImg from "../../assets/images/icons/right-double-arrow.png";

const ThemeSwitcher = ({ isSettingsBar, handleSettingsBar }) => {
  const {
    themeModes,
    themeColors,
    themeMode,
    setThemeMode,
    themeColor,
    setThemeColor,
  } = useAizonData();

  return (
    <div
      className={`fixed top-0 -right-full z-9999 w-full h-full transition-all duration-500 ${
        isSettingsBar ? "right-0" : ""
      }`}
      onClick={handleSettingsBar}
    >
      {/* bg overlay */}
      <div className="absolute -z-1 top-0 left-0 w-full h-full bg-[#17171780] backdrop-blur-[10px]"></div>

      {/* content */}
      <div className="relative w-70 xs:w-75 max-w-full ml-auto h-full animate-sidebar flex">
        <div className="absolute z-0 top-0 -left-7.5 w-12.5 h-full pt-6.75 rounded-tl-[15px] rounded-bl-[15px] bg-[linear-gradient(to_bottom,#ffffff33_0%,#ffffff00_100%)] backdrop-blur-[20px]">
          <button
            className="w-7.5 text-white flex items-center justify-center"
            onClick={handleSettingsBar}
          >
            <img src={CloseArrowImg} alt="X" />
          </button>
        </div>

        <div className="z-1 rounded-tl-[15px] rounded-bl-[15px] bg-body">
          <div className="px-5 md:px-6.25 pt-3 md:pt-4.5 pb-3.75 mb-1.25 border-b border-secondary-12 flex items-center justify-between">
            <h2 className="uppercase font-chakrapetch font-bold text-[22px] text-secondary">
              Settings
            </h2>
          </div>

          <div
            className="aizon-scroll relative h-[calc(100%-70px)] p-5 md:p-6.25 flex flex-col justify-between"
            data-lenis-prevent
          >
            <div className="flex flex-col gap-10">
              <div className="">
                <h4 className="uppercase font-bold text-[15px] text-secondary">
                  Appearance
                </h4>
                <div className="pt-3 flex items-center gap-5">
                  {themeModes?.map((mode, i) => (
                    <button
                      key={i}
                      className="w-full bg-secondary-6 rounded-[15px] text-secondary text-base font-medium uppercase"
                      onClick={() => setThemeMode(mode.id)}
                    >
                      <span
                        className={`w-full h-15 rounded-[15px] flex items-center justify-center text-[20px] border-2 ${themeMode === mode.id ? "bg-secondary-15 border-secondary-20" : "bg-secondary-8 border-transparent"}`}
                      >
                        <mode.icon />
                      </span>

                      <span className="block p-2">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="">
                <h4 className="uppercase font-medium text-base text-secondary">
                  Colors
                </h4>

                <div className="pt-3 grid grid-cols-3 gap-3">
                  {themeColors?.map((color, i) => (
                    <button
                      key={i}
                      className={`w-fit p-1.25 bg-secondary-10 rounded-[15px] uppercase font-semibold text-[13px] text-secondary border-2 ${themeColor === color.id ? "border-primary" : "border-transparent"}`}
                      onClick={() => setThemeColor(color.id)}
                    >
                      <span
                        className="mb-1.75 block w-16.25 h-10 rounded-xl"
                        style={{ backgroundColor: color.color }}
                      ></span>
                      <span>{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full">
              <a
                href="https://themeforest.net/item/aizon-ico-token-presale-and-staking-tailwind-template/61550360?s_rank=1"
                target="_blank"
                className="aizon-btn w-full px-1 py-3.75 rounded-[15px] font-chakrapetch uppercase font-bold text-base text-btn-text bg-primary backdrop-blur-[15px] flex items-center justify-center"
              >
                <span className="btn-inner">
                  <span className="btn-normal-text">Purcahse Now</span>
                  <span className="btn-hover-text">Purcahse Now</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
