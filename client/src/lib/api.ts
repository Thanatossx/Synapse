/** Boş = aynı origin (lokalde Vite proxy). Production'da Vercel'de Render URL'i: VITE_API_BASE */
function apiBase(): string {
  const raw = import.meta.env.VITE_API_BASE as string | undefined;
  if (!raw) return "";
  return raw.replace(/\/+$/, "");
}

const BASE = apiBase();

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || res.statusText);
  }
  return res.json() as Promise<T>;
}

export async function apiSend<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null },
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const res = await fetch(`${BASE}${path}`, {
    method: options.method || "POST",
    headers,
    body: options.body != null ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
