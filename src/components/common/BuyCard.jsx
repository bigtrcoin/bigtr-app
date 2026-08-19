import React, { useEffect, useState, useCallback } from "react";
import { FaCircle } from "react-icons/fa6";
import { useActiveAccount } from "thirdweb/react";
import { usePresale } from "../../hooks/usePresale";
import { PAY_TOKEN, STABLE_DECIMALS, TOKEN_DECIMALS } from "../../web3/presale";

// 1e18 olcekli bigint -> okunabilir sayi
const fromUnits = (v, dec = 18) => {
  if (v === undefined || v === null) return 0;
  return Number(v) / 10 ** dec;
};

const BuyCard = () => {
  const account = useActiveAccount();
  const {
    price,
    stageIndex,
    stagesCount,
    soldInStage,
    currentStage,
    remainingForSale,
    totalRaised,
    allocated,
    quote,
    buy,
    isBuying,
  } = usePresale();

  // Kontrat tek aktif odeme tokeni kabul eder (audit SDR duzeltmesi): USDT
  const [amount, setAmount] = useState("");
  const [tokensOut, setTokensOut] = useState(0n);
  const [status, setStatus] = useState("");

  const unitPrice = fromUnits(price, STABLE_DECIMALS); // 1 BIGTR = ? USD
  const raised = fromUnits(totalRaised, STABLE_DECIMALS);
  const myAllocation = fromUnits(allocated, TOKEN_DECIMALS);
  const remaining = fromUnits(remainingForSale, TOKEN_DECIMALS);

  // Aktif asama ilerlemesi
  const stageNo = stageIndex !== undefined ? Number(stageIndex) + 1 : null;
  const stageTotal = stagesCount !== undefined ? Number(stagesCount) : null;
  const stageCap = currentStage ? fromUnits(currentStage[1], TOKEN_DECIMALS) : 0;
  const stageSold = fromUnits(soldInStage, TOKEN_DECIMALS);
  const stagePct =
    stageCap > 0 ? Math.min(100, Number(((stageSold / stageCap) * 100).toFixed(2))) : 0;
  const soldOut =
    stageIndex !== undefined && stagesCount !== undefined && stageIndex >= stagesCount;

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
      await buy(PAY_TOKEN.address, amount);
      setStatus("Purchase successful. Your BIGTR allocation has been recorded.");
      setAmount("");
      setTokensOut(0n);
    } catch (e) {
      const msg = e?.message || "unknown error";
      // Kontrattaki slippage korumasi devreye girdiyse kullaniciya net anlat:
      // parasi cekilmedi, sadece fiyat degisti.
      if (msg.toLowerCase().includes("slippage")) {
        setStatus(
          "Price moved to the next stage while your transaction was pending. " +
            "No funds were taken. Please review the updated quote and try again."
        );
      } else {
        setStatus("Transaction failed: " + msg);
      }
    }
  }, [account, amount, buy]);

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
        {/* Asama ilerleme cubugu */}
        <div className="mb-5 sm:mb-9">
          <div className="flex items-center gap-4 flex-wrap justify-between mb-2">
            <p className="font-chakrapetch uppercase text-base font-bold text-secondary">
              {soldOut ? (
                <span className="text-primary">Presale Sold Out</span>
              ) : (
                <>
                  <span className="text-secondary-80">Stage:</span>{" "}
                  {stageNo && stageTotal ? `${stageNo} / ${stageTotal}` : "—"}
                </>
              )}
            </p>
            <p className="font-chakrapetch uppercase text-base font-bold text-secondary">
              <span className="text-secondary-80">Raised:</span>{" "}
              {raised.toLocaleString()} USD
            </p>
          </div>
          {!soldOut && stageCap > 0 && (
            <>
              <div className="w-full h-3 rounded-full bg-secondary-8 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${stagePct}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="font-chakrapetch text-sm text-secondary-80">
                  {stageSold.toLocaleString()} / {stageCap.toLocaleString()} BIGTR in
                  this stage ({stagePct}%)
                </p>
                <p className="font-chakrapetch text-sm text-secondary-80">
                  Remaining total: {remaining.toLocaleString()} BIGTR
                </p>
              </div>
            </>
          )}
        </div>

        {/* Odeme tokeni: kontrat ayni anda tek stablecoin kabul eder */}
        <div className="mb-5 sm:mb-9">
          <h4 className="block mb-2 font-chakrapetch uppercase text-base font-bold text-secondary">
            Payment Method
          </h4>
          <div className="inline-flex px-4 py-3 rounded-[12px] font-chakrapetch uppercase font-bold border-2 border-primary text-primary">
            {PAY_TOKEN.symbol} (BNB Chain)
          </div>
        </div>

        {/* Tutar */}
        <div className="mb-5 sm:mb-10">
          <label className="block mb-2 font-chakrapetch uppercase text-base font-bold text-secondary">
            Pay Amount ({PAY_TOKEN.symbol})
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
                {PAY_TOKEN.symbol}
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
          <p className="mt-2 font-chakrapetch text-sm text-secondary-80">
            Tokens are allocated on-chain now and distributed at listing according to
            the 50% / 25% / 25% vesting schedule.
          </p>
        </div>

        {/* Buy Now -> taze quote + slippage korumali approve + buy */}
        <div className="mb-5">
          <button
            onClick={handleBuy}
            disabled={isBuying || soldOut}
            className="aizon-btn w-full rounded-[18px] px-3 py-5 md:py-7.5 bg-primary font-chakrapetch uppercase text-[18px] leading-none font-bold text-btn-text disabled:opacity-60"
          >
            <span className="btn-inner">
              <span className="btn-normal-text">
                {soldOut ? "Sold Out" : isBuying ? "Processing..." : "Buy Now"}
              </span>
              <span className="btn-hover-text">
                {soldOut ? "Sold Out" : isBuying ? "Processing..." : "Buy Now"}
              </span>
            </span>
          </button>
        </div>

        {/* Kredi karti (thirdweb Pay) - aktivasyon onayina kadar gizli */}
        {import.meta.env.VITE_CARD_PAY_ENABLED === "true" && (
          <div className="mb-4">
            <button
              onClick={handleCard}
              className="w-full rounded-[18px] px-3 py-5 md:py-7.5 bg-secondary-15 font-chakrapetch uppercase text-[18px] leading-none font-bold text-secondary hover:opacity-80 transition cursor-pointer text-center"
            >
              Pay with Credit Card
            </button>
          </div>
        )}
        {status && (
          <p className="font-chakrapetch text-sm text-secondary-80 mt-2">{status}</p>
        )}
      </div>
    </div>
  );
};

export default BuyCard;
