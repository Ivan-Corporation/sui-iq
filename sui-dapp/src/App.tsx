import React, { useEffect, useState } from "react";
import {
  ConnectButton,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";

import { motion, AnimatePresence } from "framer-motion";

import IQTestScreen from "./components/IQTestScreen";
import BadgeView from "./components/BadgeView";

import { TESTNET_IQ_PACKAGE_ID, TESTNET_IQ_REGISTRY_ID } from "./constants";

export default function App() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [hasBadge, setHasBadge] = useState(false);
  const [badgeObjectId, setBadgeObjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentAccount) return;

    (async () => {
      const owned = await suiClient.getOwnedObjects({
        owner: currentAccount.address!,
        options: { showContent: true },
      });

      const found = owned.data.find((o: any) => {
        const t = o.data?.content?.type;
        return t?.startsWith(`${TESTNET_IQ_PACKAGE_ID}::iq_badge::IQBadge`);
      });

      if (found) {
        setHasBadge(true);
        setBadgeObjectId(found.data!.objectId);
      }
    })();
  }, [currentAccount]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <div className="p-4 flex justify-between border-b border-white/10 backdrop-blur-lg">
        <h1 className="text-2xl font-bold">🧠 Sui IQ Badge</h1>
        <ConnectButton />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 justify-center items-center p-6">
        <AnimatePresence mode="wait">
          {!currentAccount ? (
            <motion.div
              key="connect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card"
            >
              <h2 className="text-xl">Please connect your wallet</h2>
            </motion.div>
          ) : hasBadge && badgeObjectId ? (
            <BadgeView key="badge" objectId={badgeObjectId} />
          ) : (
            <IQTestScreen
              key="iqtest"
              registryId={TESTNET_IQ_REGISTRY_ID}
              onMinted={(id: React.SetStateAction<string | null>) => {
                setBadgeObjectId(id);
                setHasBadge(true);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
