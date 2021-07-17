import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const Boxstock_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nro', 'cajero', 'almacen'],
  columnsName: ['Numero', 'Cajero', 'Almacen'],
  tableFilters: [
    {
      name: 'nro',
      type: 'text',
      title: 'Numero',
    },
    {
      name: 'cajero',
      type: 'text',
      title: 'Cajero',
    },
    {
      name: 'almacen',
      type: 'text',
      title: 'Almacen',
    }
  ],
};
