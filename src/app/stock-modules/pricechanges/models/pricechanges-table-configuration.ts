import { TableConfiguration } from '../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../app/core/models/api-response.model';
export const Pricechanges_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['fecha', 'precio_viejo', 'precio_nuevo', 'comentario', 'lote_codigo', 'usuario_username'],
  columnsName: ['Fecha', 'Precio Viejo', 'Precio Nuevo', 'Comentario', 'Lote', 'Usuario'],
  tableFilters: [
    {
      name: 'fecha',
      type: 'text',
      title: 'Fecha',
    },
    {
      name: 'precio_viejo',
      type: 'text',
      title: 'Precio Viejo',
    },
    {
      name: 'precio_nuevo',
      title: 'Precio Nuevo',
      type: 'text',
    },
    {
      name: 'comentario',
      title: 'Comentario',
      type: 'text',
    },
    {
      name: 'lote',
      title: 'Lote',
      type: 'select',
      items: [],
    },
    {
      name: 'usuario',
      title: 'Usuario',
      type: 'select',
      items: [],
    },
  ],
};
