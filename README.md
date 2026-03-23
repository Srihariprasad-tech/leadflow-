# LeadFlow AI 🚀

AI-powered startup lead qualifier with blockchain audit trail on Shardeum.

## Features
- ⚡ AI lead classification (HOT / WARM / COLD) using Claude API
- 📊 Lead scoring 1–100 with reasoning
- ⛓ Blockchain audit trail (Shardeum Sphinx Testnet)
- 📋 Full lead log with expandable blockchain proof
- 📈 Dashboard with pipeline analytics

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/leadflow-ai.git
cd leadflow-ai
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
```

Get your API key at: https://console.anthropic.com

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel (Recommended)

### Option A — Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B — Deploy via GitHub

1. Push this project to a GitHub repo
2. Go to https://vercel.com and click **"Add New Project"**
3. Import your GitHub repo
4. Under **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your API key from console.anthropic.com
5. Click **Deploy** ✅

---

## Deploy to Netlify

1. Push to GitHub
2. Go to https://app.netlify.com → **"Add new site"** → **"Import from Git"**
3. Select your repo
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Under **Environment variables**, add `ANTHROPIC_API_KEY`
7. Deploy ✅

---

## Shardeum Blockchain Setup (Optional - for real blockchain logging)

The app currently simulates blockchain transactions. To enable real Shardeum logging:

1. Install MetaMask: https://metamask.io
2. Add Shardeum Sphinx Testnet to MetaMask:
   - RPC URL: `https://sphinx.shardeum.org/`
   - Chain ID: `8082`
   - Symbol: `SHM`
3. Get free test SHM from: https://faucet.shardeum.org
4. Deploy the smart contract using Remix IDE (https://remix.ethereum.org):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LeadLogger {
    struct LeadLog {
        string leadName;
        string email;
        string tier;
        uint8  score;
        string decisionHash;
        uint256 timestamp;
    }

    LeadLog[] public logs;

    event LeadClassified(string leadName, string tier, uint8 score, uint256 timestamp);

    function logLead(
        string memory _name,
        string memory _email,
        string memory _tier,
        uint8  _score,
        string memory _hash
    ) public {
        logs.push(LeadLog(_name, _email, _tier, _score, _hash, block.timestamp));
        emit LeadClassified(_name, _tier, _score, block.timestamp);
    }

    function getTotalLogs() public view returns (uint256) {
        return logs.length;
    }
}
```

5. Copy the deployed contract address
6. Install ethers.js: `npm install ethers`
7. Replace the mock blockchain functions in `components/blockchain.js` with real ethers.js calls

---

## Project Structure

```
leadflow-ai/
├── app/
│   ├── api/
│   │   └── classify/
│   │       └── route.js        # Claude API call (server-side, key is safe)
│   ├── globals.css
│   ├── layout.js
│   └── page.js                 # Main page
├── components/
│   ├── Header.js
│   ├── SubmitTab.js            # Lead form + result card
│   ├── LeadLogTab.js           # All classified leads
│   ├── DashboardTab.js         # Stats + charts
│   ├── ScoreRing.js            # SVG score component
│   └── blockchain.js           # Blockchain utilities
├── .env.local.example
├── .gitignore                  # .env.local is excluded
├── next.config.js
├── package.json
└── README.md
```

---

## Important: API Key Security

Your `ANTHROPIC_API_KEY` is used only in `app/api/classify/route.js` which runs **server-side**. It is never exposed to the browser. The `.gitignore` file excludes `.env.local` so your key is never committed to GitHub.
