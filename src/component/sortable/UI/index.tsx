// components/DragIcon.tsx
import React from 'react';

interface DragIconProps {
  size?: number;
  color?: string;
}

const DragIcon: React.FC<DragIconProps> = ({ size = 24, color = '#000' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="4" width="4" height="4" fill={color} />
      <rect x="4" y="10" width="4" height="4" fill={color} />
      <rect x="4" y="16" width="4" height="4" fill={color} />
      <rect x="10" y="4" width="4" height="4" fill={color} />
      <rect x="10" y="10" width="4" height="4" fill={color} />
      <rect x="10" y="16" width="4" height="4" fill={color} />
    </svg>
  );
};

export default DragIcon;
