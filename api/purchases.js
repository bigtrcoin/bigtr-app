// api/purchases.js
// BigTrPresale "Purchased" olaylarini okuyup normalize JSON dondurur.
// Oncelik: BSCSCAN_API_KEY varsa BscScan API (tam gecmis, hizli).
// Yoksa: dogrudan RPC uzerinden parcali eth_getLogs taramasi (anahtarsiz calisir).
// Yanit 60 sn CDN onbellegiyle servis edilir; frontend surekli RPC dovmez.

const PRESALE = (process.env.VITE_PRESALE_ADDRESS || "0x9d123D69300F2230d3D5eD54E1f3F9c457d54946").toLowerCase();
const DEPLOY_BLOCK = parseInt(process.env.PRESALE_DEPLOY_BLOCK || "115521559", 10);
const TOPIC0 = "0xd67ebb720e4f9789f32f7cb2c71ad8e5bf9e6aa4793028ee0bad71ecb43db4ae"; // Purchased(address,address,uint256,uint256,uint256,uint256)
const RPC = process.env.BSC_RPC_URL || "https://bsc-rpc.publicnode.com";
const BSCSCAN = "https://api.bscscan.com/api";

const toNum = (hex) => Number(BigInt(hex)) / 1e18;

function parseLog(l) {
  const d = (l.data || "0x").slice(2);
  return {
    buyer: "0x" + l.topics[1].slice(26),
    paid: toNum("0x" + d.slice(0, 64)),
    tokens: toNum("0x" + d.slice(64, 128)),
    cumulative: toNum("0x" + d.slice(128, 192)),
    endStage: parseInt(d.slice(192, 256) || "0", 16),
    tx: l.transactionHash,
    block: parseInt(l.blockNumber, 16),
    ts: l.timeStamp ? parseInt(l.timeStamp, 16) : null,
  };
}

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

async function viaBscScan(key) {
  let page = 1;
  const out = [];
  while (page <= 10) {
    const url = `${BSCSCAN}?module=logs&action=getLogs&address=${PRESALE}` +
      `&fromBlock=${DEPLOY_BLOCK}&toBlock=latest&topic0=${TOPIC0}` +
      `&page=${page}&offset=1000&apikey=${key}`;
    const j = await fetch(url).then((r) => r.json());
    if (j.status !== "1" || !Array.isArray(j.result) || j.result.length === 0) break;
    out.push(...j.result.map(parseLog));
    if (j.result.length < 1000) break;
    page++;
    await new Promise((r) => setTimeout(r, 250));
  }
  return out;
}

async function viaRpc() {
  const latest = parseInt(await rpcCall("eth_blockNumber", []), 16);
  const logs = [];
  const STEP = 45000;
  for (let from = DEPLOY_BLOCK; from <= latest; from += STEP) {
    const to = Math.min(from + STEP - 1, latest);
    try {
      const res = await rpcCall("eth_getLogs", [{
        address: PRESALE,
        fromBlock: "0x" + from.toString(16),
        toBlock: "0x" + to.toString(16),
        topics: [TOPIC0],
      }]);
      logs.push(...res.map(parseLog));
    } catch (e) { /* parca hatasi yut */ }
  }
  const need = logs.slice(-300);
  const blocks = [...new Set(need.map((l) => l.block))];
  const tsMap = {};
  for (const b of blocks) {
    try {
      const blk = await rpcCall("eth_getBlockByNumber", ["0x" + b.toString(16), false]);
      tsMap[b] = parseInt(blk.timestamp, 16);
    } catch (e) { /* atla */ }
  }
  logs.forEach((l) => { l.ts = tsMap[l.block] || null; });
  return logs;
}

export default async function handler(req, res) {
  try {
    const key = process.env.BSCSCAN_API_KEY;
    let purchases = key ? await viaBscScan(key) : await viaRpc();
    if (key && purchases.length === 0) {
      try { purchases = await viaRpc(); } catch (e) { /* bos */ }
    }
    purchases.sort((a, b) => b.block - a.block);
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json({ updatedAt: Date.now(), count: purchases.length, purchases });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
}
