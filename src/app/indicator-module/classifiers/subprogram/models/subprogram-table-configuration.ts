import { TableConfiguration } from '../../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../../app/core/models/api-response.model';

export const SUBPROGRAM_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['descripcion', 'config', 'programa_descrip', 'indicador_nombre'],
  columnsName: ['Descripcion', 'Config', 'Programa','Indicador'],
  tableFilters: [
    {
      name: 'descripcion',
      type: 'text',
      title: 'Descripcion',
    },
    {
      name: 'config',
      type: 'text',
      title: 'Config',
    },
    {
      name: 'programa',
      title: 'Programa',
      type: 'select',
      items: [],
    },
    {
      name: 'indicador',
      title: 'Indicador',
      type: 'select',
      items: [],
    },
  ],
};
