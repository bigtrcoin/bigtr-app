import { createContext, useContext } from "react";

export const AizonContext = createContext();

export const useAizonData = () => {
  const context = useContext(AizonContext);
  if (!context) {
    throw new Error("useAizonData must be used within a AizonContextProvider");
  }
  return context;
};
