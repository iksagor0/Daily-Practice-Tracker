import { useAppContext } from "@/context/app-context";
import { IAnalyticsStats } from "@/types/analytics.types";
import { getEffectiveBDDateStr } from "@/utils/time";
import { useMemo } from "react";

/**
 * Custom hook to calculate analytics statistics.
 * Complexity: O(N) where N is the length of history.
 */
export const useAnalyticsStats = (): IAnalyticsStats => {
  const { state } = useAppContext();

  return useMemo(() => {
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
      activeDays,
      avgPct,
      completedCount,
      lifetimeHours,
      lifetimeMins,
      monthPct,
      overallAvg,
      percentage,
      rolling30Total,
      rolling7Total,
      todayTime,
      totalTasks,
      weekPct,
    };
  }, [state.tasks, state.history]);
};
