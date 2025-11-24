import React, { useState, useEffect } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import ClipLoader from "react-spinners/ClipLoader";
import { useNetworkVariable } from "../networkConfig";

export default function MintBadge({
  onMinted,
}: {
  onMinted?: (objectId: string, iq: number) => void;
}) {
  const iqPackageId = useNetworkVariable("iqPackageId");
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const [registryId, setRegistryId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Check if user already has a Registry
  useEffect(() => {
    if (!currentAccount) return;

    (async () => {
      try {
        const owned = await suiClient.getOwnedObjects({ owner: currentAccount.address!, options: { showContent: true } });
        const registry = owned.data.find(
          (o: any) => o.data?.type === `${iqPackageId}::iq_badge::Registry`
        );
        // @ts-ignore
        if (registry) setRegistryId(registry.data.objectId);
      } catch (err) {
        console.error("Error fetching user registry:", err);
      }
    })();
  }, [currentAccount, iqPackageId, suiClient]);

  // Create a Registry if none exists
  const createRegistry = async () => {
    if (!currentAccount) return null;
    setBusy(true);

    const tx = new Transaction();
    tx.moveCall({
      target: `${iqPackageId}::iq_badge::init_registry`,
      arguments: [],
    });

    return new Promise<string>((resolve, reject) => {
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: async ({ digest }) => {
            try {
              const txData = await suiClient.waitForTransaction({ digest, options: { showObjectChanges: true } });
              const created = txData.objectChanges?.find(
                (c: any) => c.type === "created" && c.objectType?.endsWith("::iq_badge::Registry")
              );
              if (created && "objectId" in created) {
                setRegistryId(created.objectId);
                resolve(created.objectId);
              } else reject("Failed to create registry");
            } catch (err) {
              reject(err);
            } finally {
              setBusy(false);
            }
          },
          onError: (err) => {
            console.error("Registry creation failed:", err);
            setBusy(false);
            reject(err);
          },
        }
      );
    });
  };

  const mint = async () => {
    if (!currentAccount) return;

    setBusy(true);

    // Ensure the user has a registry
    let regId = registryId;
    if (!regId) {
      try {
        regId = await createRegistry();
      } catch (err) {
        setBusy(false);
        return;
      }
    }

    const tx = new Transaction();
    tx.moveCall({
      target: `${iqPackageId}::iq_badge::mint_badge`,
      arguments: [tx.object(regId!), tx.object.random()],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          try {
            const txData = await suiClient.waitForTransaction({ digest, options: { showObjectChanges: true } });
            const createdObj = txData.objectChanges?.find(
              (change: any) =>
                change.type === "created" &&
                change.objectType?.endsWith("::iq_badge::IQBadge")
            );

            if (createdObj && "objectId" in createdObj) {
              const objId = createdObj.objectId;

              const obj = await suiClient.getObject({
                id: objId,
                options: { showContent: true },
              });

              // @ts-ignore
              const iq = Number(obj.data?.content?.fields?.iq || 0);
              onMinted?.(objId, iq);
            }
          } catch (err) {
            console.error("Error fetching minted badge:", err);
          } finally {
            setBusy(false);
          }
        },
        onError: (err) => {
          console.error("Mint transaction failed:", err);
          setBusy(false);
        },
      }
    );
  };

  return (
    <button
      onClick={mint}
      disabled={isPending || busy}
      className="w-full py-5 text-2xl font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-70 text-white shadow-2xl flex items-center justify-center gap-3"
    >
      {busy || isPending ? (
        <>
          <ClipLoader size={28} color="white" /> Summoning Your True IQ...
        </>
      ) : (
        "MINT ETERNAL IQ BADGE"
      )}
    </button>
  );
}
