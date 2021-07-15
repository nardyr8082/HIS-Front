import { DEFAULT_PAGINATION_SIZE } from '../../../../core/models/api-response.model';

export const PRODUCT_FAMILY_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['codigo', 'descripcion', 'padre'],
  columnsName: ['Código', 'Descripción', ' Familia Producto Padre'],
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
      name: 'padre',
      type: 'text',
      title: 'Familia Producto Padre',
    },
  ],
};
