import { IResource } from "@/models";
import { IAddResourceModalProps } from "@/types";
import { getTitleFromUrl, processTags } from "@/utils";
import { X } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Button, Modal } from "../atoms";

const AddResourceModal: React.FC<IAddResourceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  allTags,
  initialResource,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tags, setTags] = useState(initialResource?.tags?.join(", ") || "");
  const [title, setTitle] = useState(initialResource?.title || "");
  const [url, setUrl] = useState(initialResource?.url || "");

  const lastTag = useMemo(() => {
    return tags.split(",").pop()?.trim().toLowerCase() || "";
  }, [tags]);

  const filteredSuggestions = useMemo(() => {
    if (!lastTag || !allTags) return [];
    const currentTags = tags
      .toLowerCase()
      .split(",")
      .map((t) => t.trim());
    return allTags
      .filter(
        (tag) =>
          tag.toLowerCase().includes(lastTag) &&
          !currentTags.includes(tag.toLowerCase()),
      )
      .slice(0, 5);
  }, [allTags, lastTag, tags]);

  const handleSuggestionClick = (suggestion: string) => {
    const tagParts = tags.split(",").map((t) => t.trim());
    tagParts.pop(); // Remove the partial tag
    tagParts.push(suggestion);
    setTags(tagParts.join(", ") + ", ");
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      alert("Please enter a URL.");
      return;
    }

    const processedTags = processTags(tags) || [];
    const extractedTitle = title || getTitleFromUrl(url);

    const resourceData: Partial<IResource> = {
      title: extractedTitle || url.trim(),
      url: url.trim(),
      tags: processedTags,
    };

    onSubmit(resourceData);

    if (!initialResource) {
      setTags("");
      setTitle("");
      setUrl("");
    }
  };

  const _renderSuggestions = () => {
    if (!showSuggestions || filteredSuggestions.length === 0) return null;

    return (
      <div className="absolute z-50 w-full mt-1 bg-base_color border border-border_color rounded-xl shadow-xl overflow-hidden animate-scale-in">
        <div className="p-2 flex flex-wrap gap-1.5 bg-primary_color/5">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-base_color text-primary_color border border-primary_color/10 hover:border-primary_color/30 hover:bg-primary_color/5 hover:scale-105 transition-all active:scale-95 shadow-sm"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={false}
      overlayStyle={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="bg-base_color rounded-4xl shadow-2xl w-[90%] max-w-md border border-border_color relative overflow-hidden flex flex-col animate-scale-in">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary_color/5 rounded-bl-[100px] -z-10"></div>

        <div className="shrink-0 flex items-center justify-between p-5 md:px-8 border-b border-border_color/50">
          <div>
            <h2 className="text-2xl font-display font-black text-heading_color tracking-tight leading-tight">
              {initialResource ? "Edit Resource" : "Add Resource"}
            </h2>
            <p className="text-heading_color_secondary text-sm font-medium mt-1">
              Save your learning assets.
            </p>
          </div>
          <Button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-primary_color/5 text-disable_color hover:text-heading_color hover:bg-primary_color/10 transition-all"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:px-8 space-y-5">
          <div>
            <label className="block text-sm font-extrabold tracking-tight text-heading_color_secondary mb-2">
              Resource URL <span className="text-error_color">*</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full px-4 py-3.5 bg-primary_color/5 border border-border_color/50 rounded-2xl focus:ring-4 focus:ring-primary_color/10 focus:border-primary_color hover:border-primary_color/30 outline-none transition-all placeholder:text-disable_color font-medium text-heading_color"
            />
          </div>

          <div>
            <label className="block text-sm font-extrabold tracking-tight text-heading_color_secondary mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. React Documentation"
              className="w-full px-4 py-3.5 bg-primary_color/5 border border-border_color/50 rounded-2xl focus:ring-4 focus:ring-primary_color/10 focus:border-primary_color hover:border-primary_color/30 outline-none transition-all placeholder:text-disable_color font-medium text-heading_color"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-extrabold tracking-tight text-heading_color_secondary mb-2">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="e.g. Tutorial, IELTS, Exam..."
              className="w-full px-4 py-3.5 bg-primary_color/5 border border-border_color/50 rounded-2xl focus:ring-4 focus:ring-primary_color/10 focus:border-primary_color hover:border-primary_color/30 outline-none transition-all placeholder:text-disable_color font-medium text-heading_color"
            />
            {_renderSuggestions()}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-primary_color hover:bg-primary_color/90 text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm hover:shadow-primary_color/25 text-[15px] transition-all"
            >
              {initialResource ? "Save Changes" : "Add to Vault"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddResourceModal;
