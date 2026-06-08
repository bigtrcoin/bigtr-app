import { createAppKit } from "@reown/appkit/react";

import { http, WagmiProvider } from "wagmi";
import {
  arbitrum,
  arbitrumGoerli,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
} from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://dashboard.reown.com
const projectId = "38bce25d7215b8c858c860873ac59f9f";

// 3. Set the networks
const networks = [
  mainnet,
  sepolia,
  bsc,
  bscTestnet,
  base,
  baseSepolia,
  polygon,
  polygonAmoy,
  optimism,
  optimismSepolia,
  arbitrum,
  arbitrumGoerli,
];

const transports = {
  [sepolia.id]: http(
    `https://eth-sepolia.g.alchemy.com/v2/xaArzwj6OAH1hjbgwu-60MpYau2MCj6o`
  ),
};

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
  // transports, // 👈 inject RPCs here
});

// 5. Create modal
createAppKit({
  defaultNetwork: mainnet,
  adapters: [wagmiAdapter],
  networks,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    connectMethodsOrder: ["wallet"],
  },
  themeVariables: {
    "--w3m-font-family": '"Chakra Petch", sans-serif',
    "--w3m-accent": "#ffffff",
    "--w3m-border-radius-master": "2px",
  },
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", //metamask
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", //trust wallet
    "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", //coinbase
    "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4", //binance wallet
    "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", //rainbowkit
    "ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef", //imToken
    "c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a", //uniswap
    "107bb20463699c4e614d3a2fb7b961e66f48774cb8f6d6c1aee789853280972c", //bitcoin
  ],
  allowUnsupportedChain: true,
});

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
