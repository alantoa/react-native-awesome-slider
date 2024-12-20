'use client';
import { motion } from 'framer-motion';
import { TABS, TabId } from './slider/tabs-config';

interface TabsProps {
  tabs: typeof TABS;
  activeTab: TabId;
  onChange?: (id: TabId) => void;
}

export const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => {
  return (
    <div className="relative flex p-1 space-x-1 bg-[#111111] rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            onChange?.(tab.id);
          }}
          className={`relative rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === tab.id
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          style={{ zIndex: 2 }}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 bg-[#222222] rounded-md"
              style={{ zIndex: -1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};
