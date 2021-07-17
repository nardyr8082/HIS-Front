import { TableConfiguration } from 'src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../core/models/api-response.model';

export const MOVE_TYPE_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['descripcion', 'factor_diferencial', 'categoria__descripcion'],
  columnsName: ['Descripción', 'Factor Diferencial', 'Categoría'],
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
    {
      name: 'categoria',
      type: 'select',
      items: [],
      title: 'Categoría',
    },
  ],
};
