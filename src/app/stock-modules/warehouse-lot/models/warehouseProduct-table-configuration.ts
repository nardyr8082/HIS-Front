import { TableConfiguration } from '../../../shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const WAREHOUSELOT_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['codigo', 'descripcion', 'activo', 'unidad_medida', 'familia', 'impuesto', 'programa'],
  columnsName: ['Codigo', 'Descripcion', 'Activo', 'Unidad medida', 'Familia', 'Impuesto', 'Programa'],

  tableFilters: [

    {
      name: 'codigo',
      title: 'Codigo',
      type: 'number',

    },
    {
      name: 'descripcion',
      title: 'Descripcion',
      type: 'text',

    },
    {
      name: 'activo',
      type: 'text',
      title: 'Activo',
      items: [],
    },
    {
      name: 'unidad_medida',
      title: 'Unidad medida',
      type: 'select',
      items: []
    },
    {
      name: 'familia',
      title: 'Familia',
      type: 'select',
      items: []

    },
    {
      name: 'impuesto',
      title: 'Impuesto',
      type: 'select',
      items: []

    },
    {
      name: 'programa',
      title: 'Programa',
      type: 'select',
      items: []

    }

  ]
};
