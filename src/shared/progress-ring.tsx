import React from "react";

interface IProgressRingProps {
  percentage: number;
  className?: string;
}

export const ProgressRing: React.FC<IProgressRingProps> = ({ percentage, className = "" }) => {
  const radius = 64;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative w-40 h-40 flex items-center justify-center shrink-0 ${className}`}>
      {/* Background Track */}
      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" strokeWidth="12" className="stroke-slate-100" />
      </svg>
      {/* Foreground Progress Ring */}
      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          className="stroke-brand-500 transition-colors duration-700 progress-ring-circle"
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: offset,
          }}
        />
      </svg>
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
