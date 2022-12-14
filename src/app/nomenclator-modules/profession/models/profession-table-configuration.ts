import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const PROFESSION_TABLE_CONFIGURATION = {
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
