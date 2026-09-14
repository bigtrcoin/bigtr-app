import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThirdwebProvider } from "thirdweb/react";
import AizonContextProvider from "./utils/AizonContextProvider.jsx";
import App from "./App.jsx";
import "./assets/styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThirdwebProvider>
      <AizonContextProvider>
        <App />
      </AizonContextProvider>
    </ThirdwebProvider>
  </StrictMode>
);
