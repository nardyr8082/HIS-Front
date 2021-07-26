import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const Boxstock_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nro', 'cajero', 'almacen_string'],
  columnsName: ['Número', 'Cajero', 'Almacén'],
  tableFilters: [
    {
      name: 'nro',
      type: 'text',
      title: 'Número',
    },
    {
      name: 'cajero',
      type: 'text',
      title: 'Cajero',
    },
    {
      name: 'almacen',
      type: 'select',
      items: [],
      title: 'Almacén',
    }
  ],
};
