import { TableConfiguration } from '../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../app/core/models/api-response.model';
export const Pinpaciente_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre', 'nro_identificacion'],
  columnsName: ['Nombre', 'Identificación'],
  tableFilters: [
    {
      name: 'nombre',
      title: 'Nombre',
      type: 'text',
    },
    {
      name: 'nro_identificacion',
      title: 'Identificación',
      type: 'text',
    },
  ],
};
