import React from "react";
import { motion } from "motion/react";

export default function Empty({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        type: "tween",
        ease: "easeInOut",
      }}
      className=" grid place-items-center text-lg font-medium text-gray-500 h-[70vh]"
    >
      <p>{message}</p>
    </motion.div>
  );
}
