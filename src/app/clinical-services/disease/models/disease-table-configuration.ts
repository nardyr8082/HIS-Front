import { DEFAULT_PAGINATION_SIZE } from './../../../core/models/api-response.model';

export const DISEASE_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre', 'descripcion', 'codigo'],
  columnsName: ['Nombre', 'Descripción', 'Código'],
  tableFilters: [
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
    },
    {
      name: 'descripcion',
      type: 'text',
      title: 'Descripción',
    },
    {
      name: 'codigo',
      type: 'text',
      title: 'Código',
    },
  ],
};
