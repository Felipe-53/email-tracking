const baseUrl = import.meta.env.VITE_BASE_URL;

export async function fetchJson<T>(endpoint: string, options: RequestInit) {
  const token = localStorage.getItem("token");

  const response = await fetch(baseUrl + endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });

  const json = (await response.json()) as T;

  return json;
}
