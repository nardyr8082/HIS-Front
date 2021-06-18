import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const COUNTRY_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre'],
  columnsName: ['Nombre'],
  tableFilters: [
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
    },
  ],
};
