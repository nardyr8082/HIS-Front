import { TableConfiguration } from '../../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../../app/core/models/api-response.model';

export const INVENTORY_COUNT_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['conteo_cant_real', 'cantidad_maquina', 'importe_maquina', 'inventario', 'existencia'],
  columnsName: ['Cantidad Real', 'Cantidad Máquina', 'Importe Máquina','Inventario', 'Existencia'],
  tableFilters: [
    {
      name: 'conteo_cant_real',
      type: 'number',
      title: 'Cantidad Real',
    },
    {
      name: 'cantidad_maquina',
      type: 'number',
      title: 'Cantidad Máquina',
    },
    {
      name: 'importe_maquina',
      title: 'Importe Máquina',
      type: 'number',
    },
    {
      name: 'inventario',
      title: 'Inventario',
      type: 'select',
      items: [],
    },
    {
      name: 'existencia',
      title: 'Existencia',
      type: 'select',
      items: [],
    },
  ],
};
