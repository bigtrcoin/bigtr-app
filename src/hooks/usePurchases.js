// src/hooks/usePurchases.js
// Live purchase list for the transaction/leaderboard views.
// Primary source: thirdweb Insight queried directly from the browser (events
// and transactions merged, gaps filled from receipts) — the
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

const INSIGHT = "https://insight.thirdweb.com/v1";
const INSIGHT_HEADERS = () => ({ "x-client-id": CLIENT_ID });

// Public BSC endpoints used only to read receipts of purchases that the
// Insight event index is missing (see viaInsight).
const RECEIPT_RPCS = [
  "https://bsc-dataseed.bnbchain.org",
  "https://bsc-dataseed1.binance.org",
  "https://bsc-rpc.publicnode.com",
];

// Purchased logs of a buy() tx, read straight from its receipt. Confirmed
// receipts never change, so results are kept in localStorage.
const RECEIPT_CACHE_KEY = "bigtr_purchase_receipts_v1";
function loadReceiptCache() {
  try {
    return JSON.parse(localStorage.getItem(RECEIPT_CACHE_KEY) || "{}") || {};
  } catch {
    return {};
  }
}
function saveReceiptCache(cache) {
  try {
    localStorage.setItem(RECEIPT_CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* storage unavailable: receipts are simply fetched again next time */
  }
}

async function purchaseLogsFromReceipt(txHash) {
  for (const url of RECEIPT_RPCS) {
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getTransactionReceipt",
          params: [txHash],
        }),
      });
      const j = await r.json();
      if (!j || !j.result) continue;
      return (j.result.logs || [])
        .filter(
          (l) =>
            l.address &&
            l.address.toLowerCase() === PRESALE.toLowerCase() &&
            l.topics &&
            l.topics[0] === TOPIC0
        )
        .map((l) => ({ topics: l.topics, data: l.data }));
    } catch {
      /* try the next endpoint */
    }
  }
  return null; // unknown for now; retried on the next refresh
}

async function insightPages(path, extra) {
  const rows = [];
  for (let page = 0; page < 20; page++) {
    const url =
      `${INSIGHT}/${path}/${PRESALE}` +
      `?chain=${CHAIN_ID}&limit=500&page=${page}` +
      `&filter_block_number_gte=${DEPLOY_BLOCK}` +
      extra +
      `&sort_by=block_number&sort_order=desc`;
    const r = await fetch(url, { headers: INSIGHT_HEADERS() });
    if (!r.ok) throw new Error("insight http " + r.status);
    const j = await r.json();
    const data = j.data || [];
    rows.push(...data);
    if (data.length < 500) break;
  }
  return rows;
}

// Insight's event index is incomplete for this contract: some confirmed
// purchases are missing from /events but present in /transactions (and the
// other way round). Both lists are merged; a buy tx that has no indexed event
// is decoded from its on-chain receipt, so every purchase shows up.
async function viaInsight() {
  if (!CLIENT_ID || CLIENT_ID === "MISSING_CLIENT_ID") throw new Error("no client id");

  const [evRes, txRes] = await Promise.allSettled([
    insightPages("events", `&filter_topic_0=${TOPIC0}`),
    insightPages("transactions", ""),
  ]);
  if (evRes.status === "rejected" && txRes.status === "rejected") throw evRes.reason;

  const byTx = new Map();
  for (const e of evRes.status === "fulfilled" ? evRes.value : []) {
    if (!e.topics || e.topics[0] !== TOPIC0) continue;
    const p = parseEvent(e);
    byTx.set(`${p.tx.toLowerCase()}:${e.log_index ?? 0}`, p);
  }
  const seenTx = new Set([...byTx.values()].map((p) => p.tx.toLowerCase()));

  const missing = (txRes.status === "fulfilled" ? txRes.value : []).filter(
    (t) => Number(t.status) === 1 && t.hash && !seenTx.has(t.hash.toLowerCase())
  );
  if (missing.length) {
    const cache = loadReceiptCache();
    let dirty = false;
    await Promise.all(
      missing.map(async (t) => {
        const key = t.hash.toLowerCase();
        let logs = cache[key];
        if (!logs) {
          logs = await purchaseLogsFromReceipt(t.hash);
          if (!logs) return;
          cache[key] = logs;
          dirty = true;
        }
        logs.forEach((l, i) => {
          const p = parseEvent({
            ...l,
            transaction_hash: t.hash,
            block_number: t.block_number,
            block_timestamp: t.block_timestamp,
          });
          byTx.set(`${key}:r${i}`, p);
        });
      })
    );
    if (dirty) saveReceiptCache(cache);
  }
  return [...byTx.values()];
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
