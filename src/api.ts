import type { ApiErrorResponse, EmissionResponse } from "./types";

export class ApiError extends Error {
  public readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const DEFAULT_BASE_URL = "https://api.giftasset.pro";
const DEFAULT_EMISSION_PATH = "/api/a/api/v1/gifts/get_gifts_collections_emission";

function buildUrl(path: string): string {
  const base = (import.meta.env.VITE_GIFTASSET_BASE_URL as string | undefined)
    ?.trim()
    .replace(/\/$/, "");
  const baseUrl = base && base.length > 0 ? base : DEFAULT_BASE_URL;
  return new URL(path, baseUrl).toString();
}

export async function fetchCollectionsEmission(
  signal?: AbortSignal,
): Promise<EmissionResponse> {
  const apiKey = (import.meta.env.VITE_GIFTASSET_API_KEY as string | undefined)?.trim();
  const bearer = (
    import.meta.env.VITE_GIFTASSET_BEARER_TOKEN as string | undefined
  )?.trim();

  const headers = new Headers();
  headers.set("Accept", "application/json");

  // GiftAsset auth (no secrets committed): set these via .env
  if (apiKey && apiKey.length > 0) headers.set("X-API-KEY", apiKey);
  if (bearer && bearer.length > 0) headers.set("Authorization", `Bearer ${bearer}`);

  const url = buildUrl(DEFAULT_EMISSION_PATH);
  const res = await fetch(url, {
    method: "GET",
    headers,
    signal,
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    if (isJson) {
      const parsed = (await res.json()) as ApiErrorResponse;
      throw new ApiError(parsed.error ?? `HTTP ${res.status}`, res.status);
    }
    throw new ApiError(`HTTP ${res.status}`, res.status);
  }

  if (!isJson) throw new ApiError("Unexpected response type", res.status);

  const data = (await res.json()) as EmissionResponse | ApiErrorResponse;
  if (typeof data === "object" && data !== null && "error" in data) {
    throw new ApiError((data as ApiErrorResponse).error, res.status);
  }

  return data as EmissionResponse;
}
