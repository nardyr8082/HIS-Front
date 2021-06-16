export interface FilterTable {
  type: 'text' | 'number' | 'select';
  name: string;
  title: string;
}

export interface FilterResponse {
  name: string;
  result: any;
}
