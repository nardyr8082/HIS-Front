import { DEFAULT_PAGINATION_SIZE } from '../../../../core/models/api-response.model';

export const MOVE_TYPE_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['descripcion', 'factor_diferencial'],
  columnsName: ['Descripción', 'Factor Diferencial'],
  tableFilters: [
    {
      name: 'descripcion',
      type: 'text',
      title: 'Descripción',
    },
    {
      name: 'factor_diferencial',
      type: 'text',
      title: 'Factor Diferencial',
    },
  ],
};
