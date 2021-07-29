import { TableConfiguration } from 'src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const DIAGNOSTIC_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['descripcion', 'sesion_clinica'],
  columnsName: ['Descripción', 'Sesión Clínica'],
  tableFilters: [
    {
      name: 'descripcion',
      type: 'text',
      title: 'Descripción',
    },
    {
      name: 'sesion_clinica',
      title: 'Sesión Clínica',
      type: 'select',
      items: [],
    },
  ],
};
