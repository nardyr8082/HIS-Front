import { TableConfiguration } from '../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const Servicesstock_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['codigo', 'nombre', 'precio', 'impuesto_string', 'departamento_string', 'usuario_string'],
  columnsName: ['Código', 'Nombre', 'Precio', 'Impuesto', 'Departamento', 'Usuario'],
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
      title: 'Impuesto',
      type: 'select',
      items: [],
    },
    {
      name: 'departamento',
      title: 'Departamento',
      type: 'select',
      items: [],
    },
    {
      name: 'usuario',
      title: 'Usuario',
      type: 'select',
      items: [],
    },
  ],
};
