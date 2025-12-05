export const API_URL = import.meta.env.VITE_API_URL;

// Fetch wrapper with JWT support
export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  // Attach token automatically if logged in
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(errText || `API error: ${res.status}`);
  }

  return res.json();
}
