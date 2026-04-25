import { Button } from "@/components/atoms";
import { IVaultHeaderProps } from "@/types";
import { Library, Plus, Search } from "lucide-react";
import React from "react";

const VaultHeader: React.FC<IVaultHeaderProps> = ({
  totalResources,
  searchQuery,
  onSearchChange,
  onAddClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base_color/40 backdrop-blur-xl px-3 py-2 rounded-2xl border border-border_color shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary_color/10 flex items-center justify-center text-primary_color">
          <Library className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-display font-black text-heading_color tracking-tight">
            Resource Vault
          </h2>
          <p className="text-sm text-heading_color_secondary font-medium">
            {totalResources} assets created
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-disable_color" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2.5 bg-base_color/50 border border-border_color/50 rounded-2xl focus:ring-4 focus:ring-primary_color/5 focus:border-primary_color outline-none transition-all text-sm font-medium text-heading_color"
          />
        </div>
        <Button
          onClick={onAddClick}
          className="bg-primary_color hover:bg-primary_color/90 text-white p-2.5 rounded-2xl shadow-lg shadow-primary_color/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default VaultHeader;
