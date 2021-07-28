import { TableConfiguration } from '../../../shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const WAREHOUSELOT_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['codigo', 'codigo_barra_venta', 'precio_costo', 'precio_venta', 'fecha_fabricacion',
    'fecha_vencimiento', 'retenido', 'vencido', 'producto'],

  columnsName: ['Codigo', 'Codigo barra venta', 'Precio costo', 'Precio venta', 'Fecha fabricacion',
    'Fecha vencimiento', 'Retenido', 'Vencido', 'Producto'],

  tableFilters: [

    {
      name: 'codigo',
      title: 'Codigo',
      type: 'text',

    },
    {
      name: 'codigo_barra_venta',
      title: 'Codigo barra venta',
      type: 'text',

    },
    {
      name: 'precio_costo',
      title: 'Precio costo',
      type: 'text',

    },
    {
      name: 'precio_venta',
      title: 'Precio venta',
      type: 'text',

    },
    {
      name: 'fecha_fabricacion',
      type: 'text',
      title: 'Fecha fabricacion'

    },
    {
      name: 'fecha_vencimiento',
      title: 'Fecha vencimiento',
      type: 'text'

    },
    {
      name: 'producto',
      title: 'Producto',
      type: 'select',
      items: []

    },

  ],
};
