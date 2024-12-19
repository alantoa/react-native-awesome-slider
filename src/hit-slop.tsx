import React from 'react';
import { Platform } from 'react-native';

interface HitSlopProps {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  children: React.ReactNode;
}

export const HitSlop: React.FC<HitSlopProps> = ({
  top = 10,
  right = 10,
  bottom = 10,
  left = 10,
  children,
}) => {
  if (Platform.OS !== 'web') {
    return children;
  }
  return (
    <div
      style={{
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -top,
          right: -right,
          bottom: -bottom,
          left: -left,
        }}
      />
      {children}
    </div>
  );
};
