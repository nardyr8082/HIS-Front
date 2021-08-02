import { TableConfiguration } from 'src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const SYSTEM_EXAM_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['observacion', 'examen_fisico_string', 'sistema_string'],
  columnsName: ['Observación', 'Examen Físico', 'Sistema'],
  tableFilters: [
    {
      name: 'observacion',
      type: 'text',
      title: 'Observación',
    },
    {
      name: 'examen_fisico',
      title: 'Examen Físico',
      type: 'select',
      items: [],
    },
    {
      name: 'sistema',
      title: 'Sistema',
      type: 'select',
      items: [],
    },
  ],
};
