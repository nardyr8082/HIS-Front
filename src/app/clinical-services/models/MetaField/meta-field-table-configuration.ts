import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const META_FIELD_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['mf_datatype', 'mf_validchars'],
  columnsName: ['Tipo', 'Caracteres Válidos'],
  tableFilters: [
    {
      name: 'mf_datatype',
      type: 'text',
      title: 'Tipo',
    },
    {
      name: 'mf_validchars',
      type: 'text',
      title: 'Caracteres Válidos',
    },
  ],
};
