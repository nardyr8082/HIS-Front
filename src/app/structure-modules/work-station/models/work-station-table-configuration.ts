import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const WORK_STATION_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['descripcion', 'departamento_text', 'rol_text', ],
  columnsName: [ 'Descripción', 'Departamento', 'Rol', ],
  tableFilters: [
    {
      name: 'descripcion',
      type: 'text',
      title: 'Descripción',
    },
    {
      name: 'departamento__nombre',
      type: 'text',
      title: 'Departamento',
    },
    {
      name: 'rol__name',
      type: 'text',
      title: 'Rol',
    },
  ],
};
