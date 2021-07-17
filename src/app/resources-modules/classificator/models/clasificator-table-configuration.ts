import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';
import { ResourceType } from '../../type/models/type';

export const CLASIFICATOR_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre', 'tipo', 'marca', 'modelo', 'numero_serie'],
  columnsName: ['Nombre', 'Tipo', 'Marca', 'Modelo', 'Numero Serie'],
  tableFilters: [
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
    },
    {
      name: 'tipo',
      type: 'ResourceType',
      title: 'Tipo',
    },
    {
      name: 'marca',
      type: 'text',
      title: 'Marca',
    },
    {
      name: 'modelo',
      type: 'text',
      title: 'Modelo',
    },
    {
      name: 'numero_serie',
      type: 'text',
      title: 'Numero Serie',
    }
  ],
};
