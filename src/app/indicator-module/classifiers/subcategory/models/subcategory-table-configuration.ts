import { TableConfiguration } from 'src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../core/models/api-response.model';

export const SUBCATEGORY_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['descripcion', 'categoria'],
  columnsName: ['Descripción', 'Categoría'],
  tableFilters: [
    {
      name: 'descripcion',
      type: 'text',
      title: 'Descripción',
    },
    {
      name: 'categoria',
      title: 'Categoría',
      type: 'select',
      items: [],
    },
  ],
};
