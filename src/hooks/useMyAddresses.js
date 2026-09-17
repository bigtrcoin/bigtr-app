// src/hooks/useMyAddresses.js
// Every connection now runs through a smart account (see web3/wallets.js), so
// a buyer can own BIGTR under two addresses: the smart account they use today
// and the plain wallet address (the signer) they may have bought with before
// this change. Allocation, transactions and totals are shown for both.
import { useMemo } from "react";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";

export default function useMyAddresses() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  const smart = account?.address || null;
  let signer = null;
  try {
    signer = wallet?.getAdminAccount?.()?.address || null;
  } catch {
    // Not a smart wallet (or not connected yet): there is no separate signer.
    signer = null;
  }

  return useMemo(() => {
    const list = [];
    for (const a of [smart, signer]) {
      if (a && !list.some((x) => x.toLowerCase() === a.toLowerCase())) list.push(a);
    }
    return { addresses: list, smart, signer: list.length > 1 ? signer : null };
  }, [smart, signer]);
}
