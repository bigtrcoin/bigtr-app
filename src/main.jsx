import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppKitProvider } from "./AppKitProvider";
import AizonContextProvider from "./utils/AizonContextProvider.jsx";
import ModalContextProvider from "./utils/ModalContextProvider.jsx";
import App from "./App.jsx";

// CSS styles
import "./assets/styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppKitProvider>
      <AizonContextProvider>
        <ModalContextProvider>
          <App />
        </ModalContextProvider>
      </AizonContextProvider>
    </AppKitProvider>
  </StrictMode>
);
