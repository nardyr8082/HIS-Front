import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const FACTURE_SERVICE_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nro_factura', 'fecha_emision', 'fecha_entrega', 'importe_total', 'estado_descrip', 'servicio_string'],
  columnsName: ['Nro. Factura', 'Fecha Emisión', 'Fecha Entrega','Importe Total', 'Estado', 'Servicio'],
  tableFilters: [
    {
      name: 'nro_factura',
      type: 'text',
      title: 'Nro. Factura',
    },
    {
      name: 'fecha_emision',
      type: 'date',
      title: 'Fecha Emisión',
    },
    {
      name: 'fecha_entrega',
      title: 'Fecha Entrega',
      type: 'date',
    },
    {
      name: 'importe_total',
      title: 'Importe Total',
      type: 'text',
    },
    {
      name: 'estado',
      title: 'Estado',
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
