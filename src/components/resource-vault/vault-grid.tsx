import { IVaultGridProps } from "@/types";
import { Library } from "lucide-react";
import React from "react";
import ResourceCard from "./resource-card";

const VaultGrid: React.FC<IVaultGridProps> = ({
  resources,
  onDelete,
  onEdit,
  searchQuery,
  selectedTag,
}) => {
  if (resources.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-base_color/30 backdrop-blur-sm rounded-4xl border border-dashed border-border_color text-center">
      <div className="w-16 h-16 rounded-3xl bg-primary_color/5 flex items-center justify-center text-disable_color mb-4">
        <Library className="w-8 h-8 opacity-20" />
      </div>
      <h3 className="text-lg font-bold text-heading_color">
        No resources found
      </h3>
      <p className="text-sm text-disable_color mt-1 max-w-[250px]">
        {searchQuery || selectedTag
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Start building your knowledge vault by adding links and study materials."}
      </p>
    </div>
  );
};

export default VaultGrid;
