import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const WORK_STATION_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['descripcion', 'rol_text', 'departamento_text'],
  columnsName: ['Descripción', 'Grupo', 'Departamento'],
  tableFilters: [
    {
      name: 'descripcion',
      type: 'text',
      title: 'Rol',
    },
    {
      name: 'rol_text',
      type: 'text',
      title: 'Grupo',
    },
    {
      name: 'departamento_text',
      type: 'text',
      title: 'Departamento',
    },
  ],
};
