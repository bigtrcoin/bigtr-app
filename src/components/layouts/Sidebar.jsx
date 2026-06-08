import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import sidebarMenu from "../../assets/data/sidebarMenu";
import { useAizonData } from "../../utils/AizonContext";

import HeaderLogo from "../../assets/images/logo.svg?react";
import HeaderSmallLogo from "../../assets/images/logo-small.svg?react";
import HeaderSmallLogo2 from "../../assets/images/logo-small2.svg?react";
import BgBalanceImg from "../../assets/images/bg/bg-balance.svg?react";

const Sidebar = () => {
  const {
    isSidebarVisible,
    setIsSidebarVisible,
    tokenSymbol,
    userTokenBalance,
  } = useAizonData();

  const [sidebarStyle, setSidebarStyle] = useState(false);
  const [togglerStyle, setTogglerStyle] = useState({ left: "328px" });
  const [togglerUpStyle, setTogglerUpStyle] = useState({
    background: "var(--color-secondary)",
    transform: "translateY(2.4px) translateZ(0px) rotate(0deg)",
  });
  const [togglerDownStyle, setTogglerDownStyle] = useState({
    background: "var(--color-secondary)",
    transform: "translateY(-2.4px) translateZ(0px) rotate(0deg)",
  });

  const toggleSidebarVisible = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    if (!isSidebarVisible) {
      setTogglerStyle({
        left: "120px",
      });

      setTogglerUpStyle({
        background: "var(--color-secondary)",
        transform: "translateY(2.4px) translateZ(0px) rotate(-15deg)",
      });

      setTogglerDownStyle({
        background: "var(--color-secondary)",
        transform: "translateY(-2.4px) translateZ(0px) rotate(15deg)",
      });

      setSidebarStyle(true);
    }

    if (isSidebarVisible) {
      setTogglerStyle({
        left: "328px",
      });

      setTogglerUpStyle({
        background: "var(--color-secondary)",
        transform: "translateY(2.4px) translateZ(0px) rotate(0deg)",
      });

      setTogglerDownStyle({
        background: "var(--color-secondary)",
        transform: "translateY(-2.4px) translateZ(0px) rotate(0deg)",
      });

      setSidebarStyle(false);
    }
  }, [isSidebarVisible]);

  const handleMouseEnter = () => {
    if (!isSidebarVisible) {
      setTogglerUpStyle({
        background: "var(--color-secondary)",
        transform: "translateY(2.4px) translateZ(0px) rotate(-15deg)",
      });

      setTogglerDownStyle({
        background: "var(--color-secondary)",
        transform: "translateY(-2.4px) translateZ(0px) rotate(15deg)",
      });
    } else {
      setTogglerUpStyle({
        background: "var(--color-secondary)",
        transform: "translateY(2.4px) translateZ(0px) rotate(15deg)",
      });

      setTogglerDownStyle({
        background: "var(--color-secondary)",
        transform: "translateY(-2.4px) translateZ(0px) rotate(-15deg)",
      });
    }
  };

  const handleMouseLeave = () => {
    if (!isSidebarVisible) {
      setTogglerUpStyle({
        background: "var(--color-secondary)",
        transform: "translateY(2.4px) rotate(-15deg)",
      });

      setTogglerDownStyle({
        background: "var(--color-secondary)",
        transform: "translateY(-2.4px) rotate(15deg)",
      });
    } else {
      setTogglerUpStyle({
        background: "var(--color-secondary)",
        transform: "translateY(2.4px) rotate(0deg)",
      });

      setTogglerDownStyle({
        background: "var(--color-secondary)",
        transform: "translateY(-2.4px) rotate(0deg)",
      });
    }
  };

  return (
    <nav className="hidden md:block">
      {/* toggler button */}
      <div
        className={`fixed z-999 cursor-pointer w-12 h-12 duration-200 hidden xl:flex items-center justify-start ${
          sidebarStyle
            ? "xl:left-27.5 2xl:left-27.5"
            : "xl:left-67 2xl:left-82.5"
        }  transition-all duration-300 top-10.5`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={toggleSidebarVisible}
      >
        <button className={`w-full h-full flex items-center justify-center`}>
          <div className="flex flex-col items-center w-6 h-6">
            <div
              className="h-3 w-1 rounded-full duration-200"
              style={togglerUpStyle}
            ></div>
            <div
              className="h-3 w-1 rounded-full duration-200"
              style={togglerDownStyle}
            ></div>
          </div>
        </button>
      </div>

      {/* sidebar content */}
      <div
        className={`fixed z-99 top-0 left-7 xl:left-10 h-full transition-all duration-300 ${
          sidebarStyle ? "w-20" : "w-20 xl:w-60 2xl:w-75"
        }`}
      >
        <div
          className={`w-full h-full py-6.25 flex flex-col transition-all duration-300 ${
            isSidebarVisible ? "gap-8 xl:gap-10.5" : "gap-10.5"
          }`}
        >
          {/* sidebar content */}
          <div className="sidebar-bg h-full bg relative overflow-hidden rounded-[15px] backdrop-blur-[10px]">
            {/* header logo */}
            <div className="hidden xl:flex p-3.75">
              <NavLink
                to="/"
                className={`transition-all duration-300 ${
                  isSidebarVisible ? "w-42.5 h-12.5" : "w-12.5 h-12.5"
                }`}
              >
                {isSidebarVisible ? (
                  <HeaderLogo className="w-full h-full aizon-sidebar-logo" />
                ) : (
                  <HeaderSmallLogo className="w-full h-full aizon-sidebar-logo" />
                )}
              </NavLink>
            </div>

            <div className="flex xl:hidden p-3.75">
              <NavLink
                to="/"
                className={`transition-all duration-300  w-13.75 h-13.75 block`}
              >
                <HeaderSmallLogo2 />
              </NavLink>
            </div>

            <div className="w-37.5 h-0.5 bg-linear-to-r from-secondary-20 to-transparent"></div>

            <div
              className={`aizon-scroll flex flex-col justify-between ${
                isSidebarVisible ? "h-[calc(100%-72px)]" : "h-[calc(100%-80px)]"
              }`}
              data-lenis-prevent
            >
              {/* menu */}
              <ul className="p-3.75 hidden xl:flex flex-col gap-1.25 sidebar-menu">
                {sidebarMenu?.map((menuItem, mid) => {
                  const Icon = menuItem.icon;

                  return (
                    <li key={mid}>
                      <NavLink
                        to={menuItem.url}
                        className="w-fit group flex items-center"
                      >
                        <div className="w-11.25 h-11.25 rounded-[15px] group-[.active]:bg-primary-40 flex items-center justify-center">
                          <Icon className="w-6 h-6 opacity-80 group-[.active]:opacity-100 text-secondary-80 group-[.active]:text-secondary" />
                        </div>
                        {isSidebarVisible && (
                          <div className="menu-title w-37 2xl:w-42.5 h-11.25 px-2.5 2xl:px-3 flex items-center rounded-[15px] bg-linear-to-r from-transparent to-transparent group-[.active]:from-primary-40 group-[.active]:to-transparent">
                            <p className="capitalize text-[15px] 2xl:text-base font-medium text-secondary-80 group-[.active]:text-secondary">
                              {menuItem.title}
                            </p>
                          </div>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              <ul className="p-3.75 pt-2 flex flex-col gap-1 xl:hidden">
                {sidebarMenu?.map((menuItem, mid) => {
                  const Icon = menuItem.icon;

                  return (
                    <li key={mid}>
                      <NavLink
                        to={menuItem.url}
                        className="group flex items-center"
                      >
                        <div className="w-11.25 h-11.25 grow-0 shrink-0 rounded-[15px] transition-all duration-300 group-[.active]:bg-primary-50 flex items-center justify-center">
                          <Icon className="w-6 h-6 opacity-80 group-[.active]:opacity-100 text-secondary-80 group-[.active]:text-secondary" />
                        </div>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              {/* balance card */}
              <div className="relative bottom-0 left-0 w-full hidden xl:block">
                {isSidebarVisible && (
                  <div className="w-full relative py-4 px-8.75 bg-surface backdrop-blur-[10px] bg-no-repeat bg-top-left">
                    <div className="absolute top-0 left-0 w-37.5 h-0.5 bg-linear-to-r from-secondary-30 to-transparent"></div>

                    <div className="absolute top-0 left-0">
                      <BgBalanceImg />
                    </div>

                    <p className="pb-1.25 whitespace-nowrap font-chakrapetch uppercase text-xs font-semibold text-secondary-80">
                      Your Balance
                    </p>
                    <h4 className="pb-2 whitespace-nowrap font-chakrapetch uppercase text-base font-bold text-secondary">
                      {userTokenBalance} {tokenSymbol}
                    </h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
