import { TableConfiguration } from '../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const Servicesstock_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['codigo', 'nombre', 'precio', 'impuesto_string', 'usuario_string', 'departamento_string'],
  columnsName: ['Código', 'Nombre', 'Precio', 'Impuesto', 'Usuario', 'Departamento'],
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
      name: 'precio',
      type: 'text',
      title: 'Precio',
    },
    {
      name: 'impuesto',
      type: 'text',
      title: 'Impuesto',
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
