"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import confetti from "canvas-confetti";
import { ACHIEVEMENTS, IAchievementDef } from "@/constants";
import { useAppContext } from "@/context/app-context";
import { getBDTime, getEffectiveBDDateStr } from "@/utils/time";

export const useAchievements = () => {
  const { state } = useAppContext();
  const [activeToast, setActiveToast] = useState<IAchievementDef | null>(null);
  const shownRef = useRef<Set<string>>(new Set());

  const stats = useMemo(() => {
    const totalTasks = state.tasks.length;
    const doneTasks = state.tasks.filter((t) => t.status === "DONE");
    const completedCount = doneTasks.length;
    let todayTime = 0;
    doneTasks.forEach((t) => (todayTime += Number(t.actualTime) || 0));

    const currentEffectiveDate = getEffectiveBDDateStr();
    const bdTime = getBDTime();
    if (bdTime.getHours() < 6) bdTime.setDate(bdTime.getDate() - 1);
    const todayObj = new Date(currentEffectiveDate);

    let weeklyTime = todayTime;
    let monthlyTime = todayTime;

    state.history.forEach((record) => {
      const recTimeSpent = Number(record.timeSpent ?? record.totalTime) || 0;
      const recDateStr = record.date || record.dateKey;
      if (!recDateStr) return;
      const recDate = new Date(recDateStr);
      const diffTime = Math.abs(todayObj.getTime() - recDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) weeklyTime += recTimeSpent;
      if (diffDays <= 30) monthlyTime += recTimeSpent;
    });

    return {
      todayTime: todayTime || 0,
      todayCompleted: completedCount || 0,
      todayTotal: totalTasks || 0,
      weeklyTime: weeklyTime || 0,
      monthlyTime: monthlyTime || 0,
    };
  }, [state.tasks, state.history]);

  // Restore session storage shown state
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("shownAchievements");
      if (stored) {
        shownRef.current = new Set(JSON.parse(stored));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!state.isLoaded) return;

    for (const achievement of ACHIEVEMENTS) {
      if (shownRef.current.has(achievement.id)) continue;
      
      if (achievement.check(stats)) {
        shownRef.current.add(achievement.id);
        try {
          sessionStorage.setItem("shownAchievements", JSON.stringify([...shownRef.current]));
        } catch {}
        
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveToast(achievement);
        fireConfettiBurst();
        break; // Show one at a time per render
      }
    }
  }, [stats, state.isLoaded]);

  return { activeToast };
};

function fireConfettiBurst() {
  const BURST_COLORS = [
    ["#ff0000", "#ff6600", "#ffcc00"],
    ["#00ccff", "#0066ff", "#6600ff"],
    ["#ff00cc", "#ff0066", "#ff3399"],
    ["#00ff66", "#00cc44", "#66ff00"],
    ["#ffcc00", "#ff9900", "#ff6600"],
  ];

  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0.6,
    decay: 0.94,
    startVelocity: 30,
    zIndex: 9999,
  };

  const burst = (x: number, y: number, count: number, colors: string[], velocity = 30, size = 1) => {
    confetti({
      ...defaults,
      particleCount: count,
      origin: { x, y },
      colors,
      startVelocity: velocity,
      scalar: size,
    });
  };

  burst(0.5, 0.4, 80, BURST_COLORS[0], 35, 1.2);
  setTimeout(() => burst(0.2, 0.5, 50, BURST_COLORS[1], 30, 1), 300);
  setTimeout(() => burst(0.8, 0.5, 50, BURST_COLORS[2], 30, 1), 600);
  setTimeout(() => burst(0.1, 0.2, 40, BURST_COLORS[3], 25, 0.8), 900);
  setTimeout(() => burst(0.9, 0.2, 40, BURST_COLORS[4], 25, 0.8), 1200);
  setTimeout(() => burst(0.3, 0.3, 60, BURST_COLORS[2], 30, 1.1), 1500);
  setTimeout(() => burst(0.7, 0.7, 60, BURST_COLORS[3], 30, 1.1), 2000);
  setTimeout(() => burst(0.15, 0.7, 35, BURST_COLORS[0], 28, 0.9), 2300);
  setTimeout(() => burst(0.85, 0.3, 35, BURST_COLORS[4], 28, 0.9), 2600);
  setTimeout(() => burst(0.5, 0.6, 50, BURST_COLORS[1], 32, 1), 2900);
  setTimeout(() => burst(0.4, 0.2, 40, BURST_COLORS[2], 26, 0.85), 3200);
}
