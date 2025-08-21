export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function getAuthToken(): string | null {
  return localStorage.getItem('booksnap_token');
}

export async function api<T>(path: string, options: { method?: HttpMethod; body?: any; headers?: Record<string, string> } = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  const token = getAuthToken();
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': body instanceof FormData ? undefined as unknown as string : 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    } as any,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    localStorage.removeItem('booksnap_token');
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    let message = 'Request failed';
    try { const data = await res.json(); message = data.error || message; } catch {}
    throw new Error(message);
  }
  try { return await res.json(); } catch { return undefined as unknown as T; }
}

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem('booksnap_token', token);
  else localStorage.removeItem('booksnap_token');
}