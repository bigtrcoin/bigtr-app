import React from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import sidebarMenu from "../../assets/data/sidebarMenu";
import HeaderLogo from "../../assets/images/logo-mobile.svg?react";
import socialLinks from "../../assets/data/socialLinks";
import ConnectWalletButton from "./../common/ConnectWalletButton";

const MobileMenu = ({ isMobileMenu, mobileMenuHandle }) => {
  return (
    <div
      className={`fixed top-0 -left-full z-9999 w-full h-full transition-all duration-500 ${
        isMobileMenu ? "left-[0%]" : ""
      }`}
      // onClick={mobileMenuHandle}
    >
      {/* bg overlay */}
      <div
        className="absolute -z-1 top-0 left-0 w-full h-full bg-[#0000001f] backdrop-blur-[10px]"
        onClick={mobileMenuHandle}
      ></div>

      {/* content */}
      <div className="w-70 xs:w-[320px] max-w-full h-full bg-body p-5 md:p-7 animate-sidebar">
        <div className="mb-8.75 flex items-center justify-between">
          <NavLink to="/" className="w-35 h-8.75">
            <HeaderLogo className="w-full h-full" />
          </NavLink>

          <button className="text-secondary" onClick={mobileMenuHandle}>
            <AiOutlineClose />
          </button>
        </div>

        <div className="aizon-scroll h-[calc(100%-50px)]" data-lenis-prevent>
          {/* menu */}
          <ul className="flex flex-col gap-1.5">
            {sidebarMenu?.map((menuItem, mid) => {
              const Icon = menuItem.icon;

              return (
                <li key={mid}>
                  <NavLink
                    to={menuItem.url}
                    className="group flex items-center"
                  >
                    <div className="w-11.25 h-11.25 rounded-[15px] p-3 group-[.active]:bg-primary-50 flex items-center justify-center">
                      <Icon className="w-6 h-6 opacity-80 group-[.active]:opacity-100 text-secondary-80 group-[.active]:text-secondary" />
                    </div>
                    <div className="w-42.5 h-11.25 rounded-[15px] px-3 flex items-center bg-linear-to-r from-transparent to-transparent group-[.active]:from-primary-50 group-[.active]:to-transparent">
                      <p className="capitalize text-base font-medium text-secondary-80 group-[.active]:text-secondary">
                        {menuItem.title}
                      </p>
                    </div>
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* social links */}
          <ul className="pt-6.75 flex items-center gap-5">
            {socialLinks?.map((item, index) => (
              <li key={index}>
                <a
                  href={item.url}
                  target="_blank"
                  className="aizon-btn rounded-[15px] px-3.75 py-3 bg-secondary-15 flex items-center justify-center"
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

          <div className="pt-6.75">
            <ConnectWalletButton width="100%" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
