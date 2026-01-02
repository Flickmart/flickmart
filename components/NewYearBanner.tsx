'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export default function NewYearBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we've already shown it this session (optional, but good UX)
    const hasSeen = sessionStorage.getItem('seenNewYearBanner');
    if (!hasSeen) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('seenNewYearBanner', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="fixed bottom-20 left-4 right-4 z-[100] mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-white/20 bg-black/80 p-4 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] backdrop-blur-md sm:bottom-8 sm:left-auto sm:right-8 sm:mx-0"
        >
          {/* Decorative Glow */}
          <div className="absolute -left-2 -top-2 -z-10 h-16 w-16 rounded-full bg-blue-500/30 blur-xl" />
          <div className="absolute -bottom-2 -right-2 -z-10 h-16 w-16 rounded-full bg-purple-500/30 blur-xl" />

          {/* Balloons */}
          <div className="flex -space-x-2">
            {['#ef4444', '#eab308', '#3b82f6'].map((color, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, i % 2 === 0 ? 5 : -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
                className="relative h-8 w-6"
              >
                {/* Balloon Shape */}
                <div
                  className="h-full w-full rounded-full shadow-sm"
                  style={{ backgroundColor: color }}
                />
                {/* String */}
                <div className="absolute left-1/2 top-full h-4 w-[1px] -translate-x-1/2 bg-white/50" />
              </motion.div>
            ))}
          </div>

          <div className="flex flex-1 flex-col">
            <h3 className="bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-lg font-bold text-transparent">
              Hello 2026! 🎆
            </h3>
            <p className="text-xs text-gray-300">New year, new deals. Shop now!</p>
          </div>

          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
