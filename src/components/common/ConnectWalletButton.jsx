import { ConnectButton } from "thirdweb/react";
import { useAizonData } from "../../utils/AizonContext";
import { client, presaleChain } from "../../web3/presale";

const ConnectWalletButton = () => {
  const { themeMode } = useAizonData();

  return (
    <div className="flex items-center gap-2.5">
      <ConnectButton
        client={client}
        chain={presaleChain}
        theme={themeMode === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default ConnectWalletButton;
