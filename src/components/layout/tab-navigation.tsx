"use client";

import { useAppContext } from "@/context/app-context";
import { EActiveTab, INavItem } from "@/types";
import { cn } from "@/utils/cn";
import React from "react";

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
    <nav className="flex justify-center border-b border-solid border-border_color pb-2">
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
                  "bg-primary_color_weak text-primary_color": isActive,
                  "text-heading_color_secondary hover:text-heading_color hover:bg-primary_color_weak/5":
                    !isActive,
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
