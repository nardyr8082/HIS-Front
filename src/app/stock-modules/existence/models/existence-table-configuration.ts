import { TableConfiguration } from '../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../app/core/models/api-response.model';

export const EXISTENCE_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['cantidad', 'importe', 'almacen', 'unidad_medida', 'categoria', 'lote'],
  columnsName: ['Cantidad', 'Importe', 'Almacen', 'Unidad medida', 'Categoria', 'Lote'],

  tableFilters: [

    {
      name: 'cantidad',
      title: 'Cantidad',
      type: 'text',

    },
    {
      name: 'importe',
      title: 'Importe',
      type: 'text',

    },
    {
      name: 'almacen',
      type: 'select',
      title: 'Almacen',
      items: [],
    },
    {
      name: 'unidad_medida',
      title: 'Unidad medida',
      type: 'select',
      items: []
    },
    {
      name: 'categoria',
      title: 'Categoria',
      type: 'select',
      items: []
    },
    {
      name: 'lote',
      title: 'Lote',
      type: 'select',
      items: []
    }

  ]
};
