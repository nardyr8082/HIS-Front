import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';
//displayedColumns: ['codigo', 'nombre', 'direccion', 'activo_string', 'punto_de_venta_string', 'jefe_almacen_string', 'departamento_string'],
//{
//       name: 'activo',
//       title: 'Activo',
//       type: 'select',
//       items: [{id: 1, name: 'Si'}, {id: 0, name: 'No'}],
//     },
//     {
//       name: 'punto_de_venta',
//       title: 'Punto Venta',
//       type: 'select',
//       items: [{id: 1, name: 'Si'}, {id: 0, name: 'No'}],
//     },
export const Stock_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['codigo', 'nombre', 'direccion', 'activo_string', 'punto_de_venta_string', 'jefe_almacen_string', 'departamento_string'],
  columnsName: ['Código', 'Nombre', 'Dirección', 'Activo', 'Punto Venta', 'Jefe Almacén', 'Departamento'],
  tableFilters: [
    {
      name: 'codigo',
      type: 'text',
      title: 'Código',
    },
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
    },
    {
      name: 'direccion',
      type: 'text',
      title: 'Dirección',
    },
    {
      name: 'activo',
      type: 'select',
      items: [{id: true, name: 'Si'}, {id: false, name: 'No'}],
      title: 'Activo',
     },
    {
      name: 'punto_de_venta',
      type: 'select',
      items: [{id: true, name: 'Si'}, {id: false, name: 'No'}],
      title: 'Punto Venta',
    },
    {
      name: 'jefe_almacen',
      type: 'select',
      items: [],
      title: 'Jefe Almacén',
    },
    {
      name: 'departamento',
      type: 'select',
      items: [],
      title: 'Departamento',
    },
  ],
};
