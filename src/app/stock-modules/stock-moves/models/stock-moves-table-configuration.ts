import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';
export const STOCK_MOVE_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['almacen_string', 'tipo_de_movimiento_string', 'estado_string', 'usuario_string', 'fecha_string'],
  columnsName: ['Almacén', 'Tipo de Movimiento', 'Estado', 'Usuario', 'Fecha'],
  tableFilters: [
    {
      name: 'almacen',
      title: 'Almacén',
      type: 'select',
      items: [],
    },
    {
      name: 'tipo_de_movimiento',
      title: 'Tipo de Movimiento',
      type: 'select',
      items: [],
    },
    {
      name: 'estado',
      title: 'Estado',
      type: 'select',
      items: [],
    },
    {
      name: 'usuario',
      title: 'Usuario',
      type: 'select',
      items: [],
    },
    {
      name: 'fecha_ingreso',
      type: 'date',
      title: 'Fecha Ingreso',
    },
  ],
};
