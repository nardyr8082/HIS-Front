import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const WarehouseInventoryDifference_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['dif_cantidad', 'dif_importe', 'conteo'],
  columnsName: ['Dif cantidad', 'Dif importe', 'Conteo'],
  tableFilters: [
    {
      name: 'dif_cantidad',
      type: 'number',
      title: 'Dif cantidad',
    },
    {
      name: 'dif_importe',
      type: 'number',
      title: 'Dif importe',
    },
    {
      name: 'conteo',
      title: 'Conteo',
      type: 'select',
      items: [],
    }
  ],
};
