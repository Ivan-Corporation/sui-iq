import { SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

async function main() {
  const client = new SuiClient({
    url: "https://fullnode.testnet.sui.io:443",
  });

  const keypair = Ed25519Keypair.generate();
  const address = keypair.toSuiAddress();
  console.log("Using address:", address);

  const packageId = "0xYourPublishedPackageIdHere";
  const registryId = "0xYourRegistryObjectId";
  const randomId = "0xYourRandomObjectId";

  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::iq_badge::mint_badge`,
    arguments: [
      tx.object(registryId),
      tx.object(randomId),
    ],
  });

  tx.setSender(address);
  tx.setGasBudget(100_000_000);

  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: {
      showEffects: true,
      showEvents: true,
    },
  });

  console.log("Mint successful!");
  console.log("Digest:", result.digest);
  console.log("Events:", result.events);
}

main().catch(console.error);