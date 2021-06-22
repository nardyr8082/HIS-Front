import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const HEALTH_UNIT_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['name', 'editable', 'permissions_string'],
  columnsName: ['Nombre', 'Nivel', 'Direccion'],
  tableFilters: [
    {
      name: 'name',
      type: 'text',
      title: 'Descripción',
    },
    {
      name: 'direccion',
      type: 'text',
      title: 'Direccion',
    },
    {
      name: 'nivel',
      type: 'text',
      title: 'Nivel',
    },
  ],
};
