import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const ORG_LEVEL_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre', 'nivel_padre'],
  columnsName: ['Nombre', 'Ubicación Organizacional Padre'],
  tableFilters: [
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
    },
    {
      name: 'nivel_padre',
      type: 'text',
      title: 'Ubicación Org. Padre',
    },
  ],
};
