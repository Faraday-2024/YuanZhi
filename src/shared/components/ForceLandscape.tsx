
import React from 'react';
import { Smartphone } from 'lucide-react';

const ForceLandscape: React.FC = () => {
  return (
    <div className="force-landscape-overlay">
      <div className="force-landscape-content">
        <Smartphone className="force-landscape-icon" />
        <p className="force-landscape-text">
          为了获得最佳体验，请旋转您的设备
        </p>
      </div>
    </div>
  );
};

export default ForceLandscape;
