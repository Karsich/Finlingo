import React from 'react';
import { Heart } from 'lucide-react';

const LivesBadge = ({ current = 0, max = 30 }) => {
  return (
    <span className="lives-badge">
      <span>{current}/{max}</span>
      <Heart size={16} className="lives-badge-icon" />
    </span>
  );
};

export default LivesBadge;




