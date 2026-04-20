"use client";

import { useAppContext } from "@/context/app-context";
import { cn } from "@/utils/cn";
import { Check, Palette } from "lucide-react";
import React from "react";

const THEMES = [
  {
    id: "default",
    name: "Modern Sky",
    colors: ["bg-sky-500", "bg-emerald-500"],
  },
  {
    id: "sakura",
    name: "Sakura Blossom",
    colors: ["bg-[#ec4899]", "bg-[#f472b6]"],
  },
  {
    id: "ocean",
    name: "Tropical Ocean",
    colors: ["bg-[#0d9488]", "bg-[#2dd4bf]"],
  },
  {
    id: "earth",
    name: "Desert Earth",
    colors: ["bg-[#b45309]", "bg-[#fbbf24]"],
  },
  {
    id: "mint",
    name: "Emerald Mint",
    colors: ["bg-[#059669]", "bg-[#10b981]"],
  },
  {
    id: "aurora",
    name: "Arctic Aurora",
    colors: ["bg-[#22d3ee]", "bg-[#a7f3d0]"],
  },
  {
    id: "sunset",
    name: "Sunset Mirage",
    colors: ["bg-[#f97316]", "bg-[#fbbf24]"],
  },
  {
    id: "forest",
    name: "Forest Serenity",
    colors: ["bg-[#16a34a]", "bg-[#854d0e]"],
  },
  {
    id: "nordic",
    name: "Nordic Minimal",
    colors: ["bg-[#576d65]", "bg-[#f2f2ef]"],
  },
  {
    id: "lavender",
    name: "Soft Lavender",
    colors: ["bg-[#8b5cf6]", "bg-[#ec4899]"],
  },
] as const;

const ThemeSelector: React.FC = () => {
  const { state, dispatch } = useAppContext();

  return (
    <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-xl shadow-slate-200/40">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-5 h-5 text-brand-500" />
        <h2 className="text-lg font-display font-bold text-slate-900">
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
                ? "bg-white border-brand-500 shadow-md shadow-brand-500/10"
                : "bg-white/40 border-slate-200 hover:border-brand-200 hover:bg-white/60",
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
                  ? "text-brand-600"
                  : "text-slate-500 group-hover:text-slate-700",
              )}
            >
              {theme.name}
            </span>

            {state.theme === theme.id && (
              <div className="absolute top-2 right-2">
                <Check className="w-3 h-3 text-brand-500" />
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
