import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/utils/cn";

interface ITaskTimeBadgeProps {
  targetStr: string;
}

export const TaskTimeBadge: React.FC<ITaskTimeBadgeProps> = ({ targetStr }) => {
  let iconName = "Clock";
  let colorClass = "text-amber-500 bg-amber-50 border-amber-100";

  if (targetStr === "Unlimited") {
    iconName = "Infinity";
    colorClass = "text-indigo-500 bg-indigo-50 border-indigo-100";
  } else if (targetStr === "Sometimes") {
    iconName = "Shuffle";
    colorClass = "text-rose-500 bg-rose-50 border-rose-100";
  }

  const IconComponent = (LucideIcons as unknown as Record<string, React.ElementType>)[iconName] || LucideIcons.Clock;

  return (
    <div
      className={cn("font-semibold text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-full border", colorClass)}
    >
      <IconComponent className="w-3.5 h-3.5" />
      {targetStr}
    </div>
  );
};
