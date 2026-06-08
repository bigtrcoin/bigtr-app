import React from "react";
import { useAizonData } from "../../utils/AizonContext";

const MainContent = ({ children }) => {
  const { isSidebarVisible } = useAizonData();

  return (
    <div
      className={`ml-0 transition-all duration-300
        ${
          isSidebarVisible ? "md:ml-27 xl:ml-70 2xl:ml-85" : "md:ml-27 xl:ml-30"
        } `}
    >
      <div className="w-full max-w-322.5 mx-auto px-5 md:px-7.5 xl:px-10">
        {children}
      </div>
    </div>
  );
};

export default MainContent;
