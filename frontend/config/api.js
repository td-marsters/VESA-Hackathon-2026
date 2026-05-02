// config/api.js
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://<app>.azurewebsites.net/api";
const FUNCTION_KEY = pronpmcess.env.EXPO_PUBLIC_FUNCTION_KEY;

export const apiFetch = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-functions-key": FUNCTION_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
};