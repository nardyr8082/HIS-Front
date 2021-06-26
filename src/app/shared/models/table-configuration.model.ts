import { FilterTable } from './table-filter.model';
export interface TableConfiguration {
  paginationSize: Array<number>;
  displayedColumns: Array<string>;
  columnsName: Array<string>;
  tableFilters?: Array<FilterTable>;
}
