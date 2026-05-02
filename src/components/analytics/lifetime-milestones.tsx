import { ILifetimeMilestonesProps } from "@/types/analytics.types";
import { Award, Clock, Flame } from "lucide-react";
import React from "react";

const LifetimeMilestones: React.FC<ILifetimeMilestonesProps> = ({ stats }) => {
  return (
    <div className="bg-base_color/50 backdrop-blur-xl rounded-3xl p-6 border border-border_color shadow-xl shadow-base_color/10">
      <h2 className="text-lg font-display font-bold text-heading_color mb-5 flex items-center">
        <Award className="w-5 h-5 mr-2 text-primary_color" />
        Lifetime Milestones
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-base_color/80 rounded-2xl p-4 border border-border_color text-center shadow-sm group">
          <div className="w-10 h-10 mx-auto bg-primary_color/10 text-primary_color rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
            <Flame className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-disable_color uppercase tracking-wider mb-0.5">
            Active Days
          </p>
          <p className="text-2xl font-display font-bold text-heading_color">
            {stats.activeDays}{" "}
            <span className="text-sm font-medium text-disable_color">days</span>
          </p>
        </div>
        <div className="bg-base_color/80 rounded-2xl p-4 border border-border_color text-center shadow-sm shadow-base_color/10 group">
          <div className="w-10 h-10 mx-auto bg-success_bg_color text-success_color rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-disable_color uppercase tracking-wider mb-0.5">
            Total Focus
          </p>
          <p className="text-2xl font-display font-bold text-heading_color leading-none mt-1">
            {stats.lifetimeHours}
            <span className="text-sm font-medium text-disable_color mr-2">h</span>
            {stats.lifetimeMins}
            <span className="text-sm font-medium text-disable_color">m</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LifetimeMilestones;
