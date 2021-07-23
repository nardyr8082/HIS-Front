import { TableConfiguration } from '../../../shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const WAREHOUSE_MOVEMENT_DETAIL_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['cantidad', 'precio', 'importe', 'existencia', 'movimiento', 'producto', 'unidad_medida'],
  columnsName: ['Cantidad', 'Precio', 'Importe', 'Existencia', 'Movimiento', 'Producto', 'Unidad medida'],

  tableFilters: [

    {
      name: 'cantidad',
      title: 'Cantidad',
      type: 'text',

    },
    {
      name: 'precio',
      title: 'Precio',
      type: 'text',

    },
    {
      name: 'importe',
      title: 'Importe',
      type: 'text',

    },
    {
      name: 'existencia',
      type: 'text',
      title: 'Existencia',

    }, {
      name: 'movimiento',
      title: 'Movimiento',
      type: 'select',
      items: []
    },
    {
      name: 'producto',
      title: 'Producto',
      type: 'select',
      items: []
    },
    {
      name: 'unidad_medida',
      title: 'Unidad medida',
      type: 'select',
      items: []
    }

  ]
};
