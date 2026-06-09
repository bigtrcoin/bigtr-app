import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { useAizonData } from "../../utils/AizonContext";

const client = createThirdwebClient({
  clientId: "807215563adc5564b9e3ece0321aabac",
});

const ConnectWalletButton = ({ width }) => {
  const { themeMode } = useAizonData();

  return (
    <div className="flex items-center gap-2.5">
      <ConnectButton
        client={client}
        theme={themeMode === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default ConnectWalletButton;