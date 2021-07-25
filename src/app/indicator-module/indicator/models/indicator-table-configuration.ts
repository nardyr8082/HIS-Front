import { TableConfiguration } from '../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../app/core/models/api-response.model';

export const INDICATOR_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre', 'especificidad', 'variables', 'objetivo', 'tipo_indicador_descripcion'],
  columnsName: ['Nombre', 'Especificidad', 'Variables', 'Objetivo', 'Tipo Indicador'],
  tableFilters: [
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
    },
    {
      name: 'especificidad',
      type: 'text',
      title: 'Especificidad',
    },
    {
      name: 'variables',
      title: 'Variables',
      type: 'text',
    },
    {
      name: 'objetivo',
      title: 'Objetivo',
      type: 'text',
    },
    {
      name: 'tipo_indicador',
      title: 'Tipo Indicador',
      type: 'select',
      items: [],
    },
  ],
};
