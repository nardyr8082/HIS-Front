import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const Productstock_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['codigo', 'descripcion', 'activo_string', 'atributos_string', 'unidad_medida_string', 'familia_string', 'impuesto_string', 'programa_string'],
  columnsName: ['Código', 'Descripción', 'Activo', 'Atributos', 'Unidad Medida', 'Familia', 'Impuesto', 'Programa'],
  tableFilters: [
    {
      name: 'codigo',
      type: 'text',
      title: 'Código',
    },
    {
      name: 'descripcion',
      type: 'text',
      title: 'Descripción',
    },
    {
      name: 'activo',
      type: 'select',
      items: [{id: true, name: 'Si'}, {id: false, name: 'No'}],
      title: 'Activo',
    },
    {
      name: 'atributos',
      type: 'select',
      items: [],
      title: 'Atributos',
    },
    {
      name: 'unidad_medida',
      type: 'select',
      items: [],
      title: 'Unidad Medida',
    },
    {
      name: 'familia',
      type: 'select',
      items: [],
      title: 'Familia',
    },
    {
      name: 'impuesto',
      type: 'select',
      items: [],
      title: 'Impuesto',
    },
    {
      name: 'programa',
      type: 'select',
      items: [],
      title: 'Programa',
    },
  ],
};
