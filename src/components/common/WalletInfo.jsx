import React, { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { usePresale } from "../../hooks/usePresale";
import { TOKEN_DECIMALS } from "../../web3/presale";

import { FaCheck } from "react-icons/fa6";
import { TbCopy } from "react-icons/tb";

const fromUnits = (v, dec = 18) =>
  v === undefined || v === null ? 0 : Number(v) / 10 ** dec;

const WalletInfo = () => {
  const account = useActiveAccount();
  const { allocated } = usePresale();

  const walletAddress = account?.address || "";
  const myAllocation = fromUnits(allocated, TOKEN_DECIMALS);

  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  };

  return (
    <div className="h-full p-5 md:p-6.25 2xl:px-10 2xl:pt-6.5 2xl:pb-10 rounded-[15px] bg-card">
      <h2 className="aizon-title mb-5 uppercase font-chakrapetch font-bold text-secondary">
        Wallet
      </h2>

      <h5 className="mb-2 uppercase text-[15px] md:text-base font-semibold text-secondary-90">
        Wallet Address
      </h5>

      <div className="flex items-center gap-2">
        <h4 className="uppercase text-[18px] md:text-xl font-semibold text-secondary">
          {walletAddress ? (
            <>
              <span className="hidden sm:block">
                {walletAddress.slice(0, 10) + "..." + walletAddress.slice(-9)}
              </span>
              <span className="block sm:hidden">
                {walletAddress.slice(0, 4) + "..." + walletAddress.slice(-4)}
              </span>
            </>
          ) : (
            "—"
          )}
        </h4>

        {walletAddress && (
          <button className="text-xl font-bold text-primary" onClick={copyToClipboard}>
            {copied ? <FaCheck /> : <TbCopy />}
          </button>
        )}
      </div>

      <div className="mt-8 2xl:mt-10">
        <h5 className="mb-2 uppercase text-[15px] md:text-base font-semibold text-secondary-90">
          Your BIGTR Allocation
        </h5>
        <h3 className="uppercase font-chakrapetch text-3xl 2xl:text-4xl font-bold text-primary">
          {myAllocation.toLocaleString()} <span className="text-secondary">BIGTR</span>
        </h3>
        <p className="mt-2 font-chakrapetch text-sm text-secondary-80">
          Tokens are distributed at listing according to the vesting schedule.
        </p>
      </div>
    </div>
  );
};

export default WalletInfo;
