import { IProgressRingProps } from "@/types";
import { cn } from "@/utils/cn";
import React from "react";
import { ProgressSvg } from "../atoms/custom-icons";

const ProgressRing: React.FC<IProgressRingProps> = ({
  percentage,
  className = "",
}) => {
  const radius = 64;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn(
        "relative w-40 h-40 flex items-center justify-center shrink-0",
        className,
      )}
    >
      <ProgressSvg
        radius={radius}
        circumference={circumference}
        offset={offset}
        mounted={true}
        className="absolute inset-0 w-full h-full transform -rotate-90"
      />
      {/* Text Inside Ring */}
      <div className="text-center z-10 transition-transform hover:scale-105 select-none">
        <div className="text-4xl font-display font-extrabold text-slate-800 tracking-tight leading-none mb-1">
          {percentage}%
        </div>
        <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
          Completed
        </div>
      </div>
    </div>
  );
};

export default ProgressRing;
