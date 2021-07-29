import { TableConfiguration } from '../../../shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const CLINIC_HISTORY_STATIC_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['numero_hc', 'paciente'],
  columnsName: ['Numero hc', 'Paciente'],

  tableFilters: [

    {
      name: 'numero_hc',
      title: 'Numero_hc',
      type: 'text',

    },
    {
      name: 'paciente',
      title: 'Paciente',
      type: 'select',
      items: []

    }
  ]
};
