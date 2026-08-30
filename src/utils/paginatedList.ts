export interface PaginatedList<T> {
  results: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Backend list endpoints may return a bare array or
 * `{ results, total, page, limit }`. Normalize both.
 */
export function unwrapListData<T>(data: unknown, fallbackPage = 1, fallbackLimit = 0): PaginatedList<T> {
  if (Array.isArray(data)) {
    return {
      results: data as T[],
      total: data.length,
      page: fallbackPage,
      limit: fallbackLimit || data.length,
    };
  }

  const payload = data as { results?: T[]; total?: number; page?: number; limit?: number } | null | undefined;
  const results = Array.isArray(payload?.results) ? payload.results : [];

  return {
    results,
    total: Number(payload?.total) || results.length,
    page: Number(payload?.page) || fallbackPage,
    limit: Number(payload?.limit) || fallbackLimit || results.length,
  };
}
