'use client';
import { motion } from 'framer-motion';

export const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-[150px]">
      <motion.div
        className="w-full h-2 bg-[#222222] rounded-full overflow-hidden"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        <motion.div
          className="h-full bg-gray-400 rounded-full"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </div>
  );
};
