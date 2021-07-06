import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const META_TABLE_NAME_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['mtn_tablename'],
  columnsName: ['Nombre'],
  tableFilters: [
    {
      name: 'mtn_tablename',
      type: 'text',
      title: 'Nombre',
    },
  ],
};
