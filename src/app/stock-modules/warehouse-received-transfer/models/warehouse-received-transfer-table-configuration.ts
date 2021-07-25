import { TableConfiguration } from '../../../shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const WAREHOUSE_RECEIVED_TRANSFER_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['fecha', 'numero', 'nro_control', 'transferencia_origen_string'],
  columnsName: ['Fecha', 'Número', 'Número de Control', 'Transferenca Origen'],
  tableFilters: [
    {
      name: 'fecha',
      type: 'date',
      title: 'Fecha',
    },
    {
      name: 'numero',
      title: 'Número',
      type: 'text',
    },
    {
      name: 'nro_control',
      title: 'Número de control',
      type: 'text',
    },
    {
      name: 'transferencia_origen',
      title: 'Transferencia Origen',
      type: 'select',
      items: [],
    },
  ],
};
