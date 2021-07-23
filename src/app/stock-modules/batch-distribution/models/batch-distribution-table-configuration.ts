import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const BATCH_DISTRIBUTION_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['cant_por_lote', 'lote_string', 'detalle_movimiento_string'],
  columnsName: ['Cantidad por Lote', 'Lote', 'Detalle de Movimiento'],
  tableFilters: [
    {
      name: 'cant_por_lote',
      type: 'text',
      title: 'Cantidad por Lote',
    },
    {
      name: 'lote',
      type: 'select',
      title: 'Lote',
      items: [],
    },
    {
      name: 'detalle_movimiento',
      type: 'text',
      title: 'Detalle de movimiento',
    },
  ],
};
