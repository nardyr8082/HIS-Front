import { TableConfiguration } from '../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../app/core/models/api-response.model';
export const Inventorys_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['numero', 'fecha_inicio', 'fecha_fin', 'usuario_username', 'almacen_descripcion', 'estado_desc'],
  columnsName: ['Numero', 'Fecha Inicio', 'Fecha Fin', 'Usuario', 'Almacen', 'Estado'],
  tableFilters: [
    {
      name: 'numero',
      type: 'text',
      title: 'Numero',
    },
    {
      name: 'fecha_inicio',
      type: 'text',
      title: 'Fecha Inicio',
    },
    {
      name: 'fecha_fin',
      title: 'Fecha Fin',
      type: 'text',
    },
    {
      name: 'usuario',
      title: 'Usuario',
      type: 'select',
      items: [],
    },
    {
      name: 'almacen',
      title: 'Almacen',
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
