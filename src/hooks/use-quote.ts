import { useState, useEffect, useCallback } from "react";
import { IQuote } from "@/models";
import { fetchApi } from "@/utils/api";
import BANGLA_QUOTES from "@/data/bangla-quotes.json";

/**
 * Custom hook to fetch a random quote.
 * Supports localization for Bangla-speaking regions.
 * @returns Quote data, loading state, error, and refresh function.
 */
export const useQuote = () => {
  const [quote, setQuote] = useState<IQuote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getQuote = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Detect region (Bangladesh or West Bengal/India)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isBanglaRegion =
      timeZone === "Asia/Dhaka" ||
      timeZone === "Asia/Kolkata" ||
      navigator.language.startsWith("bn");

    if (isBanglaRegion) {
      // Pick random from local data
      const randomIndex = Math.floor(Math.random() * BANGLA_QUOTES.length);
      setQuote(BANGLA_QUOTES[randomIndex] as IQuote);
      setLoading(false);
      return;
    }

    try {
      const data = await fetchApi<{ quote: string; author: string }>(
        "https://dummyjson.com/quotes/random",
      );

      setQuote({
        text: data.quote,
        author: data.author,
      });
    } catch (err) {
      setError("Failed to fetch inspiration");
      setQuote({
        text: "The best way to predict the future is to create it.",
        author: "Peter Drucker",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getQuote();
  }, [getQuote]);

  return { quote, loading, error, refreshQuote: getQuote };
};
