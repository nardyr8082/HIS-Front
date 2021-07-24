import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const Stock_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['codigo', 'nombre', 'jefe_almacen_string', 'departamento_string', 'direccion', 'activo', 'punto_de_venta'],
  columnsName: ['Código', 'Nombre', 'Usuario', 'Departamento', 'Dirección', 'Activo', 'Punto Venta'],
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
      name: 'usuario',
      type: 'select',
      items: [],
      title: 'Usuario',
    },
    {
      name: 'departamento',
      type: 'select',
      items: [],
      title: 'Departamento',
    },
    {
      name: 'direccion',
      type: 'text',
      title: 'Dirección',
    },
    {
      name: 'activo',
      type: 'text',
      title: 'Activo',
    },
    {
      name: 'punto_de_venta',
      type: 'text',
      title: 'Punto Venta',
    },
  ],
};
