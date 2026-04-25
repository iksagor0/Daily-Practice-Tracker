import { IVaultFiltersProps } from "@/types";
import { cn } from "@/utils/cn";
import { Tag } from "lucide-react";
import React from "react";

const VaultFilters: React.FC<IVaultFiltersProps> = ({
  allTags,
  selectedTag,
  onTagSelect,
}) => {
  if (allTags.length === 0) return null;

  return (
    <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar p-1">
      <div className="flex items-center gap-2 text-disable_color mr-2 whitespace-nowrap">
        <Tag className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">
          Filter:
        </span>
      </div>
      <button
        onClick={() => onTagSelect(null)}
        className={cn(
          "px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border",
          !selectedTag
            ? "bg-primary_color text-white border-primary_color shadow-md shadow-primary_color/20"
            : "bg-base_color/50 text-heading_color_secondary border-border_color/50 hover:border-primary_color/30",
        )}
      >
        All Assets
      </button>
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          className={cn(
            "px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border",
            selectedTag === tag
              ? "bg-primary_color text-white border-primary_color shadow-md shadow-primary_color/20"
              : "bg-base_color/50 text-heading_color_secondary border-border_color/50 hover:border-primary_color/30",
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default VaultFilters;
