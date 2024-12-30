'use client';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { TabId } from './tabs-config';
import { useEffect, useRef } from 'react';

const SliderExample = dynamic(
  () => import('./slider-binance-example').then((mod) => mod.SliderExample),
  { ssr: false }
);
const SliderBasicExample = dynamic(
  () => import('./slider-basic-example').then((mod) => mod.SliderBasicExample),
  { ssr: false }
);
const PlayerControlBarExample = dynamic(
  () =>
    import('./player-control-bar-example').then(
      (mod) => mod.PlayerControlBarExample
    ),
  { ssr: false }
);

interface SliderExamplesProps {
  activeTab: TabId;
}
const MotionDiv = ({
  children,
  isFirstMount,
}: {
  children: React.ReactNode;
  isFirstMount: boolean;
}) => {
  if (isFirstMount) {
    return <div className="absolute inset-0">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {children}
    </motion.div>
  );
};
export const SliderExamples = ({ activeTab }: SliderExamplesProps) => {
  const isFirstMount = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      isFirstMount.current = false;
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="w-full max-w-md min-h-[150px] relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeIn' }}
    >
      <AnimatePresence mode="wait">
        {activeTab === 'basic' && (
          <MotionDiv key="basic" isFirstMount={isFirstMount.current}>
            <SliderBasicExample />
          </MotionDiv>
        )}

        {activeTab === 'advanced' && (
          <MotionDiv key="advanced" isFirstMount={isFirstMount.current}>
            <SliderExample />
          </MotionDiv>
        )}

        {activeTab === 'player' && (
          <MotionDiv key="player" isFirstMount={isFirstMount.current}>
            <PlayerControlBarExample />
          </MotionDiv>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
