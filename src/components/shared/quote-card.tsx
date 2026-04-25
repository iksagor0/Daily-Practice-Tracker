import { useQuote } from "@/hooks/use-quote";
import { Quote as QuoteIcon } from "lucide-react";
import React from "react";

/**
 * Premium Quote Card component for daily inspiration.
 */
const QuoteCard: React.FC = () => {
  const { quote, loading } = useQuote();

  if (loading && !quote) {
    return (
      <div className="w-full bg-base_color/50 backdrop-blur-xl rounded-3xl p-6 border border-border_color shadow-xl shadow-base_color/10 animate-pulse">
        <div className="h-4 bg-primary_color/10 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-primary_color/10 rounded w-1/4"></div>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="w-full relative group perspective-1000">
      {/* Decorative Outer Glow */}
      <div className="absolute -inset-1 bg-linear-to-r from-primary_color/20 via-primary_color/10 to-primary_color/20 rounded-[32px] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

      <div className="relative w-full bg-base_color/50 backdrop-blur-xl rounded-[30px] p-7 border border-border_color shadow-2xl shadow-base_color/10 overflow-hidden animate-fade-in">
        {/* Animated Background Layer */}
        <div
          className="absolute inset-0 z-0 opacity-[0.07] mix-blend-overlay pointer-events-none grayscale brightness-125"
          style={{
            backgroundImage:
              "url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnZqejN4eDkzdWJ4eDkzdWJ4eDkzdWJ4eDkzdWJ4eDkzdWJ4eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKDkDbIDJieKbVm/giphy.gif')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Decorative Blobs */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary_color/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary_color/5 rounded-full blur-3xl animate-pulse delay-700"></div>

        <div className="relative z-10">
          {/* Stylized Quote Icon */}
          <div className="mb-4">
            <QuoteIcon className="w-10 h-10 text-primary_color/20" />
          </div>

          <p className="text-heading_color font-display font-semibold text-lg lg:text-xl leading-relaxed mb-6 tracking-tight">
            {quote.text}
          </p>

          <div className="flex items-center gap-3">
            <div className="h-[2px] w-8 bg-linear-to-r from-primary_color to-transparent rounded-full"></div>
            <p className="text-primary_color font-bold text-xs tracking-[0.15em] uppercase">
              {quote.author || "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;

