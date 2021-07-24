import { TableConfiguration } from '../../../shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const WAREHOUSE_RECEIVED_TRANSFER_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['movimiento', 'movimiento_origen'],
  columnsName: ['Movimiento', 'Movimiento origen'],

  tableFilters: [

    {
      name: 'movimiento',
      title: 'Movimiento',
      type: 'select',
      items: []

    }, {
      name: 'movimiento_origen',
      title: 'Movimiento origen',
      type: 'select',
      items: []
    }


  ]
};
