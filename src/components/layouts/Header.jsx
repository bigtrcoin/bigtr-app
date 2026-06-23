import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAizonData } from "../../utils/AizonContext";
import ConnectWalletButton from "../common/ConnectWalletButton";
import socialLinks from "../../assets/data/socialLinks";
import MobileMenu from "./MobileMenu";
import ThemeSwitcher from "./ThemeSwitcher";

import { RiMenu3Fill } from "react-icons/ri";
import { TbSettings } from "react-icons/tb";
import HeaderSmallLogo from "../../assets/images/logo-small3.svg?react";

const Header = () => {
  const { themeMode, isSidebarVisible, maxStage, currentStage } = useAizonData();

  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const handleMobileMenu = () => setIsMobileMenu(!isMobileMenu);

  const [isSettingsBar, setIsSettingsBar] = useState(false);
  const handleSettingsBar = () => setIsSettingsBar(!isSettingsBar);

  return (
    <React.Fragment>
      <header
        className={`transition-all duration-300 bg-transparent py-6 md:pt-6.25 md:pb-8 ${
          isSidebarVisible ? "md:pl-27 xl:pl-70 2xl:pl-85" : "md:pl-27 xl:pl-30"
        }`}
      >
        <div className="w-full max-w-322.5 mx-auto px-5 md:px-7.5 xl:px-10">
          <nav className="flex">
            <div className="w-full flex gap-3 justify-between">
              <div className="h-12.5 flex items-start xl:items-end gap-5 sm:gap-6 2xl:gap-10">
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
                </div>
              </div>
              <div className="h-12.5 flex items-center gap-2.5 2xl:gap-5">
                <ul className="hidden lg:flex items-center gap-2.5">
                  {socialLinks?.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <li key={index} className="h-12.5">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`rounded-[15px] px-3.75 py-3.25 backdrop-blur-[20px] flex items-center justify-center ${themeMode === "dark" ? "bg-secondary-15" : "bg-secondary-8"}`}
                        >
                          <Icon className="max-w-5 max-h-5 text-secondary" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <div className="hidden xs:block">
                  <ConnectWalletButton />
                </div>
                <button
                  className="flex items-center justify-center xl:hidden rounded-[15px] px-3.75 py-3.25 bg-secondary-15 backdrop-blur-[20px] text-2xl font-bold text-secondary"
                  onClick={handleMobileMenu}
                >
                  <RiMenu3Fill />
                </button>
                <button
                  className={`relative flex items-center justify-center rounded-[15px] px-3.75 py-3.25 backdrop-blur-[20px] text-2xl font-bold text-secondary ${themeMode === "dark" ? "bg-secondary-15" : "bg-secondary-8"}`}
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
      </header>
      <MobileMenu isMobileMenu={isMobileMenu} mobileMenuHandle={handleMobileMenu} />
      <ThemeSwitcher isSettingsBar={isSettingsBar} handleSettingsBar={handleSettingsBar} />
    </React.Fragment>
  );
};

export default Header;