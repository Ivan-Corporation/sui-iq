import React, { useEffect, useState } from "react";
import MintBadge from "./MintBadge";
import { motion, AnimatePresence } from "framer-motion";

const symbols = [
  "🧠",
  "💀",
  "🦄",
  "🌈",
  "🍄",
  "🤡",
  "🔮",
  "🚽",
  "🗿",
  "👁️",
  "🫦",
  "🦷",
];

export default function IQTestScreen({
  registryId,
  onMinted,
}: {
  registryId: string;
  onMinted?: (id: string, realIq: number) => void;
}) {
  const [step, setStep] = useState<"question" | "calculating" | "mint">(
    "question",
  );
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const handleMinted = (objectId: string, iqFromChain: number) => {
    onMinted?.(objectId, iqFromChain);
  };

  // Auto-advance from calculating → mint
  useEffect(() => {
    if (step === "calculating") {
      const timer = setTimeout(() => setStep("mint"), 3200);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <motion.div
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 shadow-2xl">
        <AnimatePresence mode="wait">
          {/* === QUESTION STEP === */}
          {step === "question" && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="text-center space-y-10"
            >
              <div>
                <h2 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  ULTRA SCIENTIFIC IQ TEST
                </h2>
                <p className="mt-4 text-xl text-white/90">
                  Choose the glyph that{" "}
                  <span className="font-bold text-cyan-400">
                    vibes with your soul
                  </span>
                  :
                </p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-5">
                {symbols.map((s) => (
                  <motion.button
                    key={s}
                    layout
                    whileHover={{
                      scale: 1.3,
                      rotate: [0, -8, 8, -8, 0],
                      transition: { duration: 0.4 },
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSymbol(s)}
                    className={`
                      relative aspect-square text-6xl rounded-3xl flex items-center justify-center
                      transition-all duration-300 cursor-pointer select-none
                      ${
                        selectedSymbol === s
                          ? "bg-gradient-to-br from-purple-500 to-pink-600 shadow-2xl ring-4 ring-white/50 scale-110"
                          : "bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                      }
                    `}
                  >
                    <span className="drop-shadow-2xl">{s}</span>
                    {selectedSymbol === s && (
                      <motion.div
                        layoutId="selectedGlow"
                        className="absolute inset-0 rounded-3xl bg-white/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={selectedSymbol ? { scale: 1.05 } : {}}
                whileTap={selectedSymbol ? { scale: 0.98 } : {}}
                onClick={() => selectedSymbol && setStep("calculating")}
                disabled={!selectedSymbol}
                className={`
                  w-full py-6 text-2xl font-bold rounded-2xl shadow-2xl transition-all
                  cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                  ${
                    selectedSymbol
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500"
                      : "bg-gray-700"
                  } text-white
                `}
              >
                {selectedSymbol
                  ? "UNLEASH THE ORACLE"
                  : "first, choose your destiny"}
              </motion.button>
            </motion.div>
          )}

          {/* === CALCULATING STEP === */}
          {step === "calculating" && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center py-16 space-y-10"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-9xl drop-shadow-2xl"
              >
                {selectedSymbol}
              </motion.div>

              <div className="space-y-4">
                <h3 className="text-9xl font-bold text-white">
                  Contacting the Void...
                </h3>
                <div className="text-white/80 space-y-2">
                  <p>Hashing your soul glyph...</p>
                  <p>Consulting ancient blockchain spirits...</p>
                  <p className="text-yellow-400 font-bold animate-pulse">
                    100% accurate • peer-reviewed by clowns
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -30, 0] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                    className="w-5 h-16 bg-gradient-to-t from-purple-500 to-pink-400 rounded-full shadow-lg"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* === MINT STEP === */}
          {step === "mint" && (
            <motion.div
              key="mint"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-center space-y-10"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                className="text-9xl"
              >
                {selectedSymbol}
              </motion.div>

              <div>
                <h2 className="text-3xl font-black text-white mb-4">
                  The Oracle Has Decided
                </h2>
                <p className="text-white/70 text-lg leading-relaxed">
                  Your soul has been weighed.
                  <br />
                  The random gods have spoken.
                  <br />
                  <span className="text-cyan-400 font-bold">
                    Your IQ is now eternal.
                  </span>
                </p>
              </div>

              <MintBadge onMinted={handleMinted} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
