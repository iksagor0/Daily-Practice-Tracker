import { useAchievements } from "@/hooks/use-achievements";
import React from "react";

const AchievementUnlocked: React.FC = () => {
  const { activeToast } = useAchievements();

  if (!activeToast) return null;

  return (
    <div className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-lg shadow-amber-500/10 rounded-3xl p-6 sm:p-8 flex items-center gap-5 sm:gap-6 animate-slide-up relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-white/40 to-transparent rounded-bl-full pointer-events-none"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-linear-to-tr from-orange-200/40 to-transparent rounded-full pointer-events-none blur-xl"></div>

      <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-amber-100 flex items-center justify-center text-4xl sm:text-5xl group-hover:scale-105 transition-transform duration-300 relative z-10 animate-toast-bounce">
        {activeToast?.label?.split(" ")[0] || "🏆"}
      </div>

      <div className="flex-1 min-w-0 relative z-10">
        <div className="text-[10px] font-bold text-amber-500 tracking-widest uppercase mb-1">
          Achievement Unlocked
        </div>
        <h3 className="font-display font-black text-amber-900 text-lg sm:text-xl leading-tight mb-1 truncate group-hover:text-amber-700 transition-colors">
          {activeToast?.label
            ?.replace(
              /^[\uE000-\uF8FF]|\uD83C[\uDC04-\uDF4A]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD10-\uDDFF]|🏆|💪|🔥|⚡|📅|🚀|🌟|👑|🎯|💎|🏅|🌈 /g,
              " ",
            )
            .trim()}
        </h3>
        <p className="text-amber-700/80 text-sm font-medium line-clamp-2">
          {activeToast?.desc}
        </p>
      </div>
    </div>
  );
};

export default AchievementUnlocked;
