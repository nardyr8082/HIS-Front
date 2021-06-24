import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const WORK_STATION_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['rol_text', 'departamento_text', 'descripcion'],
  columnsName: ['Rol', 'Departamento', 'Descripción'],
  tableFilters: [
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
    {
      name: 'descripcion',
      type: 'text',
      title: 'Descripción',
    },
  ],
};
