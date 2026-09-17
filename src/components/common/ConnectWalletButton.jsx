import { ConnectButton } from "thirdweb/react";
import { useAizonData } from "../../utils/AizonContext";
import { client, presaleChain } from "../../web3/presale";
import { accountAbstraction, connectWallets } from "../../web3/wallets";

const ConnectWalletButton = () => {
  const { themeMode } = useAizonData();

  return (
    <div className="flex items-center gap-2.5">
      <ConnectButton
        client={client}
        chain={presaleChain}
        wallets={connectWallets()}
        accountAbstraction={accountAbstraction}
        showAllWallets={true}
        theme={themeMode === "dark" ? "dark" : "light"}
        connectModal={{ showThirdwebBranding: false, size: "compact", title: "Sign in or connect a wallet" }}
        detailsModal={{ showThirdwebBranding: false }}
      />
    </div>
  );
};

export default ConnectWalletButton;
