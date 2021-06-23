import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const HEALTH_UNIT_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre', 'levels_string', 'direccion'],
  columnsName: ['Nombre', 'Nivel', 'Direccion'],
  tableFilters: [
    {
      name: 'nombre',
      type: 'text',
      title: 'Descripción',
    },
    {
      name: 'levels_string',
      type: 'text',
      title: 'Nivel',
    },
    {
      name: 'direccion',
      type: 'text',
      title: 'Direccion',
    },
  ],
};
