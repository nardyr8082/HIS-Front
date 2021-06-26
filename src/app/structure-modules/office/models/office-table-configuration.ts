import { TableConfiguration } from 'src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const ORG_LEVEL_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre', 'unidad'],
  columnsName: ['Nombre', 'Unidad de Salud'],
  tableFilters: [
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
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
  ],
};
