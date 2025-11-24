import React, { useEffect, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

interface IQTier {
  min: number;
  max: number;
  title: string;
  quote: string;
  emoji: string;
  color: string;
  celeb: string;
  confetti?: string[];
  extra?: React.ReactNode;
}

const tiers: IQTier[] = [
  {
    min: 40,
    max: 59,
    title: "Legally Vegetable",
    quote: "You failed the mirror test",
    emoji: "🌱",
    color: "from-green-600 to-emerald-800",
    celeb: "A potato with dreams",
    extra: <div className="text-9xl animate-bounce">🌱</div>,
  },
  {
    min: 60,
    max: 74,
    title: "Certified Roomba",
    quote: "You get stuck on rugs",
    emoji: "🤖",
    color: "from-gray-600 to-gray-800",
    celeb: "Roomba that married a rock",
    extra: <p className="text-6xl">🤖</p>,
  },
  {
    min: 75,
    max: 89,
    title: "Participation Trophy",
    quote: "You tried your best (and lost)",
    emoji: "🏆",
    color: "from-yellow-600 to-amber-700",
    celeb: "Everyone who ever got a 'Good Effort' sticker",
  },
  {
    min: 90,
    max: 99,
    title: "Reddit Comment Section",
    quote: "Confident but wrong",
    emoji: "🤯",
    color: "from-red-600 to-orange-700",
    celeb: "That guy who starts every reply with 'Actually...'",
  },
  {
    min: 100,
    max: 109,
    title: "Perfectly Mid",
    quote: "You are the human equivalent of beige",
    emoji: "😐",
    color: "from-gray-500 to-slate-600",
    celeb: "The NPC from your childhood",
  },
  {
    min: 110,
    max: 119,
    title: "Thinks They're Smart",
    quote: "You use the word 'sheeple' unironically",
    emoji: "😎",
    color: "from-blue-500 to-indigo-600",
    celeb: "Crypto bro who read half of Rich Dad Poor Dad",
  },
  {
    min: 120,
    max: 129,
    title: "Gifted Kid Burnout",
    quote: "Was in GATE, now in therapy",
    emoji: "😭",
    color: "from-purple-600 to-pink-600",
    celeb: "Former child prodigy, current LinkedIn poet",
  },
  {
    min: 130,
    max: 144,
    title: "Actually Smart",
    quote: "You finish NYT crossword on Wednesday",
    emoji: "💡",
    color: "from-cyan-400 to-blue-600",
    celeb: "That one friend who explains the joke",
  },
  {
    min: 145,
    max: 159,
    title: "Galaxy Brain",
    quote: "You understood Inception on first watch",
    emoji: "🌌",
    color: "from-purple-500 to-indigo-700",
    celeb: "Rick Sanchez (but with a job)",
  },
  {
    min: 160,
    max: 179,
    title: "Dangerous Intelligence",
    quote: "The government has a file on you",
    emoji: "👁️‍🗨️",
    color: "from-red-600 to-purple-800",
    celeb: "Edward Snowden + Terence Tao's love child",
  },
  {
    min: 180,
    max: 200,
    title: "LITERALLY GOD",
    quote: "You are the simulation's admin",
    emoji: "🧠",
    color: "from-orange-500 via-pink-500 to-purple-600",
    celeb: "Satoshi Nakamoto, Jesus, and Einstein in a trench coat",
    confetti: ["#gold", "#rainbow"],
    extra: <div className="text-8xl animate-spin">🧠</div>,
  },
];

export default function BadgeView({ objectId }: any) {
  const suiClient = useSuiClient();
  const [iq, setIq] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const resp = await suiClient.getObject({
        id: objectId,
        options: { showContent: true },
      });
      //   @ts-ignore
      const fields = resp.data?.content?.fields;
      if (!fields) return;
      setIq(Number(fields.iq));
      setTimestamp(Number(fields.timestamp));
    })();
  }, [objectId]);

  if (iq === null) {
    return (
      <div className="text-center py-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="text-8xl"
        >
          🧠
        </motion.div>
        <p className="text-white/80 mt-8 text-2xl">
          Calibrating your single braincell...
        </p>
      </div>
    );
  }

  const tier = tiers.find((t) => iq >= t.min && iq <= t.max) || tiers[4];

  return (
    <>
      <Confetti
        recycle={false}
        numberOfPieces={
          iq >= 180
            ? 600
            : iq >= 160
              ? 400
              : iq >= 130
                ? 250
                : iq <= 70
                  ? 80
                  : 180
        }
        gravity={iq >= 170 ? 0.04 : iq <= 70 ? 0.25 : 0.08}
        colors={
          tier.confetti ||
          (iq >= 180
            ? ["#ffd700", "#ff69b4", "#00ffff", "#ff4500", "#9400d3"]
            : undefined)
        }
      />

      <motion.div
        className="relative w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 p-8 shadow-2xl">
          {/* Subtle floating background emojis */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none opacity-5">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [-20, -80, -20] }}
                transition={{
                  duration: 12 + i * 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute text-8xl"
                style={{ left: `${20 + i * 20}%`, top: "10%" }}
              >
                {tier.emoji}
              </motion.div>
            ))}
          </div>

          {/* IQ Circle */}
          <motion.div
            className="relative mx-auto w-48 h-48"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${tier.color} shadow-2xl ring-4 ring-white/30`}
            />
            <div className="absolute inset-2 rounded-full bg-black/80 flex items-center justify-center">
              <motion.span
                animate={{ scale: iq >= 180 ? [1, 1.15, 1] : [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-7xl font-black text-white drop-shadow-2xl"
              >
                {iq}
              </motion.span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-3xl font-bold text-white tracking-tight text-center"
          >
            {tier.title}
          </motion.h1>

          {/* Savage Quote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-lg text-white/90 font-medium flex items-center justify-center gap-3"
          >
            <span>{tier.emoji}</span>
            <span>{tier.quote}</span>
            <span>{tier.emoji}</span>
          </motion.p>

          {/* Celebrity Match */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
            className="mt-8 p-5 bg-white/10 rounded-2xl border border-white/20"
          >
            <p className="text-sm text-white/70">Same vibe as</p>
            <p className="text-xl font-bold text-yellow-400 mt-1">
              {tier.celeb}
            </p>
          </motion.div>

          {/* Extra Easter Egg */}
          {tier.extra && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6"
            >
              {tier.extra}
            </motion.div>
          )}

          {/* Footer */}
          <div className="mt-10 text-center text-white/50 text-sm space-y-1">
            <p>Minted in epoch {timestamp}</p>
            <p className="text-white/80 font-medium">Your IQ is now eternal</p>
            <p className="text-xs opacity-70">
              ID: {objectId.slice(0, 8)}...{objectId.slice(-6)}
            </p>
          </div>

          {/* Final sparkle */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mt-8 text-5xl text-center"
          >
            {iq >= 180 ? "🌟" : iq >= 150 ? "✨" : iq <= 70 ? "🌿" : "✨"}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
