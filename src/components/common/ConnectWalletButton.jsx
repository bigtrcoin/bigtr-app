import { ConnectButton } from "thirdweb/react";
import { useAizonData } from "../../utils/AizonContext";
import { client, presaleChain, walletList } from "../../web3/presale";

const ConnectWalletButton = () => {
  const { themeMode } = useAizonData();

  return (
    <div className="flex items-center gap-2.5">
      <ConnectButton
        client={client}
        chain={presaleChain}
        wallets={walletList}
        showAllWallets={true}
        theme={themeMode === "dark" ? "dark" : "light"}
        connectModal={{ showThirdwebBranding: false, size: "compact", title: "Connect your wallet" }}
        detailsModal={{ showThirdwebBranding: false }}
      />
    </div>
  );
};

export default ConnectWalletButton;
