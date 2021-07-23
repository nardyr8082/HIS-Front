import { TableConfiguration } from '../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../app/core/models/api-response.model';
export const Servicesstock_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['codigo', 'nombre', 'precio', 'impuesto_descripcion', 'usuario_username', 'departamento_nombre'],
  columnsName: ['Codigo', 'Nombre', 'Precio', 'Impuesto', 'Usuario', 'Departamento'],
  tableFilters: [
    {
      name: 'codigo',
      type: 'text',
      title: 'Codigo',
    },
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
    },
    {
      name: 'precio',
      title: 'Precio',
      type: 'text',
    },
    {
      name: 'impuesto',
      title: 'Impuesto',
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
      name: 'departamento',
      title: 'Departamento',
      type: 'select',
      items: [],
    },
  ],
};
