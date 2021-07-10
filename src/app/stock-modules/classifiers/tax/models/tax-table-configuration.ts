import { DEFAULT_PAGINATION_SIZE } from '../../../../core/models/api-response.model';

export const TAX_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['descripcion', 'importe_fijo', 'importe_proporcional'],
  columnsName: ['Descripción', 'Importe fijo', 'Importe Proporcional'],
  tableFilters: [
    {
      name: 'descripcion',
      type: 'text',
      title: 'Descripción',
    },
  ],
};
