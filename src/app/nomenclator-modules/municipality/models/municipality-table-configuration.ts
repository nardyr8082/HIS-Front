import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const MUNICIPALITY_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre', 'province'],
  columnsName: ['Nombre', 'Provincia'],
  tableFilters: [
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
    },
    {
      name: 'province',
      type: 'text',
      title: 'Provincia',
    },
  ],
};
