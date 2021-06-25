import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const STATE_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre', 'pais'],
  columnsName: ['Nombre', 'País'],
  tableFilters: [
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
    },
    {
      name: 'pais',
      type: 'text',
      title: 'País',
    },
  ],
};
