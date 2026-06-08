import { createContext, useContext } from "react";

export const ModalContext = createContext();

export const useAizonModal = () => useContext(ModalContext);
