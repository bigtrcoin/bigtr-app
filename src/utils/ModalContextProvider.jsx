import { useState } from "react";
import { ModalContext } from "./ModalContext";
import Modal from "../components/common/Modal";

const ModalContextProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState(null);

  const modalHandle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const variantModalHanle = (_variant) => {
    modalHandle();
    setModalVariant(_variant);
  };

  return (
    <ModalContext.Provider
      value={{ isModalOpen, modalHandle, variantModalHanle }}
    >
      {children}

      {/* modal section */}
      {isModalOpen && modalVariant && <Modal variant={modalVariant} />}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
