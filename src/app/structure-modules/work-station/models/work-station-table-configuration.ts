import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const WORK_STATION_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['descripcion', 'departamento_text', 'rol_text'],
  columnsName: ['Descripción', 'Departamento', 'Rol'],
  tableFilters: [
    {
      name: 'descripcion',
      type: 'text',
      title: 'Descripción',
    },
    {
      name: 'nivel__id',
      title: 'Ubicación Organizacional',
      type: 'select',
      items: [],
    },
    {
      name: 'unidad__id',
      type: 'select',
      title: 'Unidad de Salud',
      items: [],
    },
    {
      name: 'departamento__id',
      type: 'select',
      title: 'Departamento',
      items: [],
    },
    {
      name: 'rol__id',
      type: 'select',
      title: 'Rol',
      items: [],
    },
  ],
};
