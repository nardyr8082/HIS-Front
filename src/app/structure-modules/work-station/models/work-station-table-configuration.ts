import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const ROLE_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['rol', 'departamento', 'descripcion'],
  columnsName: ['Rol', 'Departamento', 'Descripcion'],
  tableFilters: [
    {
      name: 'role',
      type: 'text',
      title: 'Rol',
    },
    {
      name: 'departamento',
      type: 'text',
      title: 'Departamento',
    },
    {
      name: 'descripcion',
      type: 'text',
      title: 'Descripcion',
    },
  ],
};
