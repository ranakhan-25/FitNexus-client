"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black">

      <div className="text-center">

        {/* Spinner */}
        <motion.div
          className="w-14 h-14 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />

        {/* Text animation */}
        <motion.h1
          className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
          }}
        >
          Loading...
        </motion.h1>

        {/* Dots animation */}
        <motion.div
          className="flex justify-center gap-1 mt-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.6,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

      </div>
    </div>
  );
}