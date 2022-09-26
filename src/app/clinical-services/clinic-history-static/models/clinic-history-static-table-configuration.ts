import { TableConfiguration } from '../../../shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const CLINIC_HISTORY_STATIC_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['numero_hc', 'paciente','fecha_solicitud','fecha_realizacion','medico_realiza_string'],
  columnsName: ['Numero hc', 'Paciente','Fecha Solicitud','Fecha Realización','Médico Realiza'],

  tableFilters: [

    {
      name: 'numero_hc',
      title: 'Numero',
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
