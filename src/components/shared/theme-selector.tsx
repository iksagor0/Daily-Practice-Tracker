"use client";

import { useAppContext } from "@/context/app-context";
import { THEMES } from "@/data/themes";
import { cn } from "@/utils/cn";
import { Check, Palette } from "lucide-react";
import React from "react";

const ThemeSelector: React.FC = () => {
  const { state, dispatch } = useAppContext();

  return (
    <div className="bg-base_color/50 backdrop-blur-xl rounded-3xl p-6 border border-border_color shadow-xl shadow-base_color/10">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-5 h-5 text-primary_color" />
        <h2 className="text-lg font-display font-bold text-heading_color">
          Theme Store
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => dispatch({ type: "SET_THEME", payload: theme.id })}
            className={cn(
              "relative flex flex-col items-start gap-2 p-3 rounded-2xl border transition-all duration-300 active:scale-95 group overflow-hidden cursor-pointer",
              state.theme === theme.id
                ? "bg-base_color border-primary_color shadow-md shadow-primary_color/10"
                : "bg-base_color/40 border-border_color/50 hover:border-primary_color/20 hover:bg-base_color/60",
            )}
          >
            {/* Theme Preview Dots */}
            <div className="flex gap-1">
              {theme.colors.map((color, idx) => (
                <div key={idx} className={cn("w-3 h-3 rounded-full", color)} />
              ))}
            </div>

            <span
              className={cn(
                "text-xs font-bold tracking-wide uppercase transition-colors",
                state.theme === theme.id
                  ? "text-primary_color"
                  : "text-heading_color_secondary group-hover:text-heading_color",
              )}
            >
              {theme.name}
            </span>

            {state.theme === theme.id && (
              <div className="absolute top-2 right-2">
                <Check className="w-3 h-3 text-primary_color" />
              </div>
            )}

            {/* Subtle Gradient Background on Hover */}
            <div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none bg-linear-to-br",
                theme.colors[0],
                theme.colors[1],
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
