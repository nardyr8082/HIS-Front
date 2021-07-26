import { TableConfiguration } from '../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../app/core/models/api-response.model';
export const Inventorys_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['numero', 'fecha_inicio', 'fecha_fin', 'usuario_username', 'almacen_descripcion', 'estado_desc'],
  columnsName: ['Número', 'Fecha Inicio', 'Fecha Fin', 'Usuario', 'Almacén', 'Estado'],
  tableFilters: [
    {
      name: 'numero',
      type: 'text',
      title: 'Número',
    },
    {
      name: 'fecha_inicio',
      type: 'date',
      title: 'Fecha Inicio',
    },
    {
      name: 'fecha_fin',
      title: 'Fecha Fin',
      type: 'date',
    },
    {
      name: 'usuario',
      title: 'Usuario',
      type: 'select',
      items: [],
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
