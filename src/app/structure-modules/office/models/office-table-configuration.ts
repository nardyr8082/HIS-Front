import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const ORG_LEVEL_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre', 'unidad'],
  columnsName: ['Nombre', 'Unidad de Salud'],
  tableFilters: [
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
    },
    {
      name: 'unidad',
      type: 'text',
      title: 'Unidad de Salud',
    },
  ],
};
