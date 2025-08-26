import { motion } from 'motion/react';
import React from 'react';

export default function Empty({ message }: { message: string }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="grid h-[70vh] place-items-center font-medium text-gray-500 text-lg"
      initial={{ opacity: 0, y: 50 }}
      transition={{
        duration: 0.3,
        type: 'tween',
        ease: 'easeInOut',
      }}
    >
      <p>{message}</p>
    </motion.div>
  );
}
