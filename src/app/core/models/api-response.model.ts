export interface ApiResponse<T> {
  count: number;
  next: string;
  previous: string;
  results: Array<T>;
}

export const DEFAULT_PAGE_SIZE = 2;

export const DEFAULT_PAGINATION_SIZE = [DEFAULT_PAGE_SIZE, 25, 50, 100];
