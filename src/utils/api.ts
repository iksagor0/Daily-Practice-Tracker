/**
 * Utility for making API requests.
 * @param url - The URL to fetch data from.
 * @param options - Fetch options.
 * @returns The JSON response.
 */
export const fetchApi = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};
