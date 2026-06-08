import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppKitProvider } from "./AppKitProvider";
import { ThirdwebProvider } from "thirdweb/react";
import AizonContextProvider from "./utils/AizonContextProvider.jsx";
import ModalContextProvider from "./utils/ModalContextProvider.jsx";
import App from "./App.jsx";
import "./assets/styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppKitProvider>
      <ThirdwebProvider>
        <AizonContextProvider>
          <ModalContextProvider>
            <App />
          </ModalContextProvider>
        </AizonContextProvider>
      </ThirdwebProvider>
    </AppKitProvider>
  </StrictMode>
);