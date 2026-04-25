import { cn } from "@/utils/cn";
import { IResourceCardProps } from "@/types";
import {
  FileText,
  Link as LinkIcon,
  Pencil,
  Trash2,
  Youtube,
} from "lucide-react";
import NextLink from "next/link";
import React from "react";

const ResourceCard: React.FC<IResourceCardProps> = ({
  resource,
  onDelete,
  onEdit,
  onCustomDragStart,
  isHidden,
}) => {
  const handleCardClick = () => {
    window.open(resource.url, "_blank", "noopener,noreferrer");
  };

  const _renderIcon = () => {
    const url = resource?.url?.toLowerCase();

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return <Youtube className="w-5 h-5 text-rose-500" />;
    }

    if (url.includes("docs.google.com") || url.includes("drive.google.com")) {
      return <FileText className="w-5 h-5 text-primary_color" />;
    }

    if (url.endsWith(".pdf")) {
      return <FileText className="w-5 h-5 text-orange-500" />;
    }

    return <LinkIcon className="w-5 h-5 text-primary_color" />;
  };

  return (
    <div
      onClick={handleCardClick}
      data-resource-id={resource.id}
      className={cn(
        "group relative bg-base_color/60 backdrop-blur-xl rounded-xl border border-border_color p-4 transition-all duration-300 hover:shadow-md hover:bg-base_color/90 hover:border-primary_color hover:shadow-primary_color/5 flex flex-col gap-2 cursor-pointer",
        {
          "opacity-0 invisible": isHidden,
          "opacity-100": !isHidden,
        },
      )}
    >
      {/* Drag Handles */}
      <div
        onPointerDown={(e) => onCustomDragStart?.(e, resource.id)}
        className="absolute top-0 left-0 right-0 h-4 cursor-move z-20"
      />
      <div
        onPointerDown={(e) => onCustomDragStart?.(e, resource.id)}
        className="absolute bottom-0 left-0 right-0 h-4 cursor-move z-20"
      />

      <div className="flex items-start justify-between gap-2">
        {/* icon + title + url */}
        <div className="flex-1 flex items-center gap-3 overflow-hidden min-w-0">
          <div className="shrink-0 w-10 h-10 rounded-2xl bg-primary_color/5 flex items-center justify-center border border-border_color/50 group-hover:bg-primary_color/10 transition-colors">
            {_renderIcon()}
          </div>
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <h3 className="font-display font-semibold text-heading_color leading-tight line-clamp-1 transition-colors">
              {resource.title}
            </h3>
            <NextLink
              href={resource.url}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-semibold text-heading_color/50 break-all line-clamp-2"
            >
              {resource.url.replace(/^https?:\/\/(www\.)?/, "")}
            </NextLink>
          </div>
        </div>

        {/* actions */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(resource);
            }}
            className="text-disable_color hover:text-primary_color hover:bg-primary_color/5 transition-all opacity-0 group-hover:opacity-100"
            title="Edit Resource"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(resource.id);
            }}
            className="text-disable_color hover:text-error_color hover:bg-error_bg_color transition-all opacity-0 group-hover:opacity-100"
            title="Delete Resource"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* tags */}
      {resource?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {resource?.tags?.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded-lg text-[9px] font-medium bg-primary_color/5 text-primary_color/80 border border-primary_color/10"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Hover Background Accent */}
      <div className="absolute inset-0 bg-linear-to-br from-primary_color/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity pointer-events-none -z-10" />
    </div>
  );
};

export default ResourceCard;
