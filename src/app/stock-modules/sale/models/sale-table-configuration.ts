import { TableConfiguration } from 'src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const SALE_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['numero', 'fecha', 'nro_control', 'almacen_nombre', 'estado_descrip'],
  columnsName: ['Número', 'Fecha', 'Nro. Control','Almacén', 'Estado'],
  tableFilters: [
    {
      name: 'numero',
      type: 'text',
      title: 'Número',
    },
    {
      name: 'fecha',
      type: 'date',
      title: 'Fecha',
    },
    {
      name: 'nro_control',
      title: 'Nro. Control',
      type: 'text',
    },
    {
      name: 'almacen',
      title: 'Almacén',
      type: 'select',
      items: [],
    },
    {
      name: 'estado',
      title: 'Estado',
      type: 'select',
      items: [],
    },
  ],
};
