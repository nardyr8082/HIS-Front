import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const WORK_STATION_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['descripcion', 'rol_text', 'departamento_text'],
  columnsName: ['Descripción', 'Rol', 'Departamento'],
  tableFilters: [
    {
      name: 'descripcion',
      type: 'text',
      title: 'Descripción',
    },
    {
      name: 'rol__name',
      type: 'text',
      title: 'Rol',
    },
    {
      name: 'departamento__nombre',
      type: 'text',
      title: 'Departamento',
    },
  ],
};
