import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const FACTURE_SERVICE_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['cantidad', 'factura_string', 'servicio_string'],
  columnsName: ['Cantidad', 'Factura', 'Servicio'],
  tableFilters: [
    {
      name: 'cantidad',
      type: 'text',
      title: 'Cantidad por Lote',
    },
    {
      name: 'factura',
      title: 'Factura',
      type: 'select',
      items: [],
    },
    {
      name: 'servicio',
      title: 'Servicio',
      type: 'select',
      items: [],
    },
  ],
};
