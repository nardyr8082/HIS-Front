import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const USER_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['first_name', 'last_name', 'username', 'email', 'is_active'],
  columnsName: ['Nombre', 'Apellidos', 'Usuario', 'Correo', 'Activo'],
  tableFilters: [
    {
      name: 'first_name',
      type: 'text',
      title: 'Nombre',
    },
    {
      name: 'last_name',
      type: 'text',
      title: 'Apellido',
    },
    {
      name: 'username',
      type: 'text',
      title: 'Usuario',
    },
    {
      name: 'email',
      type: 'text',
      title: 'Correo',
    },
    {
      name: 'is_active',
      type: 'text',
      title: 'Activo',
    },
  ],
};