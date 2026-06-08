import React from "react";
import Data from "../../assets/data/howToBuy";

const HowToBuy = () => {
  return (
    <div className="rounded-[15px] px-5 md:px-6.25 2xl:px-10 pb-5 xl:pb-6 2xl:pb-10 bg-card">
      <div className="pt-5 md:pt-6.25 mb-5 sm:mb-6.75">
        <h2 className="aizon-title font-chakrapetch uppercase font-bold text-secondary">
          How to buy
        </h2>
      </div>

      <div className="grid gap-9.25">
        {Data?.map((item, id) => (
          <div key={id} className="flex gap-4 relative">
            {id < 2 && (
              <div className="absolute top-10 left-5 w-0 h-full border-l-2 border-dashed border-secondary-30"></div>
            )}

            <div className="shrink-0 grow-0 w-10 h-10 rounded-full border-2 border-dashed border-secondary-30 flex items-center justify-center">
              <h4 className="font-chakrapetch uppercase text-base sm:text-lg 2xl:text-xl font-bold text-secondary">
                {item.number}
              </h4>
            </div>
            <div className="sm:pt-2">
              <h4 className="mb-3 2xl:mb-4 font-chakrapetch uppercase text-sm sm:text-base 2xl:text-xl font-bold text-secondary">
                {item.title}
              </h4>
              <p className="text-sm sm:text-[15px] 2xl:text-base font-medium text-secondary-90">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToBuy;
