import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const ROLE_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['name', 'editable', 'permissions_string'],
  columnsName: ['Nombre', 'Editable', 'Permisos'],
  tableFilters: [
    {
      name: 'name',
      type: 'text',
      title: 'Descripción',
    },
    {
      name: 'editable',
      type: 'text',
      title: 'Editable',
    },
    {
      name: 'permissions',
      type: 'text',
      title: 'Permisos',
    },
  ],
};
