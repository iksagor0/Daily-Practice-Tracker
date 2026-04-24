import { MARKDOWN_EXAMPLE } from "@/constants/notebook.constants";
import { IEmptyStateProps } from "@/types/notebook.types";
import { Edit3, Plus } from "lucide-react";
import React from "react";
import { Button } from "../atoms";

const EmptyState: React.FC<IEmptyStateProps> = ({ onAddNote }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-base_color/50 backdrop-blur-xl rounded-3xl border border-border_color shadow-xl shadow-slate-200/10 p-8 h-full min-h-[500px]">
      <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-4 transform -rotate-6">
        <Edit3 className="w-8 h-8 text-brand-300" />
      </div>
      <h3 className="text-xl font-display font-bold text-heading_color mb-2">
        Select or create a note
      </h3>
      <p className="text-sm text-heading_color_secondary text-center max-w-sm mb-6">
        Write down your daily reflections, study notes, or brainstorm ideas
        using Markdown.
      </p>
      {onAddNote && (
        <div className="flex flex-col items-center gap-3 w-full max-w-[320px]">
          <Button
            onClick={() => onAddNote()}
            className="w-full px-6 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
          >
            <Plus className="w-5 h-5" />
            Create Note
          </Button>

          <div className="w-full space-y-1 pt-5 mt-6 border-t border-border_color opacity-70">
            <div className="flex items-center gap-1 text-heading_color_secondary font-medium">
              <span className="w-8 font-mono text-brand-500">#</span>
              <span>Main Title</span>
            </div>
            <div className="flex items-center gap-1 text-heading_color_secondary font-medium">
              <span className="w-8 font-mono text-brand-500">##</span>
              <span>Section Header</span>
            </div>
            <div className="flex items-center gap-1 text-heading_color_secondary font-medium">
              <span className="w-8 font-mono text-brand-500">###</span>
              <span>Sub-section</span>
            </div>
            <div className="flex items-center gap-1 text-heading_color_secondary font-medium">
              <span className="w-8 font-mono text-brand-500">**</span>
              <span>Bold Text</span>
              <span className="w-8 font-mono text-brand-500">**</span>
            </div>
            <div className="flex items-center gap-1 text-heading_color_secondary font-medium">
              <span className="w-8 font-mono text-brand-500">-</span>
              <span>List Item</span>
            </div>
          </div>

          <button
            onClick={() => onAddNote(MARKDOWN_EXAMPLE)}
            className="text-xs font-bold text-heading_color_secondary hover:text-brand-600 border border-border_color hover:border-brand-200 px-4 py-2 rounded-lg transition-all"
          >
            Write Example of markdown file
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
