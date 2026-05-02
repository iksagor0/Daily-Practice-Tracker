import { ITodayProgressCardProps } from "@/types/analytics.types";
import { TrendingUp } from "lucide-react";
import React from "react";
import { ProgressSvg } from "../atoms/custom-icons";

const TodayProgressCard: React.FC<ITodayProgressCardProps> = ({
  mounted,
  stats,
}) => {
  // Constants for Progress ring
  const radius = 70;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (stats.percentage / 100) * circumference;

  return (
    <div className="bg-base_color/50 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden group border border-border_color shadow-xl shadow-base_color/10">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary_color/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>

      <h2 className="text-lg font-display font-bold text-heading_color mb-6 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-primary_color" />
        Today&apos;s Progress
      </h2>

      <div className="flex justify-center mb-6 relative">
        <ProgressSvg
          radius={radius}
          circumference={circumference}
          offset={offset}
          mounted={mounted}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-display font-black text-heading_color tracking-tight">
            {stats.percentage}%
          </span>
          <span className="text-[10px] font-bold text-disable_color uppercase tracking-widest mt-1">
            Completed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-base_color/80 rounded-2xl p-4 border border-border_color text-center shadow-sm">
          <p className="text-xs font-bold text-disable_color uppercase tracking-wider mb-1">
            Tasks
          </p>
          <p className="text-2xl font-display font-bold text-heading_color">
            <span className="text-primary_color">{stats.completedCount}</span>
            <span className="text-lg text-disable_color">
              /{stats.totalTasks}
            </span>
          </p>
        </div>
        <div className="bg-base_color/80 rounded-2xl p-4 border border-border_color text-center shadow-sm">
          <p className="text-xs font-bold text-disable_color uppercase tracking-wider mb-1">
            Time Spent
          </p>
          <p className="text-2xl font-display font-bold text-heading_color">
            <span className="text-primary_color">{stats.todayTime}</span>
            <span className="text-lg text-disable_color">m</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TodayProgressCard;
