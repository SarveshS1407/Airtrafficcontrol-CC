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
        setTimeAgo('Standby');
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
    <div className="grid grid-cols-3 gap-2 p-3 bg-[#F4F0E7] border-b border-[#D6E0E7] shadow-2xs font-sans">
      {/* 1. Aircraft in View */}
      <div className="bg-[#FCFAF5] border border-[#D6E0E7] rounded-xl p-2.5 flex flex-col justify-between shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#82909B] uppercase tracking-wider flex items-center gap-1 tech-stamp">
            <Eye className="w-3 h-3 text-[#D87C43]" />
            In View
          </span>
          <span className="text-[9px] font-mono text-[#82909B]">01</span>
        </div>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className="text-xl font-black text-[#172D40] font-mono tracking-tight">
            {stats.filteredCount}
          </span>
          <span className="text-[10px] text-[#82909B] font-mono">
            /{stats.totalTracked}
          </span>
        </div>
      </div>

      {/* 2. Airborne */}
      <div className="bg-[#FCFAF5] border border-[#D6E0E7] rounded-xl p-2.5 flex flex-col justify-between shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#82909B] uppercase tracking-wider flex items-center gap-1 tech-stamp">
            <Plane className="w-3 h-3 text-[#467A67]" />
            Airborne
          </span>
          <span className="text-[9px] font-mono text-[#82909B]">02</span>
        </div>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className="text-xl font-black text-[#467A67] font-mono tracking-tight">
            {stats.airborneCount}
          </span>
          <span className="text-[10px] text-[#467A67] font-semibold">
            fly
          </span>
        </div>
      </div>

      {/* 3. Data Last Updated */}
      <div className="bg-[#FCFAF5] border border-[#D6E0E7] rounded-xl p-2.5 flex flex-col justify-between shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#82909B] uppercase tracking-wider flex items-center gap-1 tech-stamp">
            <Clock className="w-3 h-3 text-[#456D8B]" />
            Updated
          </span>
          <span className="text-[9px] font-mono text-[#82909B]">03</span>
        </div>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className="text-xs sm:text-sm font-bold text-[#172D40] font-mono truncate">
            {timeAgo}
          </span>
        </div>
      </div>
    </div>
  );
};
