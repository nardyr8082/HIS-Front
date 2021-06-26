export interface FilterTable {
  type: 'text' | 'number' | 'select';
  name: string;
  title: string;
  items?: Array<ItemFilter>;
}

interface ItemFilter {
  id: any;
  name: string;
}

export interface FilterResponse {
  name: string;
  result: any;
}
