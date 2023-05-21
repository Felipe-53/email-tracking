import { env } from "../env";

export async function fetchJson<T>(endpoint: string, options: RequestInit) {
  const token = localStorage.getItem("token");

  const response = await fetch(env.baseUrl + endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });

  const json = (await response.json()) as T;

  return json;
}
