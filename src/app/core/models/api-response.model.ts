export interface ApiResponse<T> {
  count: number;
  next: string;
  previous: string;
  results: Array<T>;
}
