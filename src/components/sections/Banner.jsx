import React from "react";
import { NavLink } from "react-router-dom";
import { useAizonData } from "../../utils/AizonContext";

import DotsImg from "../../assets/images/banner/dots.png";
import ShapeImg from "../../assets/images/banner/shape.svg?react";
import StarBgImg from "../../assets/images/banner/star-bg.svg?react";
import StarBg2Img from "../../assets/images/banner/star-bg-2.png";
import CurrencyImg from "../../assets/images/banner/currency.svg?react";

import GreenStarImg from "../../assets/images/banner/star-green.svg";
import TealStarImg from "../../assets/images/banner/star-teal.png";
import BlueStarImg from "../../assets/images/banner/star-blue.png";
import IndigoStarImg from "../../assets/images/banner/star-indigo.png";
import LimeStarImg from "../../assets/images/banner/star-lime.png";
import RedStarImg from "../../assets/images/banner/star-red.png";

const Banner = () => {
  const { themeColor, tokenSymbol, listingPrice } = useAizonData();

  const starImages = {
    green: GreenStarImg,
    teal: TealStarImg,
    blue: BlueStarImg,
    indigo: IndigoStarImg,
    lime: LimeStarImg,
    red: RedStarImg,
  };

  const starImage = starImages[themeColor] || GreenStarImg;

  return (
    <section className="pb-7.5">
      <div className="rounded-[15px] overflow-hidden relative z-0 px-5 md:px-6.25 2xl:px-10 py-5 sm:py-10 2xl:pt-11.5 2xl:pb-14.5 flex flex-col gap-10 lg:flex-row lg:gap-0 justify-between bg-linear-to-t from-shape to-shape-end">
        <div className="absolute -z-1 top-0 left-0 h-full">
          <img src={DotsImg} alt="dots" className="h-full object-cover" />
        </div>

        <div className="absolute -z-1 top-0 left-0">
          <ShapeImg />
        </div>

        <div className="hidden lg:block absolute -z-1 -bottom-7.5 2xl:bottom-0 -right-17.5 2xl:right-0">
          <img src={StarBg2Img} alt="shape" className="w-84.25 h-65" />

          <div className="absolute z-1 -top-[40%] -left-[30%] w-75 h-75">
            <StarBgImg className="w-75 h-75 animate-spin-slow" />

            <div className="absolute z-1 bottom-[20%] -left-5">
              <CurrencyImg />
            </div>

            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] animate-star">
              <img src={starImage} alt="image" className="w-45 h-45" />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[70%]">
          <h2 className="mb-5 sm:mb-4.5 w-full max-w-62.5 sm:max-w-75 md:max-w-99.25 uppercase font-chakrapetch text-3xl sm:text-4xl md:text-[50px] md:leading-15 font-bold text-white">
            Discover BigTrCoin
          </h2>

          <p className="max-w-full w-full md:max-w-128.5 text-base sm:leading-8 font-medium text-white">
            Buy $BIGTR now and be part of the next generation blockchain revolution.
            Join the presale and influence the future of BigTrCoin.
          </p>

          <div className="mt-8 sm:mt-10 flex items-center gap-5 xl:gap-12 flex-wrap">
            <NavLink
              to="/buy"
              className="aizon-btn py-3.75 w-55 h-13.75 rounded-[15px] bg-primary uppercase font-chakrapetch text-base font-bold text-btn-text"
            >
              <span className="btn-inner">
                <span className="btn-normal-text">Buy Now</span>
                <span className="btn-hover-text">Buy Now</span>
              </span>
            </NavLink>

            <div className="font-chakrapetch">
              <h4 className="mb-0.5 uppercase text-base font-bold text-white-80">
                Listing Price
              </h4>
              <h3 className="uppercase text-[18px] sm:text-xl font-bold text-white">
                1 {tokenSymbol} = {listingPrice} USDT
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;