import Link from "next/link";
import React from "react";

interface ILinkifyProps {
  readonly text: string;
}

/**
 * Detects links in text and renders them as clickable <a> tags.
 * @param text - The text to process.
 * @returns React elements with clickable links.
 */
const Linkify: React.FC<ILinkifyProps> = ({ text }) => {
  if (!text) return null;

  // Regex to match URLs starting with http:// or https://
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          return (
            <Link
              key={`${part}-${index}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              className="text-brand-600 hover:text-brand-500 transition-colors opacity-80 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </Link>
          );
        }
        return part;
      })}
    </>
  );
};

export default Linkify;
