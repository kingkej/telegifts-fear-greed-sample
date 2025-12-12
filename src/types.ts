export interface ApiErrorResponse {
  error: string;
}

export interface EmissionStats {
  deleted: number;
  emission: number;
  hidden: number;
  refunded: number;
  unique_owners: number;
  upgraded: number;
  top_30_whales_hold?: number | null;
}

export type CollectionsMapResponse<T> =
  | Record<string, T>
  | {
      collections?: Record<string, T> | null;
    };

export type EmissionResponse = CollectionsMapResponse<EmissionStats>;

export function extractCollectionsMap<T>(
  payload: CollectionsMapResponse<T> | null | undefined,
): Record<string, T> {
  if (!payload || typeof payload !== "object") return {};
  if (!Array.isArray(payload) && "collections" in payload) {
    return (payload as { collections?: Record<string, T> | null }).collections ?? {};
  }
  return payload as Record<string, T>;
}
