import React, { useEffect, useState, useCallback } from "react";
import { FaCircle } from "react-icons/fa6";
import { useActiveAccount } from "thirdweb/react";
import { usePresale } from "../../hooks/usePresale";
import { PAY_TOKENS, STABLE_DECIMALS, TOKEN_DECIMALS } from "../../web3/presale";

// 1e18 olcekli bigint -> okunabilir sayi
const fromUnits = (v, dec = 18) => {
  if (v === undefined || v === null) return 0;
  return Number(v) / 10 ** dec;
};

const BuyCard = () => {
  const account = useActiveAccount();
  const {
    price,
    totalRaised,
    totalTokensSold,
    allocated,
    quote,
    buy,
    isBuying,
  } = usePresale();

  // sozlesme stablecoin bazli: yalnizca USDT / USDC (BNB Chain)
  const [payToken, setPayToken] = useState(PAY_TOKENS[0]);
  const [amount, setAmount] = useState("");
  const [tokensOut, setTokensOut] = useState(0n);
  const [status, setStatus] = useState("");

  const unitPrice = fromUnits(price, STABLE_DECIMALS); // 1 BIGTR = ? USD
  const raised = fromUnits(totalRaised, STABLE_DECIMALS);
  const sold = fromUnits(totalTokensSold, TOKEN_DECIMALS);
  const myAllocation = fromUnits(allocated, TOKEN_DECIMALS);

  // tutar degistikce kontrattan onizleme al (ekrandaki rakam kontratla birebir)
  useEffect(() => {
    let active = true;
    (async () => {
      if (!amount || Number(amount) <= 0) {
        setTokensOut(0n);
        return;
      }
      try {
        const { tokens } = await quote(amount);
        if (active) setTokensOut(tokens);
      } catch {
        if (active) setTokensOut(0n);
      }
    })();
    return () => {
      active = false;
    };
  }, [amount, quote]);

  const handleBuy = useCallback(async () => {
    setStatus("");
    if (!account) {
      setStatus("Please connect your wallet first.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setStatus("Please enter a valid amount.");
      return;
    }
    try {
      setStatus("Confirm the approval and purchase in your wallet...");
      await buy(payToken.address, amount);
      setStatus("Purchase successful. Your BIGTR allocation has been recorded.");
      setAmount("");
      setTokensOut(0n);
    } catch (e) {
      setStatus("Transaction failed: " + (e?.message || "unknown error"));
    }
  }, [account, amount, payToken, buy]);

  // Kredi karti: thirdweb Pay ile, musterinin thirdweb hesabi + Pay aktif olunca baglanir
  const handleCard = () => {
    setStatus(
      "Credit card payment will be enabled once Pay is activated on the thirdweb account."
    );
  };

  return (
    <div className="rounded-[15px] overflow-hidden bg-card">
      <div className="px-5 md:px-6.25 2xl:px-10 py-5 2xl:py-5.75 bg-surface flex items-start md:items-center justify-between gap-5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <FaCircle className="text-[12px] text-primary" />
          <h4 className="font-chakrapetch uppercase text-[15px] 2xl:text-base font-bold text-primary-70">
            Current Price: 1 BIGTR = ${unitPrice ? unitPrice : "—"}
          </h4>
        </div>
        {account && (
          <div className="flex items-center gap-2.5">
            <FaCircle className="text-[12px] text-primary" />
            <h4 className="font-chakrapetch uppercase text-[15px] 2xl:text-base font-bold text-primary-70">
              Your BIGTR: {myAllocation.toLocaleString()}
            </h4>
          </div>
        )}
      </div>

      <div className="px-5 md:px-6.25 2xl:px-10 pt-6 2xl:pt-7 pb-5 2xl:pb-10">
        <div className="mb-5 sm:mb-9">
          <div className="flex items-center gap-4 flex-wrap justify-between">
            <p className="font-chakrapetch uppercase text-base font-bold text-secondary">
              <span className="text-secondary-80">Raised:</span>{" "}
              {raised.toLocaleString()} USD
            </p>
            <p className="font-chakrapetch uppercase text-base font-bold text-secondary">
              <span className="text-secondary-80">Sold:</span>{" "}
              {sold.toLocaleString()} BIGTR
            </p>
          </div>
        </div>

        {/* Odeme tokeni secimi: USDT / USDC (BNB Chain) */}
        <div className="mb-5 sm:mb-9">
          <h4 className="block mb-2 font-chakrapetch uppercase text-base font-bold text-secondary">
            Payment Method
          </h4>
          <div className="grid grid-cols-2 gap-2 2xl:gap-3.75 max-w-xs">
            {PAY_TOKENS.map((t) => (
              <button
                key={t.symbol}
                onClick={() => setPayToken(t)}
                className={`px-4 py-3 rounded-[12px] font-chakrapetch uppercase font-bold border-2 transition ${
                  payToken.symbol === t.symbol
                    ? "border-primary text-primary"
                    : "border-secondary-8 text-secondary"
                }`}
              >
                {t.symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Tutar */}
        <div className="mb-5 sm:mb-10">
          <label className="block mb-2 font-chakrapetch uppercase text-base font-bold text-secondary">
            Pay Amount ({payToken.symbol})
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              className="w-full rounded-[18px] px-4 sm:px-5 py-3 sm:py-5.5 pr-20 bg-secondary-3 border-2 border-secondary-8 font-chakrapetch text-lg sm:text-2xl font-bold text-secondary transition focus:outline-none"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="absolute top-1/2 right-4 sm:right-5 -translate-y-1/2 flex items-center gap-2">
              <span className="px-2.5 py-0.75 rounded-[10px] bg-secondary-12 font-chakrapetch uppercase text-base sm:text-lg font-bold text-secondary-50">
                {payToken.symbol}
              </span>
            </div>
          </div>
        </div>

        {/* Alinacak BIGTR (kontrattan quote) */}
        <div className="mb-5 sm:mb-10">
          <label className="block mb-2 font-chakrapetch uppercase text-base font-bold text-secondary">
            Get Token
          </label>
          <div className="relative w-full rounded-[18px] px-4 sm:px-5 py-3 sm:py-5.5 bg-secondary-3 border-2 border-secondary-8">
            <input
              type="text"
              className="w-full bg-transparent font-chakrapetch text-lg sm:text-2xl font-bold text-secondary focus:outline-none"
              disabled
              value={fromUnits(tokensOut, TOKEN_DECIMALS).toLocaleString()}
            />
            <div className="absolute top-1/2 right-4 sm:right-5 -translate-y-1/2 flex items-center gap-2">
              <span className="px-2.5 py-0.75 rounded-[10px] bg-secondary-12 font-chakrapetch uppercase text-base sm:text-lg font-bold text-secondary-50">
                BIGTR
              </span>
            </div>
          </div>
        </div>

        {/* Buy Now -> gercek approve + buy */}
        <div className="mb-5">
          <button
            onClick={handleBuy}
            disabled={isBuying}
            className="aizon-btn w-full rounded-[18px] px-3 py-5 md:py-7.5 bg-primary font-chakrapetch uppercase text-[18px] leading-none font-bold text-btn-text disabled:opacity-60"
          >
            <span className="btn-inner">
              <span className="btn-normal-text">
                {isBuying ? "Processing..." : "Buy Now"}
              </span>
              <span className="btn-hover-text">
                {isBuying ? "Processing..." : "Buy Now"}
              </span>
            </span>
          </button>
        </div>

        {/* Kredi karti (thirdweb Pay) */}
        <div className="mb-4">
          <button
            onClick={handleCard}
            className="w-full rounded-[18px] px-3 py-5 md:py-7.5 bg-secondary-15 font-chakrapetch uppercase text-[18px] leading-none font-bold text-secondary hover:opacity-80 transition cursor-pointer text-center"
          >
            Pay with Credit Card
          </button>
        </div>

        {status && (
          <p className="font-chakrapetch text-sm text-secondary-80 mt-2">{status}</p>
        )}
      </div>
    </div>
  );
};

export default BuyCard;
