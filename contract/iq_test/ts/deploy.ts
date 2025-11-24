import { SuiClient } from "@mysten/sui/client";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import "dotenv/config";
import { execSync } from "child_process";

async function main() {
  if (!process.env.SUI_PRIVATE_KEY) {
    throw new Error("Missing SUI_PRIVATE_KEY in .env");
  }

  const { secretKey } = decodeSuiPrivateKey(process.env.SUI_PRIVATE_KEY);
  const keypair = Ed25519Keypair.fromSecretKey(secretKey);
  const address = keypair.toSuiAddress();

  console.log("Deploying from:", address);

  const client = new SuiClient({ url: "https://fullnode.testnet.sui.io" });

  console.log("Building package...");
  const output = execSync(`sui move build --dump-bytecode-as-base64 --path .`, {
    encoding: "utf8",
  });

  const { modules, dependencies } = JSON.parse(output);

  const tx = new Transaction();
  const upgradeCap = tx.publish({ modules, dependencies }); // ← Capture the result here
  tx.transferObjects([upgradeCap], address); // ← Transfer it to yourself (owns the upgrade cap for future use)
  tx.setGasBudget(200_000_000);

  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: { showEffects: true, showObjectChanges: true },
  });
  console.log("PUBLISH RESULT:\n", JSON.stringify(result, null, 2));
}

main().catch((err) => console.error("Failed:", err));
