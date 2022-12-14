import { TableConfiguration } from './../../../shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const HEALTH_UNIT_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre', 'ubicacion', 'direccion', 'telefono_fijo', 'telefono_movil'],
  columnsName: ['Nombre', 'Ubicación Organizacional', 'Direccion', 'Teléfono Fijo', 'Teléfono Móvil'],
  tableFilters: [
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
    },
    {
      name: 'nivel__id',
      title: 'Ubicación Organizacional',
      type: 'select',
      items: [],
    },
    {
      name: 'direccion',
      type: 'text',
      title: 'Direccion',
    },
    {
      name: 'telefono_fijo',
      type: 'text',
      title: 'Teléfono fijo',
    },
    {
      name: 'telefono_movil',
      type: 'text',
      title: 'Teléfono móvil',
    },
  ],
};
