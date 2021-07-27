import { TableConfiguration } from '../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../app/core/models/api-response.model';
export const Register_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['sesion_clinica_string'],
  columnsName: ['Sesión Clínica'],
  tableFilters: [
    {
      name: 'sesion_clinica',
      title: 'Sesión Clínica',
      type: 'select',
      items: [],
    },
  ],
};
