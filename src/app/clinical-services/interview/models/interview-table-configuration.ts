import { TableConfiguration } from '../../../shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const INTERVIEW_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['descripcion', 'sesion_clinica'],
  columnsName: ['Descripción', 'Sesión clínica'],

  tableFilters: [

    {
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',

    },
    {
      name: 'sesion_clinica',
      title: 'Sesión clínica',
      type: 'select',
      items: []

    }
  ]
};
