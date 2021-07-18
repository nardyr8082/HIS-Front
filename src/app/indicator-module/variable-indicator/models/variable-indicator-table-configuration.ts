import { TableConfiguration } from '../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../app/core/models/api-response.model';

export const VARIABLE_INDICATOR_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre', 'SQL', 'indicador_nombre'],
  columnsName: ['Nombre', 'SQL', 'Indicador'],
  tableFilters: [
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
    },
    {
      name: 'SQL',
      type: 'text',
      title: 'SQL',
    },
    {
      name: 'indicador_nombre',
      title: 'Indicador',
      type: 'select',
      items: [],
    },
  ],
};
