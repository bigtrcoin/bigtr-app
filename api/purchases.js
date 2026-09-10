// api/purchases.js
// Reads BigTrPresale "Purchased" events and returns normalized JSON.
// NOTE: the app now reads Insight directly from the browser (usePurchases.js),
// because the domain-restricted client ID does not authenticate server-side.
// This endpoint remains as a fallback and works fully once THIRDWEB_SECRET_KEY
// (preferred) or BSCSCAN_API_KEY is set in Vercel.
// Source priority:
//   1) thirdweb Insight (indexed)      - THIRDWEB_SECRET_KEY (or client ID, browser-only)
//   2) Etherscan V2 / BscScan API      - BSCSCAN_API_KEY (if present)
//   3) Raw chunked RPC scan            - BSC_RPC_URL (last resort; public RPCs
//      cap ranges hard, so this rarely covers the full history)
// Response is served with a 60 s CDN cache.

const PRESALE = (process.env.VITE_PRESALE_ADDRESS || "0x9d123D69300F2230d3D5eD54E1f3F9c457d54946");
const DEPLOY_BLOCK = parseInt(process.env.PRESALE_DEPLOY_BLOCK || "115495998", 10);
const TOPIC0 = "0xd67ebb720e4f9789f32f7cb2c71ad8e5bf9e6aa4793028ee0bad71ecb43db4ae"; // Purchased(...)
const RPC = process.env.BSC_RPC_URL || "https://bsc-dataseed.bnbchain.org";

const toNum = (hex) => Number(BigInt(hex)) / 1e18;

function parseData(dataHex, topics) {
  const d = (dataHex || "0x").slice(2);
  return {
    buyer: "0x" + topics[1].slice(26),
    paid: toNum("0x" + d.slice(0, 64)),
    tokens: toNum("0x" + d.slice(64, 128)),
    cumulative: toNum("0x" + d.slice(128, 192)),
    endStage: parseInt(d.slice(192, 256) || "0", 16),
  };
}

// --- 1) thirdweb Insight ---
// Insight rejects unbounded queries ("query too broad"): the block and topic
// filters are mandatory. Auth: x-secret-key works anywhere; x-client-id only
// from an allowlisted browser origin.
async function viaInsight(clientId, secretKey) {
  const headers = secretKey
    ? { "x-secret-key": secretKey }
    : { "x-client-id": clientId };
  const out = [];
  for (let page = 0; page < 20; page++) {
    const url = `https://insight.thirdweb.com/v1/events/${PRESALE}` +
      `?chain=56&limit=500&page=${page}` +
      `&filter_block_number_gte=${DEPLOY_BLOCK}` +
      `&filter_topic_0=${TOPIC0}` +
      `&sort_by=block_number&sort_order=desc`;
    const r = await fetch(url, { headers });
    if (!r.ok) throw new Error("insight http " + r.status);
    const j = await r.json();
    const rows = j.data || [];
    for (const e of rows) {
      if (!e.topics || e.topics[0] !== TOPIC0) continue;
      out.push({
        ...parseData(e.data, e.topics),
        tx: e.transaction_hash,
        block: Number(e.block_number),
        ts: Number(e.block_timestamp) || null,
      });
    }
    if (rows.length < 500) break;
  }
  return out;
}

// --- 2) Etherscan V2 (BSC = chainid 56) ---
async function viaEtherscan(key) {
  const out = [];
  let page = 1;
  while (page <= 10) {
    const url = `https://api.etherscan.io/v2/api?chainid=56&module=logs&action=getLogs` +
      `&address=${PRESALE}&fromBlock=${DEPLOY_BLOCK}&toBlock=latest&topic0=${TOPIC0}` +
      `&page=${page}&offset=1000&apikey=${key}`;
    const j = await fetch(url).then((r) => r.json());
    if (j.status !== "1" || !Array.isArray(j.result) || j.result.length === 0) break;
    for (const l of j.result) {
      out.push({
        ...parseData(l.data, l.topics),
        tx: l.transactionHash,
        block: parseInt(l.blockNumber, 16),
        ts: l.timeStamp ? parseInt(l.timeStamp, 16) : null,
      });
    }
    if (j.result.length < 1000) break;
    page++;
    await new Promise((r) => setTimeout(r, 250));
  }
  return out;
}

// --- 3) Raw RPC (last resort) ---
async function rpcCall(method, params) {
  const r = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error.message || "rpc error");
  return j.result;
}

async function viaRpc() {
  const latest = parseInt(await rpcCall("eth_blockNumber", []), 16);
  const logs = [];
  const STEP = 4500; // public BSC nodes cap eth_getLogs around 5k blocks
  // A full-history scan needs (latest-deploy)/STEP requests; past ~200 chunks
  // it cannot finish inside the serverless time budget, so give up early.
  if ((latest - DEPLOY_BLOCK) / STEP > 200) return [];
  for (let from = DEPLOY_BLOCK; from <= latest; from += STEP) {
    const to = Math.min(from + STEP - 1, latest);
    try {
      const res = await rpcCall("eth_getLogs", [{
        address: PRESALE,
        fromBlock: "0x" + from.toString(16),
        toBlock: "0x" + to.toString(16),
        topics: [TOPIC0],
      }]);
      for (const l of res) {
        logs.push({
          ...parseData(l.data, l.topics),
          tx: l.transactionHash,
          block: parseInt(l.blockNumber, 16),
          ts: null,
        });
      }
    } catch (e) { /* swallow chunk errors */ }
  }
  return logs;
}

export default async function handler(req, res) {
  try {
    let purchases = [];
    let source = "none";
    const cid = process.env.VITE_THIRDWEB_CLIENT_ID;
    const secret = process.env.THIRDWEB_SECRET_KEY;
    const key = process.env.BSCSCAN_API_KEY;

    if (secret || (cid && cid !== "MISSING_CLIENT_ID")) {
      try { purchases = await viaInsight(cid, secret); source = "insight"; } catch (e) { /* source down */ }
    }
    if (purchases.length === 0 && key) {
      try { const r = await viaEtherscan(key); if (r.length) { purchases = r; source = "etherscan"; } } catch (e) { /* down */ }
    }
    if (purchases.length === 0 && source === "none") {
      try { const r = await viaRpc(); if (r.length) { purchases = r; source = "rpc"; } } catch (e) { /* down */ }
    }

    purchases.sort((a, b) => b.block - a.block);
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json({ updatedAt: Date.now(), source, count: purchases.length, purchases });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
}
