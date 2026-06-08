import React from "react";
import PhaseItem from "../common/PhaseItem";
import stagesData from "../../assets/data/stages";

const Phase = () => {
  return (
    <section className="pb-6.25">
      <div className="mb-7.5">
        <h2 className="uppercase font-chakrapetch text-[30px] font-bold text-secondary">
          Sale Calendar
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7.5">
        {stagesData?.map((item, i) => (
          <PhaseItem key={i} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Phase;
