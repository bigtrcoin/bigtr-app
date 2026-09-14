// src/hooks/usePurchases.js
// Live purchase list for the transaction/leaderboard views.
// Primary source: thirdweb Insight queried directly from the browser — the
// client ID is domain-restricted, so it authenticates from app.bigtrcoin.com
// but NOT from a server (which is why /api/purchases used to come back empty).
// Fallback: /api/purchases (works once a server-side key is configured there).
// Refreshes every 60 s.
import { useEffect, useMemo, useState } from "react";

const EXPLORER_TX = "https://bscscan.com/tx/";

// Purchased(...) event topic + earliest block to scan (mainnet deploy block).
// Insight rejects unbounded queries ("query too broad"), so the block filter
// is required, not an optimization.
const TOPIC0 = "0xd67ebb720e4f9789f32f7cb2c71ad8e5bf9e6aa4793028ee0bad71ecb43db4ae";
const DEPLOY_BLOCK = Number(import.meta.env.VITE_PRESALE_DEPLOY_BLOCK || 115495998);
const PRESALE = import.meta.env.VITE_PRESALE_ADDRESS || "0x9d123D69300F2230d3D5eD54E1f3F9c457d54946";
const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 56);
const CLIENT_ID = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

const toNum = (hex) => Number(BigInt(hex)) / 1e18;

// Decode a raw Purchased log: buyer indexed in topics[1], then
// (paid, tokens, cumulative, endStage) packed in data.
function parseEvent(e) {
  const d = (e.data || "0x").slice(2);
  return {
    buyer: "0x" + e.topics[1].slice(26),
    paid: toNum("0x" + d.slice(0, 64)),
    tokens: toNum("0x" + d.slice(64, 128)),
    cumulative: toNum("0x" + d.slice(128, 192)),
    endStage: parseInt(d.slice(192, 256) || "0", 16),
    tx: e.transaction_hash,
    block: Number(e.block_number),
    ts: Number(e.block_timestamp) || null,
  };
}

async function viaInsight() {
  if (!CLIENT_ID || CLIENT_ID === "MISSING_CLIENT_ID") throw new Error("no client id");
  const out = [];
  for (let page = 0; page < 20; page++) {
    const url =
      `https://insight.thirdweb.com/v1/events/${PRESALE}` +
      `?chain=${CHAIN_ID}&limit=500&page=${page}` +
      `&filter_block_number_gte=${DEPLOY_BLOCK}` +
      `&filter_topic_0=${TOPIC0}` +
      `&sort_by=block_number&sort_order=desc`;
    const r = await fetch(url, { headers: { "x-client-id": CLIENT_ID } });
    if (!r.ok) throw new Error("insight http " + r.status);
    const j = await r.json();
    const rows = j.data || [];
    for (const e of rows) {
      if (!e.topics || e.topics[0] !== TOPIC0) continue;
      out.push(parseEvent(e));
    }
    if (rows.length < 500) break;
  }
  return out;
}

async function viaApi() {
  const r = await fetch("/api/purchases");
  const j = await r.json();
  return Array.isArray(j.purchases) ? j.purchases : [];
}

function fmtDate(ts) {
  if (!ts) return { date: "-", time: "" };
  const d = new Date(ts * 1000);
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

const fmtAmount = (n) =>
  Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });

export default function usePurchases() {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        let list;
        try {
          list = await viaInsight();
        } catch {
          list = await viaApi();
        }
        if (alive && Array.isArray(list)) {
          list.sort((a, b) => b.block - a.block);
          setRaw(list);
          setError(null);
        }
      } catch (e) {
        if (alive) setError(String(e));
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 60000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  const transactions = useMemo(() => raw.map((p) => {
    const { date, time } = fmtDate(p.ts);
    return {
      walletAddress: p.buyer,
      payUsdAmount: fmtAmount(p.paid),
      buyAmount: fmtAmount(p.tokens),
      date,
      time,
      status: "Success",
      txLink: EXPLORER_TX + p.tx,
      endStage: (p.endStage ?? 0) + 1,
    };
  }), [raw]);

  const leaderboard = useMemo(() => {
    const agg = {};
    for (const p of raw) {
      const k = p.buyer.toLowerCase();
      if (!agg[k]) agg[k] = { walletAddress: p.buyer, total: 0 };
      agg[k].total += p.tokens;
    }
    return Object.values(agg)
      .sort((a, b) => b.total - a.total)
      .map((x) => ({ walletAddress: x.walletAddress, totalAmount: Math.round(x.total) }));
  }, [raw]);

  const myTransactions = (address) => {
    if (!address) return [];
    const a = address.toLowerCase();
    return transactions.filter((t) => t.walletAddress.toLowerCase() === a);
  };

  // Numeric totals for one wallet: USDT actually paid and BIGTR bought.
  // "paid" is the real investment figure (sum of Purchased.paid), independent
  // of the current stage price.
  const myTotals = (address) => {
    if (!address) return { paid: 0, tokens: 0, count: 0 };
    const a = address.toLowerCase();
    let paid = 0, tokens = 0, count = 0;
    for (const p of raw) {
      if (p.buyer.toLowerCase() !== a) continue;
      paid += p.paid; tokens += p.tokens; count += 1;
    }
    return { paid, tokens, count };
  };

  return { transactions, leaderboard, myTransactions, myTotals, loading, error };
}
