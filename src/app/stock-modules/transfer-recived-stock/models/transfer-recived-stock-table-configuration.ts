import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const TRANSFER_RECIVED_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['movimiento_string', 'movimiento_origen_string'],
  columnsName: ['Movimiento', 'Movimiento Origen'],
  tableFilters: [
    {
      name: 'movimiento',
      type: 'select',
      title: 'Movimiento',
      items: [],
    },
    {
      name: 'movimiento_origen',
      title: 'Movimiento Origen',
      type: 'select',
      items: [],
    },
  ],
};
