import React, { useEffect, useMemo, useState } from "react";
import { useActiveWallet, useWalletBalance } from "thirdweb/react";
import { QRCodeSVG } from "qrcode.react";
import { getContract, prepareContractCall, sendTransaction, toUnits } from "thirdweb";
import { PAY_TOKEN, STABLE_DECIMALS, client, presaleChain } from "../../web3/presale";
import { SMART_ACCOUNT_FOR_ALL, isSponsoredWallet } from "../../web3/wallets";

// Minimum native balance we require from self-custody wallets before letting
// the user try to buy. Two transactions (approve + buy) cost well under
// 0.001 BNB on BNB Chain at current gas prices; the guidance text asks for a
// little headroom. Email/social sign-in wallets skip this: their gas is sponsored.
export const MIN_GAS_BNB = 0.001;
export const RECOMMENDED_GAS_BNB = 0.003;

// Turn raw RPC / wallet errors into something a first-time buyer can act on.
export function friendlyTxError(raw) {
  const msg = String(raw || "unknown error");
  const m = msg.toLowerCase();
  if (m.includes("paymaster") || m.includes("sponsor") || /\baa\d\d\b/.test(m)) {
    return "The network-fee sponsorship could not be applied right now. Please try again in a moment; if it keeps failing, contact support. No funds were taken.";
  }
  if (m.includes("insufficient funds for gas") || (m.includes("insufficient funds") && !m.includes("usdt"))) {
    return (
      "Your wallet has no BNB to pay the network fee, so the transaction could not start. " +
      `Send at least ${RECOMMENDED_GAS_BNB} BNB to your wallet address (shown above) and try again. No funds were taken.`
    );
  }
  if (m.includes("user rejected") || m.includes("user denied") || m.includes("rejected the request") || m.includes("user closed")) {
    return "You cancelled the request in your wallet. Nothing was charged.";
  }
  if (m.includes("transfer amount exceeds balance") || m.includes("exceeds balance") || m.includes("insufficient balance")) {
    return "There is not enough USDT in your wallet for this amount. Add USDT and try again.";
  }
  if (m.includes("insufficient allowance")) {
    return "USDT approval is missing. Confirm the first request (Approve USDT) in your wallet, then confirm the purchase.";
  }
  if (m.includes("chain") && (m.includes("mismatch") || m.includes("wrong") || m.includes("unsupported"))) {
    return "Your wallet is on a different network. Switch it to BNB Smart Chain and try again.";
  }
  if (m.includes("slippage")) {
    return (
      "Price moved to the next stage while your transaction was pending. " +
      "No funds were taken. Please review the updated quote and try again."
    );
  }
  return "Transaction failed: " + msg;
}

const fmt = (n, digits = 4) =>
  Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: digits });

const DepositAddress = ({ address }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the address is still selectable */
    }
  };
  return (
    <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:items-start">
      <div className="shrink-0 self-start rounded-[12px] bg-white p-2">
        <QRCodeSVG value={address} size={112} bgColor="#ffffff" fgColor="#000000" level="M" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-chakrapetch text-[12px] uppercase tracking-wide text-secondary-70 mb-1">
          Your deposit address · BNB Smart Chain (BEP-20)
        </p>
        <code
          className="block break-all rounded-[10px] px-3 py-2.5 bg-secondary-8 font-mono text-[13px] text-secondary select-all"
          title={address}
        >
          {address}
        </code>
        <button
          type="button"
          onClick={copy}
          className="mt-2 rounded-[10px] px-3.5 py-2 bg-primary font-chakrapetch uppercase text-[12px] font-bold text-btn-text hover:opacity-90 transition"
        >
          {copied ? "Copied" : "Copy address"}
        </button>
      </div>
    </div>
  );
};

// Buyers who signed in with an existing wallet usually already hold their
// USDT there, while purchases run from the smart account. This moves that
// USDT across in one transfer (signed by, and paid for from, the connected
// wallet) so they do not have to do it by hand on an explorer.
const MoveUsdtPanel = ({ wallet, signerUsdt, signerBnb, target, want, onDone }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Default to what this purchase needs, never the whole balance: the rest of
  // the buyer's USDT stays in their own wallet unless they choose otherwise.
  const suggested = want > 0 ? Math.min(want, signerUsdt) : signerUsdt;
  const [value, setValue] = useState(String(suggested));
  useEffect(() => {
    if (!busy && !done) setValue(String(suggested));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggested]);

  const amount = Number(value);
  const lowGas = signerBnb < MIN_GAS_BNB;
  const invalid = !(amount > 0) || amount > signerUsdt;

  const move = async () => {
    setError("");
    setBusy(true);
    try {
      const admin = wallet?.getAdminAccount?.();
      if (!admin) throw new Error("Connected wallet is unavailable");
      const token = getContract({ client, chain: presaleChain, address: PAY_TOKEN.address });
      const tx = prepareContractCall({
        contract: token,
        method: "function transfer(address,uint256) returns (bool)",
        params: [target, toUnits(String(amount), STABLE_DECIMALS)],
      });
      await sendTransaction({ account: admin, transaction: tx });
      setDone(true);
      if (onDone) onDone();
    } catch (e) {
      setError(friendlyTxError(e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="mt-3 rounded-[14px] border px-3.5 py-3"
      style={{
        borderColor: "color-mix(in srgb, var(--color-primary) 45%, transparent)",
        background: "color-mix(in srgb, var(--color-primary) 6%, transparent)",
      }}
    >
      <p className="font-chakrapetch text-[13px] text-secondary-80">
        The wallet you signed in with holds <span className="text-secondary font-bold">{fmt(signerUsdt, 2)} USDT</span>.
        Move as much as you want to spend to your BigTR address above — the rest stays in your own wallet.
      </p>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-[10px] bg-secondary-8 px-3 py-2">
          <input
            id="bigtr-move-usdt"
            type="number"
            min="0"
            step="0.01"
            value={value}
            disabled={busy}
            onChange={(e) => setValue(e.target.value)}
            className="w-28 bg-transparent font-chakrapetch text-[14px] font-bold text-secondary outline-none"
          />
          <span className="font-chakrapetch text-[12px] text-secondary-70">USDT</span>
        </div>
        <button
          type="button"
          onClick={() => setValue(String(signerUsdt))}
          disabled={busy}
          className="rounded-[10px] px-3 py-2 bg-secondary-8 font-chakrapetch uppercase text-[12px] font-bold text-secondary hover:opacity-80 transition disabled:opacity-40"
        >
          Max
        </button>
        <button
          type="button"
          onClick={move}
          disabled={busy || lowGas || invalid}
          className="rounded-[10px] px-3.5 py-2 bg-primary font-chakrapetch uppercase text-[12px] font-bold text-btn-text hover:opacity-90 transition disabled:opacity-40"
        >
          {busy ? "Confirm in your wallet..." : `Move ${fmt(amount > 0 ? amount : 0, 2)} USDT`}
        </button>
      </div>

      <p className="mt-2 font-chakrapetch text-[12px] text-secondary-70">
        {lowGas
          ? `This one transfer is sent by your own wallet, so it needs a little BNB for the fee. Your wallet has ${fmt(signerBnb, 5)} BNB; send at least ${RECOMMENDED_GAS_BNB} BNB to it, or withdraw USDT from an exchange straight to the address above instead — that way no BNB is needed at all.`
          : "This single transfer is signed by your own wallet and costs a few cents of BNB. Every purchase after it is free of network fees."}
      </p>
      {invalid && !busy && (
        <p className="mt-1 font-chakrapetch text-[12px] text-[#F2B43C]">
          Enter an amount between 0 and {fmt(signerUsdt, 2)} USDT.
        </p>
      )}
      {done && !busy && !error && (
        <p className="mt-1 font-chakrapetch text-[12px] text-secondary-80">
          Transfer sent. This box updates by itself once it is confirmed.
        </p>
      )}
      {error && <p className="mt-2 font-chakrapetch text-[12px] text-[#F2B43C]">{error}</p>}
    </div>
  );
};

/**
 * Reads the connected wallet's USDT (and, for self-custody wallets, BNB)
 * balance and tells the user, before they press Buy, whether the purchase can
 * go through and how to fix it when it cannot. Reports readiness to the parent
 * via onChange so the Buy button can be disabled with an explanatory label.
 */
const WalletReadiness = ({ account, amount, onChange }) => {
  const address = account?.address;
  const enabled = Boolean(address);
  const wallet = useActiveWallet();
  const sponsored = isSponsoredWallet(wallet);
  const refetch = { refetchInterval: 15000, enabled };

  const bnbQ = useWalletBalance({ client, chain: presaleChain, address }, refetch);
  const usdtQ = useWalletBalance(
    { client, chain: presaleChain, address, tokenAddress: PAY_TOKEN.address },
    refetch
  );

  // The wallet that signs for the smart account (MetaMask & co). Buyers often
  // already hold their USDT there, so it is read as well.
  let signerAddress = null;
  try {
    const admin = wallet?.getAdminAccount?.();
    if (admin?.address && admin.address.toLowerCase() !== (address || "").toLowerCase()) {
      signerAddress = admin.address;
    }
  } catch {
    signerAddress = null;
  }
  const signerEnabled = Boolean(signerAddress);
  const signerUsdtQ = useWalletBalance(
    { client, chain: presaleChain, address: signerAddress || undefined, tokenAddress: PAY_TOKEN.address },
    { refetchInterval: 15000, enabled: signerEnabled }
  );
  const signerBnbQ = useWalletBalance(
    { client, chain: presaleChain, address: signerAddress || undefined },
    { refetchInterval: 15000, enabled: signerEnabled }
  );
  const signerUsdt = Number(signerUsdtQ.data?.displayValue || 0);
  const signerBnb = Number(signerBnbQ.data?.displayValue || 0);

  const bnb = Number(bnbQ.data?.displayValue || 0);
  const usdt = Number(usdtQ.data?.displayValue || 0);
  const loading = enabled && (usdtQ.isLoading || (!sponsored && bnbQ.isLoading));
  const want = Number(amount) > 0 ? Number(amount) : 0;

  const needBnb = !loading && !sponsored && bnb < MIN_GAS_BNB;
  const needUsdt = !loading && (want > 0 ? usdt < want : usdt <= 0);
  const missingUsdt = want > 0 ? Math.max(0, want - usdt) : 0;

  const state = useMemo(() => {
    if (!enabled) return { ok: false, label: "Connect Wallet", reason: "Please sign in or connect your wallet first." };
    if (loading) return { ok: false, label: "Checking balance...", reason: "Checking your wallet balance, one moment." };
    if (needUsdt && needBnb)
      return { ok: false, label: "Add USDT & BNB to continue", reason: "Your wallet needs USDT for the purchase and a little BNB for network fees. See the steps above." };
    if (needUsdt)
      return { ok: false, label: "Add USDT to continue", reason: "Not enough USDT in your wallet for this amount. See the steps above." };
    if (needBnb)
      return { ok: false, label: "Add BNB for fees to continue", reason: `Your wallet has no BNB for network fees. Send at least ${RECOMMENDED_GAS_BNB} BNB to it first.` };
    return { ok: true, label: "Buy Now", reason: "" };
  }, [enabled, loading, needUsdt, needBnb]);

  useEffect(() => {
    if (onChange) onChange(state);
  }, [state, onChange]);

  if (!enabled) return null;

  const boxStyle = state.ok
    ? { borderColor: "color-mix(in srgb, var(--color-primary) 55%, transparent)", background: "color-mix(in srgb, var(--color-primary) 8%, transparent)" }
    : { borderColor: "#F2B43C", background: "rgba(242, 180, 60, 0.10)" };

  return (
    <div className="mb-5 rounded-[18px] border-2 px-4 sm:px-5 py-4" style={boxStyle}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h4 className="font-chakrapetch uppercase text-sm font-bold text-secondary">
          {loading ? "Checking your wallet..." : state.ok ? "Wallet ready" : "Add funds to continue"}
        </h4>
        {!loading && (
          <p className="font-chakrapetch text-[13px] text-secondary-80">
            <span className={needUsdt ? "text-[#F2B43C] font-bold" : "text-secondary font-bold"}>{fmt(usdt, 2)} USDT</span>
            {sponsored ? (
              <> · <span className="text-secondary font-bold">network fees covered by BigTR</span></>
            ) : (
              <> · <span className={needBnb ? "text-[#F2B43C] font-bold" : "text-secondary font-bold"}>{fmt(bnb, 5)} BNB</span></>
            )}
          </p>
        )}
      </div>

      {!loading && state.ok && (
        <p className="mt-2 font-chakrapetch text-[13px] text-secondary-80">
          {sponsored
            ? "One confirmation and you are done — BigTR pays the network fee for you."
            : <>Buying takes two confirmations in your wallet: first <b>Approve USDT</b>, then <b>Buy</b>. Network fees are paid in BNB.</>}
        </p>
      )}

      {!loading && !state.ok && (
        <div className="mt-3 font-chakrapetch text-[13px] text-secondary-80 leading-relaxed">
          {needUsdt && (
            <p className="mb-1.5">
              <span className="text-[#F2B43C] font-bold">USDT:</span>{" "}
              {usdt <= 0
                ? "this wallet has no USDT yet."
                : `you have ${fmt(usdt, 2)} USDT but this purchase needs ${fmt(want, 2)} USDT (${fmt(missingUsdt, 2)} more).`}
            </p>
          )}
          {needBnb && (
            <p className="mb-1.5">
              <span className="text-[#F2B43C] font-bold">BNB:</span>{" "}
              {bnb <= 0 ? "this wallet has no BNB." : `you have ${fmt(bnb, 5)} BNB, which is not enough.`}{" "}
              Every transaction on BNB Chain pays a small network fee in BNB — keep at least {RECOMMENDED_GAS_BNB} BNB (about a dollar).
            </p>
          )}
          {sponsored && (
            <p className="mb-1.5">
              <span className="text-secondary font-bold">Network fees:</span> covered by BigTR — you only need USDT.
            </p>
          )}

          <p className="mt-3 mb-1 font-bold text-secondary uppercase text-[12px] tracking-wide">How to add funds</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              Buy {needUsdt ? "USDT" : ""}{needUsdt && needBnb ? " and " : ""}{needBnb ? "a little BNB" : ""} on any major crypto exchange (Binance, OKX, Bybit).
            </li>
            <li>
              Withdraw to the address below — scan the QR code or copy it — and choose the <b>BNB Smart Chain (BEP-20)</b> network, not Ethereum or Tron.
            </li>
            <li>Come back here; this box updates by itself once the funds arrive, then press Buy Now.</li>
          </ol>
          <DepositAddress address={address} />
          {needUsdt && signerUsdt > 0 && (
            <MoveUsdtPanel
              wallet={wallet}
              signerUsdt={signerUsdt}
              signerBnb={signerBnb}
              target={address}
              want={want}
              onDone={() => {
                usdtQ.refetch?.();
                signerUsdtQ.refetch?.();
              }}
            />
          )}
          <p className="mt-3 text-[12px] text-secondary-70">
            {SMART_ACCOUNT_FOR_ALL
              ? "This is your BigTR pre-sale address. USDT held anywhere else - including in the wallet you signed in with - has to be sent here first."
              : "Already have USDT in another wallet? Use the wallet menu at the top right to disconnect and connect that wallet instead."}
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletReadiness;
