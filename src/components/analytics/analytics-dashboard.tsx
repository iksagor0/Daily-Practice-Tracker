import { useAchievements } from "@/hooks/use-achievements";
import { useAnalyticsStats } from "@/hooks/use-analytics-stats";
import React, { useEffect, useState } from "react";
import QuoteCard from "../shared/quote-card";
import ThemeSelector from "../shared/theme-selector";
import AchievementUnlocked from "./achievement-unlocked";
import LifetimeMilestones from "./lifetime-milestones";
import PerformanceAnalytics from "./performance-analytics";
import TodayProgressCard from "./today-progress-card";

/**
 * AnalyticsDashboard component that orchestrates sub-analytics components.
 * This component handles mounting logic and global analytics layout.
 */
const AnalyticsDashboard: React.FC = () => {
  const stats = useAnalyticsStats();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay for initial bar growth animation
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <aside className="lg:w-[420px] lg:col-span-4 space-y-8 animate-fade-in animation-delay-500 opacity-0 fill-mode-forwards">
      <QuoteCard />

      {/* Today's Progress Card */}
      <TodayProgressCard mounted={mounted} stats={stats} />

      {/* Achievement Unlocked Notification */}
    <AchievementUnlocked />

      {/* Performance Analytics Card */}
      <PerformanceAnalytics mounted={mounted} stats={stats} />

      {/* Lifetime Milestones Card */}
      <LifetimeMilestones stats={stats} />

      <ThemeSelector />
    </aside>
  );
};

export default AnalyticsDashboard;
