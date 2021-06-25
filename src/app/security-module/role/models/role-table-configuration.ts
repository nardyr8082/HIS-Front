import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const ROLE_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['name', 'permissions_string'],
  columnsName: ['Nombre', 'Permisos'],
  tableFilters: [
    {
      name: 'name',
      type: 'text',
      title: 'Nombre',
    },
  ],
};
