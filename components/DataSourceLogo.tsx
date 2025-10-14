
import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from './icons';
import type { DataSource } from '../types';
import { LogoStatus } from '../types';
import Tooltip from './Tooltip';

interface DataSourceLogoProps {
  source: DataSource;
  status: LogoStatus;
  latency?: number | null;
}

const DataSourceLogo: React.FC<DataSourceLogoProps> = ({ source, status, latency }) => {
  const [displayedLatency, setDisplayedLatency] = useState(0);

  useEffect(() => {
    if (status === LogoStatus.COMPLETE && latency) {
      let startTimestamp: number | null = null;
      const duration = 400; // Animation duration in ms

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = Math.floor(progress * latency);
        setDisplayedLatency(currentVal);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [status, latency]);

  const getStatusClasses = () => {
    switch (status) {
      case LogoStatus.PENDING:
        return 'opacity-40 grayscale';
      // FIX: Corrected typo from `Logo.ACTIVE` to `LogoStatus.ACTIVE`.
      case LogoStatus.ACTIVE:
        return 'animate-pulse scale-105 shadow-lg';
      case LogoStatus.COMPLETE:
        return 'opacity-100';
      default:
        return '';
    }
  };

  return (
    <Tooltip text={source.description}>
      <div className="flex flex-col items-center justify-center text-center">
        <div className={`relative w-16 h-16 transition-all duration-800 ${getStatusClasses()}`}>
          {source.logo}
          {status === LogoStatus.COMPLETE && (
            <CheckCircleIcon className="absolute -top-1 -right-1 w-6 h-6 text-green-500 bg-white rounded-full" />
          )}
        </div>
        <p className="text-xs font-medium text-gray-600 mt-2 truncate w-full">{source.name}</p>
        {status === LogoStatus.COMPLETE && latency ? (
          <p className="text-xs text-green-600 font-semibold">{displayedLatency}ms</p>
        ) : (
          <p className="text-xs text-transparent">_</p>
        )}
      </div>
    </Tooltip>
  );
};

export default DataSourceLogo;