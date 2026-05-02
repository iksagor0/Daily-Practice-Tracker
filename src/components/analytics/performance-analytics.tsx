import { IPerformanceAnalyticsProps } from "@/types/analytics.types";
import { BarChart2, RefreshCw } from "lucide-react";
import React from "react";

const PerformanceAnalytics: React.FC<IPerformanceAnalyticsProps> = ({
  mounted,
  stats,
}) => {
  return (
    <div className="bg-base_color/50 backdrop-blur-xl rounded-3xl p-6 border border-border_color shadow-xl shadow-base_color/10">
      <h2 className="text-lg font-display font-bold text-heading_color mb-5 flex items-center">
        <BarChart2 className="w-5 h-5 mr-2 text-primary_color" />
        Performance Analytics
      </h2>

      <div className="space-y-5">
        {/* Daily Avg */}
        <div>
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-sm font-semibold text-heading_color_secondary">
              Daily Average
            </span>
            <span className="text-sm font-bold text-heading_color">
              <span>{stats.overallAvg}</span>{" "}
              <span className="text-disable_color font-normal">min</span>
            </span>
          </div>
          <div className="w-full bg-border_color/30 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary_color h-full rounded-full transition-all duration-1000"
              style={{ width: mounted ? `${stats.avgPct}%` : "0%" }}
            ></div>
          </div>
        </div>

        {/* Weekly Total */}
        <div>
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-sm font-semibold text-heading_color_secondary">
              This Week Total
            </span>
            <span className="text-sm font-bold text-heading_color">
              <span>{stats.rolling7Total}</span>{" "}
              <span className="text-disable_color font-normal">min</span>
            </span>
          </div>
          <div className="w-full bg-border_color/30 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-400 h-full rounded-full transition-all duration-1000 delay-100"
              style={{ width: mounted ? `${stats.weekPct}%` : "0%" }}
            ></div>
          </div>
        </div>

        {/* Monthly Total */}
        <div>
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-sm font-semibold text-heading_color_secondary">
              This Month Total
            </span>
            <span className="text-sm font-bold text-heading_color">
              <span>{stats.rolling30Total}</span>{" "}
              <span className="text-disable_color font-normal">min</span>
            </span>
          </div>
          <div className="w-full bg-border_color/30 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-1000 delay-200"
              style={{ width: mounted ? `${stats.monthPct}%` : "0%" }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-border_color text-center">
        <span className="inline-flex items-center text-xs text-heading_color_secondary bg-primary_color/5 px-3 py-1 rounded-full">
          <RefreshCw className="w-3 h-3 mr-1.5" /> Resets at 6:00 AM Bangladesh
          Time
        </span>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
