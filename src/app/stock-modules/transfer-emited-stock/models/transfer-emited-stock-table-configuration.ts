import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const TRANSFER_EMITED_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['fecha', 'numero', 'nro_control'],
  columnsName: ['Fecha', 'Número', 'Número de control'],
  tableFilters: [
    {
      name: 'fecha',
      type: 'date',
      title: 'Fecha',
    },
    {
      name: 'numero',
      title: 'Número',
      type: 'text',
    },
    {
      name: 'nro_control',
      title: 'Número de control',
      type: 'text',
    },
  ],
};
