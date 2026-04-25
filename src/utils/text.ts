/**
 * Extracts the title from a URL by removing protocol, www, TLDs, and reversing subdomains for branding.
 * @param url The URL to extract the title from.
 * @returns The formatted title (e.g., "Google Docs" from "docs.google.com").
 * @complexity O(N) where N is the length of the URL, due to regex and split/map/filter operations.
 */
export function getTitleFromUrl(url: string) {
  if (!url) return "";

  try {
    const host = url
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split(/[/?#]/)[0];

    const parts = host.split(".");

    // If only one part, just capitalize it
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }

    // Common TLDs and second-level TLDs to filter out
    const tldParts = [
      "com",
      "org",
      "net",
      "edu",
      "gov",
      "io",
      "me",
      "dev",
      "ai",
      "co",
      "uk",
      "ca",
      "au",
    ];

    // Filter out parts that are known TLDs
    const filteredParts = parts.filter((part) => !tldParts.includes(part));

    // If all parts were TLDs or filtered out, fallback to original host (capitalized)
    if (filteredParts.length === 0) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }

    // Reverse and capitalize (e.g., docs.google -> Google Docs)
    return filteredParts
      .reverse()
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  } catch {
    return url;
  }
}

/**
 * Processes tags: splits by comma or space, removes empty, removes # if present
 * @param tags The tags to process.
 * @returns The processed tags.
 */
export function processTags(tags: string): string[] {
  return (
    tags
      .split(/[,\s]+/)
      .map((tag) => tag.trim().replace(/^#/, ""))
      .filter((tag) => tag.length > 0) || []
  );
}
