import "server-only";

const engineURL = process.env.GO_ENGINE_URL ?? "http://127.0.0.1:8080";

export interface EngineStream {
  id: string;
  status?: string;
  [key: string]: unknown;
}

export interface EngineMetrics {
  [key: string]: unknown;
}

export class GoEngineError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GoEngineError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  headers.set("X-Internal-Request", "restreamer-control-plane");

  if (process.env.GO_ENGINE_TOKEN) {
    headers.set("Authorization", `Bearer ${process.env.GO_ENGINE_TOKEN}`);
  }

  const response = await fetch(new URL(path, engineURL), {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new GoEngineError(
      `Go engine request failed (${response.status})${detail ? `: ${detail}` : ""}`,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function startStream(id: string): Promise<EngineStream> {
  return request<EngineStream>(`/engine/streams/${encodeURIComponent(id)}/start`, {
    method: "POST",
  });
}

export function stopStream(id: string): Promise<EngineStream> {
  return request<EngineStream>(`/engine/streams/${encodeURIComponent(id)}/stop`, {
    method: "POST",
  });
}

export function getEngineMetrics(): Promise<EngineMetrics> {
  return request<EngineMetrics>("/engine/metrics");
}
