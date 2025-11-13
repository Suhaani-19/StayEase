export const API_URL = import.meta.env.VITE_API_URL;

// Example fetch wrapper
export async function fetchFromAPI(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${endpoint}`, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
