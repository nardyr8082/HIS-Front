import { TableConfiguration } from 'src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const PURCHASE_FACTURE_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nro_factura', 'fecha_emision', 'fecha_entrega', 'importe_total', 'estado_descrip'],
  columnsName: ['Nro. Factura', 'Fecha Emisión', 'Fecha Entrega','Importe Total', 'Estado'],
  tableFilters: [
    {
      name: 'nro_factura',
      type: 'text',
      title: 'Nro. Factura',
    },
    {
      name: 'fecha_emision',
      type: 'text',
      title: 'Fecha Emisión',
    },
    {
      name: 'fecha_entrega',
      title: 'Fecha Entrega',
      type: 'text',
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
  ],
};
