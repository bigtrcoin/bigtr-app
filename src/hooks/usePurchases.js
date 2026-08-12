// src/hooks/usePurchases.js
// /api/purchases ucundan canli alim listesini ceker; bilesenlerin bekledigi
// satir sekillerine donusturur. 60 sn'de bir kendini yeniler.
import { useEffect, useMemo, useState } from "react";

const EXPLORER_TX = "https://bscscan.com/tx/";

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
        const r = await fetch("/api/purchases");
        const j = await r.json();
        if (alive && Array.isArray(j.purchases)) {
          setRaw(j.purchases);
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

  return { transactions, leaderboard, myTransactions, loading, error };
}
