# IQ Badge Sui Project

This repository demonstrates a Move-based Sui smart contract to mint IQ badges as NFTs and track who already minted. It also includes a frontend plan for users to mint their badge and see their IQ.

---

## Prerequisites

### 1. Sui CLI
- **Windows (Chocolatey)**:
```powershell
choco install sui-cli
```
- **Linux / WSL**:
```bash
curl -sSf https://install.sui.io | sh
```
- Verify installation:
```bash
sui --version
```

### 2. Node.js (for frontend and deploy scripts)
```bash
# Windows (choco)
choco install nodejs
# Linux/WSL
sudo apt update && sudo apt install -y nodejs npm
```
- Recommended: Node.js >= 20

### 3. Rust (for Move builds)
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup default stable
```

### 4. Yarn or NPM
```bash
npm install -g yarn
```

---

## Move Smart Contract Setup

### 1. Clone repository & install dependencies
```bash
git clone <repo-url>
cd iq_test
```

### 2. Move.toml
Ensure dependencies are correct:
```toml
[package]
name = "iq_test"
version = "0.0.1"
edition = "2024.beta"

[addresses]
iq_test = "0x0"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir="crates/sui-framework/packages/sui-framework", rev="testnet" }
```

### 3. Build contract
```bash
sui move build
```
- Warnings are OK, focus on errors.

### 4. Deploy contract
```bash
npx ts-node ts/deploy.ts
```
- Output will contain:
  - `packageId`
  - Your registry object will need to be initialized next.

### 5. Initialize Registry (only once)
```bash
sui client call \
  --package <packageId> \
  --module iq_badge \
  --function init_registry \
  --gas <your_gas_object> \
  --gas-budget 20000000
```
- Stores the registry on-chain to track users.

---



# Sui IQ Badge — Frontend (React + Vite + TypeScript)

Simple dApp for your IQ Badge Move contract on Sui testnet.
This repo uses the official Sui DApp Kit and the modern @mysten/sui SDK pieces.

## What this does
- Connect with a Sui wallet (Slush, Ethos, Sui Wallet, etc.) via dApp Kit
- Uses your already-deployed contract package & registry (testnet)
- Lets a connected user:
  - Check if they already have an on-chain IQBadge
  - Mint an IQBadge (one per address) — uses on-chain randomness
  - Displays the obtained IQ / NFT fields

> Note: `init_registry` already ran on-chain; the frontend **does not** call `init_registry`.

---

## Prereqs

- Node.js >= 18 recommended
- pnpm / npm / yarn (examples use `npm`)
- An installed Sui-compatible wallet (Slush or Sui Wallet) in browser to test wallet connection
- Your contract is already deployed on testnet, and registry ID is known:
  - Package ID: `0xe0b133c97277a8acda18030afc83fe95a7c8977b7d494aeeef6259f8dc9ac0a5`
  - Registry ID: `0xb63b30d3bc8afdabc40f868212ac47a6358f452c8aaa6e8ae38754dc4a8ba7c8`

---

## Install & run

```bash
# clone into a fresh folder (if not already)
# cd frontend directory

npm install

# dev server
npm run dev

# build production
npm run build

# preview production locally
npm run preview
```


## References

- [Sui Documentation](https://docs.sui.io/)
- [Move Language Guide](https://move-language.com/)

