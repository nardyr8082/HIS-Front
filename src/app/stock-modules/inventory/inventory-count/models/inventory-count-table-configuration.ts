import { TableConfiguration } from '../../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../../app/core/models/api-response.model';

export const INVENTORY_COUNT_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['conteo_cant_real', 'cantidad_maquina', 'importe_maquina', 'inventario_num', 'existencia_cantidad'],
  columnsName: ['Cantidad Real', 'Cantidad Máquina', 'Importe Máquina','Inventario', 'Existencia'],
  tableFilters: [
    {
      name: 'conteo_cant_real',
      type: 'text',
      title: 'Cantidad Real',
    },
    {
      name: 'cantidad_maquina',
      type: 'text',
      title: 'Cantidad Máquina',
    },
    {
      name: 'importe_maquina',
      title: 'Importe Máquina',
      type: 'text',
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
