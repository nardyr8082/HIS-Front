import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';
//displayedColumns: ['fecha', 'numero', 'comentario', 'nro_control', 'almacen_string', 'estado_string', 'tipo_de_movimiento_string', 'usuario_string', 'proveedor_string'],
export const Suplierreturn_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['fecha', 'numero', 'comentario', 'nro_control', 'almacen_string', 'estado_string', 'tipo_de_movimiento_string', 'usuario_string', 'proveedor_string'],
  columnsName: ['Fecha', 'Número', 'Comentario', 'Número Control', 'Almacén', 'Estado', 'Tipo Movimiento', 'Usuario', 'Proveedor'],
  tableFilters: [
    {
      name: 'fecha',
      type: 'text',
      title: 'Fecha',
    },
    {
      name: 'numero',
      type: 'text',
      title: 'Número',
    },
    {
      name: 'comentario',
      type: 'text',
      title: 'Comentario',
    },
    {
      name: 'nro_control',
      type: 'text',
      title: 'Número Control',
    },
    {
      name: 'almacen',
      type: 'select',
      items: [],
      title: 'Almacén',
    },
    {
      name: 'estado',
      type: 'select',
      items: [],
      title: 'Estado',
    },
    {
      name: 'tipo_de_movimiento',
      type: 'select',
      items: [],
      title: 'Tipo Movimiento',
    },
    {
      name: 'usuario',
      type: 'select',
      items: [],
      title: 'Usuario',
    },
    {
      name: 'proveedor',
      type: 'select',
      items: [],
      title: 'Proveedor',
    }
  ],
};
