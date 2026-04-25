import { useAppContext } from "@/context/app-context";
import { useAchievements } from "@/hooks/use-achievements";
import { getBDTime, getEffectiveBDDateStr } from "@/utils/time";
import {
  Award,
  BarChart2,
  Clock,
  Flame,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { ProgressSvg } from "../atoms/custom-icons";
import QuoteCard from "../shared/quote-card";
import ThemeSelector from "../shared/theme-selector";

const AnalyticsDashboard: React.FC = () => {
  const { state } = useAppContext();
  const { activeToast } = useAchievements();
  const [mounted, setMounted] = useState(false);

  // stats calculation remains the same
  const stats = useMemo(() => {
    const currentEffectiveDate = getEffectiveBDDateStr();

    // Filter tasks for Today's Progress calculation
    const todayTasks = state.tasks.filter((t) => {
      if (t.status === "DONE") {
        if (t.completedAt) {
          return getEffectiveBDDateStr(t.completedAt) === currentEffectiveDate;
        }
        return t.repeatDaily; // fallback for legacy tasks
      }
      return true;
    });

    const totalTasks = todayTasks.length;
    const doneTasks = todayTasks.filter((t) => t.status === "DONE");
    const completedCount = doneTasks.length;

    let todayTime = 0;
    doneTasks.forEach((t) => (todayTime += Number(t.actualTime) || 0));

    const percentage =
      totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

    const bdTime = getBDTime();
    if (bdTime.getHours() < 6) bdTime.setDate(bdTime.getDate() - 1);
    const todayObj = new Date(currentEffectiveDate);

    let totalEverTime = 0;
    const daysRecorded = state.history.length;
    let rolling7Total = todayTime;
    let rolling30Total = todayTime;

    let activeDays = 0;
    state.history.forEach((record) => {
      const recTimeSpent = Number(record.timeSpent ?? record.totalTime) || 0;
      if (recTimeSpent > 0) activeDays++;
      totalEverTime += recTimeSpent;
      const recDateStr = record.date || record.dateKey;
      if (!recDateStr) return;
      const recDate = new Date(recDateStr);
      const diffTime = Math.abs(todayObj.getTime() - recDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) rolling7Total += recTimeSpent;
      if (diffDays <= 30) rolling30Total += recTimeSpent;
    });

    if (todayTime > 0) activeDays++;

    const totalEverTimeMinutes = totalEverTime + todayTime;
    const lifetimeHours = Math.floor(totalEverTimeMinutes / 60);
    const lifetimeMins = totalEverTimeMinutes % 60;

    const overallAvg =
      daysRecorded === 0
        ? todayTime
        : Math.round((totalEverTime + todayTime) / (daysRecorded + 1));
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
      activeDays,
      lifetimeHours,
      lifetimeMins,
    };
  }, [state.tasks, state.history]);

  // Constants for Progress ring
  const radius = 70;
  const circumference = radius * 2 * Math.PI; // approx 439.8
  const offset = circumference - (stats.percentage / 100) * circumference;

  useEffect(() => {
    // Delay for initial bar growth animation
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <aside className="lg:w-[420px] lg:col-span-4 space-y-8 animate-fade-in animation-delay-500 opacity-0 fill-mode-forwards">
      <QuoteCard />

      {/* Today's Progress Card */}
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

      {activeToast && (
        <div className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-lg shadow-amber-500/10 rounded-3xl p-6 sm:p-8 flex items-center gap-5 sm:gap-6 animate-slide-up relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-white/40 to-transparent rounded-bl-full pointer-events-none"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-linear-to-tr from-orange-200/40 to-transparent rounded-full pointer-events-none blur-xl"></div>

          <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-amber-100 flex items-center justify-center text-4xl sm:text-5xl group-hover:scale-105 transition-transform duration-300 relative z-10 animate-toast-bounce">
            {activeToast.label.split(" ")[0] || "🏆"}
          </div>

          <div className="flex-1 min-w-0 relative z-10">
            <div className="text-[10px] font-bold text-amber-500 tracking-widest uppercase mb-1">
              Achievement Unlocked
            </div>
            <h3 className="font-display font-black text-amber-900 text-lg sm:text-xl leading-tight mb-1 truncate group-hover:text-amber-700 transition-colors">
              {activeToast.label
                .replace(
                  /^[\uE000-\uF8FF]|\uD83C[\uDC04-\uDF4A]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD10-\uDDFF]|🏆|💪|🔥|⚡|📅|🚀|🌟|👑|🎯|💎|🏅|🌈 /g,
                  " ",
                )
                .trim()}
            </h3>
            <p className="text-amber-700/80 text-sm font-medium line-clamp-2">
              {activeToast.desc}
            </p>
          </div>
        </div>
      )}

      {/* Performance Analytics Card */}
      <div className="bg-base_color/50 backdrop-blur-xl rounded-3xl p-6 border border-border_color shadow-xl shadow-base_color/10">
        <h2 className="text-lg font-display font-bold text-heading_color mb-5 flex items-center">
          <BarChart2 className="w-5 h-5 mr-2 text-primary_color" />
          Performance Analytics
        </h2>

        <div className="space-y-5">
          {/* Daily Avg */}
          <div>
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-sm font-semibold text-slate-600">
                Daily Average
              </span>
              <span className="text-sm font-bold text-slate-900">
                <span>{stats.overallAvg}</span>{" "}
                <span className="text-slate-500 font-normal">min</span>
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
              <span className="text-sm font-semibold text-slate-600">
                This Week Total
              </span>
              <span className="text-sm font-bold text-slate-900">
                <span>{stats.rolling7Total}</span>{" "}
                <span className="text-slate-500 font-normal">min</span>
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-400 h-full rounded-full transition-all duration-1000 delay-100"
                style={{ width: mounted ? `${stats.weekPct}%` : "0%" }}
              ></div>
            </div>
          </div>

          {/* Monthly Total */}
          <div>
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-sm font-semibold text-slate-600">
                This Month Total
              </span>
              <span className="text-sm font-bold text-slate-900">
                <span>{stats.rolling30Total}</span>{" "}
                <span className="text-slate-500 font-normal">min</span>
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-1000 delay-200"
                style={{ width: mounted ? `${stats.monthPct}%` : "0%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-border_color text-center">
          <span className="inline-flex items-center text-xs text-heading_color_secondary bg-primary_color/5 px-3 py-1 rounded-full">
            <RefreshCw className="w-3 h-3 mr-1.5" /> Resets at 6:00 AM
            Bangladesh Time
          </span>
        </div>
      </div>

      {/* Lifetime Milestones Card */}
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
            <p className="text-2xl font-display font-bold text-slate-800">
              {stats.activeDays}{" "}
              <span className="text-sm font-medium text-slate-400">days</span>
            </p>
          </div>
          <div className="bg-white/80 rounded-2xl p-4 border border-white text-center shadow-sm shadow-slate-100 group">
            <div className="w-10 h-10 mx-auto bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Total Focus
            </p>
            <p className="text-2xl font-display font-bold text-slate-800 leading-none mt-1">
              {stats.lifetimeHours}
              <span className="text-sm font-medium text-slate-400 mr-2">h</span>
              {stats.lifetimeMins}
              <span className="text-sm font-medium text-slate-400">m</span>
            </p>
          </div>
        </div>
      </div>

      <ThemeSelector />
    </aside>
  );
};

export default AnalyticsDashboard;
