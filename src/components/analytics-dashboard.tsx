import React, { useMemo } from "react";
import { TrendingUp, Activity, Crosshair } from "lucide-react";
import { ProgressRing } from "@/shared/progress-ring";
import { useAppContext } from "@/context/app-context";
import { getBDTime, getEffectiveBDDateStr } from "@/utils/time";
import { useAchievements } from "@/hooks/use-achievements";

export const AnalyticsDashboard: React.FC = () => {
  const { state } = useAppContext();
  const { activeToast } = useAchievements();

  const stats = useMemo(() => {
    const totalTasks = state.tasks.length;
    const doneTasks = state.tasks.filter((t) => t.status === "DONE");
    const completedCount = doneTasks.length;
    
    let todayTime = 0;
    doneTasks.forEach((t) => (todayTime += Number(t.actualTime) || 0));

    const percentage = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

    const currentEffectiveDate = getEffectiveBDDateStr();
    const bdTime = getBDTime();
    if (bdTime.getHours() < 6) bdTime.setDate(bdTime.getDate() - 1);
    const todayObj = new Date(currentEffectiveDate);

    let totalEverTime = 0;
    const daysRecorded = state.history.length;
    let rolling7Total = todayTime;
    let rolling30Total = todayTime;

    state.history.forEach((record) => {
      const recTimeSpent = Number(record.timeSpent ?? record.totalTime) || 0;
      totalEverTime += recTimeSpent;
      const recDateStr = record.date || record.dateKey;
      if (!recDateStr) return;
      const recDate = new Date(recDateStr);
      const diffTime = Math.abs(todayObj.getTime() - recDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) rolling7Total += recTimeSpent;
      if (diffDays <= 30) rolling30Total += recTimeSpent;
    });

    const overallAvg = daysRecorded === 0 ? todayTime : Math.round((totalEverTime + todayTime) / (daysRecorded + 1));
    const avgPct = Math.min((overallAvg / 120) * 100, 100);
    const weekPct = Math.min((rolling7Total / 840) * 100, 100);
    const monthPct = Math.min((rolling30Total / (120 * 30)) * 100, 100);

    return {
      totalTasks: totalTasks || 0,
      completedCount: completedCount || 0,
      todayTime: todayTime || 0,
      percentage: percentage || 0,
      overallAvg: overallAvg || 0,
      rolling7Total: rolling7Total || 0,
      rolling30Total: rolling30Total || 0,
      avgPct: avgPct || 0,
      weekPct: weekPct || 0,
      monthPct: monthPct || 0,
    };
  }, [state.tasks, state.history]);

  return (
    <div className="lg:w-[420px] shrink-0 flex flex-col gap-6 animate-fade-in animation-delay-500 opacity-0 fill-mode-forwards relative z-20">
      {/* Today's Progress Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-brand-100/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50 rounded-bl-[100px] -z-10 group-hover:bg-brand-100 transition-colors"></div>
        <h2 className="text-xl font-display font-black text-slate-800 tracking-tight flex items-center gap-2 mb-8">
          Today's Progress <TrendingUp className="w-5 h-5 text-brand-500" />
        </h2>
        <div className="flex flex-col items-center justify-center mb-8 relative">
          <ProgressRing percentage={stats.percentage} />
        </div>
        <div className="grid grid-cols-3 gap-3 divide-x divide-slate-100">
          <div className="text-center group/stat hover:bg-slate-50 transition-colors rounded-xl p-2 cursor-default">
            <div className="w-8 h-8 mx-auto bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center mb-2 group-hover/stat:scale-110 transition-transform">
              <span className="text-sm font-black">✓</span>
            </div>
            <div className="text-2xl font-display font-black text-slate-800 tracking-tight">{stats.completedCount}</div>
            <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">Done</div>
          </div>
          <div className="text-center group/stat hover:bg-slate-50 transition-colors rounded-xl p-2 cursor-default">
            <div className="w-8 h-8 mx-auto bg-sky-50 text-sky-500 rounded-lg flex items-center justify-center mb-2 group-hover/stat:scale-110 transition-transform">
              <span className="text-sm font-black">⋯</span>
            </div>
            <div className="text-2xl font-display font-black text-slate-800 tracking-tight">{stats.totalTasks}</div>
            <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">Total</div>
          </div>
          <div className="text-center group/stat hover:bg-slate-50 transition-colors rounded-xl p-2 cursor-default">
            <div className="w-8 h-8 mx-auto bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center mb-2 group-hover/stat:scale-110 transition-transform">
              <span className="text-sm font-black text-center pt-0.5">⏳</span>
            </div>
            <div className="text-2xl font-display font-black text-slate-800 tracking-tight">{stats.todayTime}</div>
            <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">Min</div>
          </div>
        </div>
      </div>

      {activeToast && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-lg shadow-amber-500/10 rounded-3xl p-6 sm:p-8 flex items-center gap-5 sm:gap-6 animate-slide-up relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/40 to-transparent rounded-bl-full pointer-events-none"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-orange-200/40 to-transparent rounded-full pointer-events-none blur-xl"></div>
          
          <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-amber-100 flex items-center justify-center text-4xl sm:text-5xl group-hover:scale-105 transition-transform duration-300 relative z-10" style={{ animation: "toastBounce 0.6s ease-out 0.3s both" }}>
            {activeToast.label.split(" ")[0] || "🏆"}
          </div>
          
          <div className="flex-1 min-w-0 relative z-10">
            <div className="text-[10px] font-bold text-amber-500 tracking-widest uppercase mb-1">
              Achievement Unlocked
            </div>
            <h3 className="font-display font-black text-amber-900 text-lg sm:text-xl leading-tight mb-1 truncate group-hover:text-amber-700 transition-colors">
              {activeToast.label.replace(/^[\uE000-\uF8FF]|\uD83C[\uDC04-\uDF4A]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD10-\uDDFF]|🏆|💪|🔥|⚡|📅|🚀|🌟|👑|🎯|💎|🏅|🌈 /g, " ").trim()}
            </h3>
            <p className="text-amber-700/80 text-sm font-medium line-clamp-2">
              {activeToast.desc}
            </p>
          </div>
        </div>
      )}

      {/* Performance Analytics Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-indigo-100/30">
        <h2 className="text-xl font-display font-black text-slate-800 tracking-tight flex items-center gap-2 mb-8">
          Performance Analytics <Activity className="w-5 h-5 text-indigo-500" />
        </h2>
        <div className="space-y-6">
          {/* Daily Average */}
          <div className="group/bar cursor-default">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center">
                  <Crosshair className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-700 tracking-tight leading-tight">Avg. Daily Output</h3>
                  <div className="text-[10px] font-medium text-slate-400 mt-0.5">Per-day productivity</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-display font-black text-brand-600">{stats.overallAvg}</span>
                <span className="text-xs font-bold text-slate-400 ml-1">min</span>
              </div>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-brand-500 rounded-full transition-all duration-1000 group-hover/bar:bg-brand-400"
                style={{ width: `${stats.avgPct}%` }}
              ></div>
            </div>
          </div>

          {/* Weekly Total */}
          <div className="group/bar cursor-default">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-700 tracking-tight leading-tight">Weekly Total</h3>
                  <div className="text-[10px] font-medium text-slate-400 mt-0.5">Rolling 7 days</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-display font-black text-indigo-600">{stats.rolling7Total}</span>
                <span className="text-xs font-bold text-slate-400 ml-1">min</span>
              </div>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-1000 group-hover/bar:bg-indigo-400"
                style={{ width: `${stats.weekPct}%` }}
              ></div>
            </div>
          </div>

          {/* Monthly Total */}
          <div className="group/bar cursor-default">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-700 tracking-tight leading-tight">Monthly Total</h3>
                  <div className="text-[10px] font-medium text-slate-400 mt-0.5">Rolling 30 days</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-display font-black text-emerald-600">{stats.rolling30Total}</span>
                <span className="text-xs font-bold text-slate-400 ml-1">min</span>
              </div>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 group-hover/bar:bg-emerald-400"
                style={{ width: `${stats.monthPct}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
