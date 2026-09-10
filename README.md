# bigtr-app

Presale dApp for BigTrCoin (BIGTR) — [app.bigtrcoin.com](https://app.bigtrcoin.com)

React + Vite + Tailwind CSS single-page app on BNB Smart Chain. Wallet
connection and contract calls go through the thirdweb SDK; purchases are made
in USDT (BEP-20) via the audited presale contract.

## Development

```bash
npm install
npm run dev      # local dev server (Vite)
npm run build    # production build check before pushing
```

## Deployment

Hosted on Vercel; a push to `main` deploys automatically. `VITE_`-prefixed
environment variables are embedded at build time — after changing one in
Vercel, redeploy without cache (or push a new commit).
