"use client";

import { useAppContext } from "@/context/app-context";
import { EActiveTab } from "@/types";
import { cn } from "@/utils/cn";
import React from "react";

interface INavItem {
  id: EActiveTab;
  label: string;
}

const NAV_ITEMS: INavItem[] = [
  { id: EActiveTab.TRACKER, label: "Task Tracker" },
  { id: EActiveTab.NOTEBOOK, label: "Notebook" },
];

const TabNavigation: React.FC = () => {
  const { state, dispatch } = useAppContext();

  const handleTabChange = (tab: EActiveTab) => {
    dispatch({ type: "SET_ACTIVE_TAB", payload: tab });
  };

  return (
    <nav className="flex justify-center border-b border-solid border-black/5 pb-2">
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = state.activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={cn(
                "px-5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ease-out relative",
                {
                  "bg-brand-600/10 text-brand-600": isActive,
                  "text-slate-500 hover:text-slate-700 hover:bg-slate-100": !isActive,
                },
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TabNavigation;
