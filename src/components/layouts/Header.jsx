import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAizonData } from "../../utils/AizonContext";
import ConnectWalletButton from "../common/ConnectWalletButton";
import socialLinks from "../../assets/data/socialLinks";
import Countdown from "../common/Countdown";
import MobileMenu from "./MobileMenu";
import ThemeSwitcher from "./ThemeSwitcher";

import { RiMenu3Fill, RiSettings3Line } from "react-icons/ri";
import { TbSettings } from "react-icons/tb";
import HeaderSmallLogo from "../../assets/images/logo-small3.svg?react";

const Header = () => {
  const { themeMode, isSidebarVisible, maxStage, currentStage, stageEnd } =
    useAizonData();

  // mobile menu condition
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const handleMobileMenu = () => {
    setIsMobileMenu(!isMobileMenu);
  };

  // theme mode condition
  const [isSettingsBar, setIsSettingsBar] = useState(false);
  const handleSettingsBar = () => {
    setIsSettingsBar(!isSettingsBar);
  };

  return (
    <>
      {/* header */}
      <header
        className={`transition-all duration-300 bg-transparent py-6 md:pt-6.25 md:pb-8 ${
          isSidebarVisible ? "md:pl-27 xl:pl-70 2xl:pl-85" : "md:pl-27 xl:pl-30"
        }`}
      >
        <div className="w-full max-w-322.5 mx-auto px-5 md:px-7.5 xl:px-10">
          <nav className="flex">
            <div className="w-full flex gap-3 justify-between">
              {/* left content */}
              <div className="h-12.5 flex items-start xl:items-end gap-5 sm:gap-6 2xl:gap-10">
                {/* header logo */}
                <div className="flex md:hidden">
                  <NavLink to="/" className="w-13.75 h-13.75">
                    <HeaderSmallLogo className="w-full h-full" />
                  </NavLink>
                </div>

                <div className="hidden md:pt-px header-text sm:flex items-start xl:gap-8 2xl:gap-10">
                  <h2 className="md:pt-px hidden md:block uppercase font-chakrapetch text-2xl xl:text-[28px] 2xl:text-3xl leading-8 font-bold text-secondary">
                    Phase {currentStage}{" "}
                    <span className="relative align-baseline -top-1 2xl:-top-2 text-[18px] xl:text-xl text-secondary-80">
                      /{maxStage}
                    </span>
                  </h2>

                  <div className="hidden sm:block">
                    <p className="uppercase font-chakrapetch text-sm md:text-base font-bold text-secondary-80">
                      {/* Price increase in */}
                      NEXT PHASE BEGINS IN
                    </p>

                    {/* stage end countdown */}
                    <Countdown endDate={stageEnd} />
                  </div>
                </div>
              </div>

              {/* right content */}
              <div className="h-12.5 flex items-center gap-2.5 2xl:gap-5">
                {/* social links */}
                <ul className="hidden lg:flex items-center gap-2.5">
                  {socialLinks?.map((item, index) => (
                    <li key={index} className="h-12.5">
                      <a
                        href={item.url}
                        target="_blank"
                        className={`aizon-btn rounded-[15px] px-3.75 py-3.25 backdrop-blur-[20px] flex items-center justify-center ${themeMode == "dark" ? "bg-secondary-15" : "bg-secondary-8"}`}
                      >
                        <span className="btn-inner">
                          <span className="btn-normal-text">
                            <item.icon className="max-w-5 max-h-5" />
                          </span>
                          <span className="btn-hover-text">
                            <item.icon className="max-w-5 max-h-5" />
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                {/* connect wallet button */}
                <div className="hidden xs:block">
                  <ConnectWalletButton />
                </div>

                {/* menu button toggler */}
                <button
                  className="flex items-center justify-center xl:hidden rounded-[15px] px-3.75 py-3.25 bg-secondary-15 backdrop-blur-[20px] text-2xl font-bold text-secondary"
                  onClick={handleMobileMenu}
                >
                  <RiMenu3Fill />
                </button>

                {/* settings bar toggler */}
                <button
                  className={`relative flex items-center justify-center rounded-[15px] px-3.75 py-3.25 backdrop-blur-[20px] text-2xl font-bold text-secondary ${themeMode == "dark" ? "bg-secondary-15" : "bg-secondary-8"}`}
                  onClick={handleSettingsBar}
                >
                  <div className="absolute top-2.25 right-2.25 w-1.25 h-1.25 rounded-full bg-primary"></div>
                  <span className="animate-spin-slow">
                    <TbSettings />
                  </span>
                </button>
              </div>
            </div>
          </nav>
        </div>

        <div className="block sm:hidden pt-3.5 px-5">
          <div className="flex items-center justify-between gap-2">
            <p className="uppercase font-chakrapetch text-sm font-bold text-secondary-80">
              Price increase in
            </p>

            {/* stage end countdown */}
            <Countdown endDate={stageEnd} />
          </div>
        </div>
      </header>

      {/* mobilemenu */}
      <MobileMenu
        isMobileMenu={isMobileMenu}
        mobileMenuHandle={handleMobileMenu}
      />

      {/* settingsbar */}
      <ThemeSwitcher
        isSettingsBar={isSettingsBar}
        handleSettingsBar={handleSettingsBar}
      />
    </>
  );
};

export default Header;
