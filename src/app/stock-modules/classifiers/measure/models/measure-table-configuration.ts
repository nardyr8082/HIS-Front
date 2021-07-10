import { DEFAULT_PAGINATION_SIZE } from '../../../../core/models/api-response.model';

export const MEASURE_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['clave','descripcion'],
  columnsName: ['Clave','Descripción'],
  tableFilters: [
    {
      name: 'clave',
      type: 'text',
      title: 'Clave',
    },
    {
      name: 'descripcion',
      type: 'text',
      title: 'Descripción',
    },
  ],
};
