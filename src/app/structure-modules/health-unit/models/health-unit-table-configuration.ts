import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const HEALTH_UNIT_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre', 'nivel', 'direccion'],
  columnsName: ['Nombre', 'Ubicación Organizacional', 'Direccion'],
  tableFilters: [
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
    },
    {
      name: 'nivel__nombre',
      type: 'text',
      title: 'Ubicación Organizacional',
    },
    {
      name: 'direccion',
      type: 'text',
      title: 'Direccion',
    },
  ],
};
