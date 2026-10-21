import React, { useState, useEffect } from 'react';
import { Plane, Eye, Clock } from 'lucide-react';
import { ATCStatistics } from '../../types/telemetry';

interface MetricsBannerProps {
  stats: ATCStatistics;
  lastUpdated?: number | null;
}

export const MetricsBanner: React.FC<MetricsBannerProps> = ({ stats, lastUpdated }) => {
  const [timeAgo, setTimeAgo] = useState<string>('Just now');

  useEffect(() => {
    const updateRelative = () => {
      if (!lastUpdated) {
        setTimeAgo('Waiting...');
        return;
      }
      const elapsed = Math.floor((Date.now() - lastUpdated) / 1000);
      if (elapsed < 5) {
        setTimeAgo('Just now');
      } else if (elapsed < 60) {
        setTimeAgo(`${elapsed}s ago`);
      } else {
        const mins = Math.floor(elapsed / 60);
        setTimeAgo(`${mins}m ago`);
      }
    };

    updateRelative();
    const interval = setInterval(updateRelative, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <div className="grid grid-cols-3 gap-2 p-3 bg-white border-b border-aviation-border shadow-xs">
      {/* 1. Aircraft in View */}
      <div className="bg-aviation-cloud/80 border border-aviation-border rounded-xl p-2.5 flex flex-col justify-between">
        <span className="text-[11px] font-medium text-aviation-muted flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-aviation-sky" />
          In View
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl font-bold text-aviation-navy font-sans tracking-tight">
            {stats.filteredCount}
          </span>
          <span className="text-[10px] text-aviation-muted font-normal">
            of {stats.totalTracked}
          </span>
        </div>
      </div>

      {/* 2. Airborne */}
      <div className="bg-aviation-cloud/80 border border-aviation-border rounded-xl p-2.5 flex flex-col justify-between">
        <span className="text-[11px] font-medium text-aviation-muted flex items-center gap-1.5">
          <Plane className="w-3.5 h-3.5 text-aviation-green" />
          Airborne
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl font-bold text-aviation-navy font-sans tracking-tight">
            {stats.airborneCount}
          </span>
          <span className="text-[10px] text-aviation-green font-medium">
            flying
          </span>
        </div>
      </div>

      {/* 3. Data Last Updated */}
      <div className="bg-aviation-cloud/80 border border-aviation-border rounded-xl p-2.5 flex flex-col justify-between">
        <span className="text-[11px] font-medium text-aviation-muted flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-aviation-sky" />
          Updated
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xs sm:text-sm font-semibold text-aviation-navy font-sans truncate">
            {timeAgo}
          </span>
        </div>
      </div>
    </div>
  );
};
