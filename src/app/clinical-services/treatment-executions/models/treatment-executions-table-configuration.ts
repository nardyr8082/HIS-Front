import { TableConfiguration } from '../../../shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const TREATMENT_EXECUTIONS_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['descripcion', 'fecha', 'hora', 'sesion_clinica', 'usuario'],
  columnsName: ['Descripcion', 'Fecha', 'Hora', 'Sesion clinica', 'Usuario'],

  tableFilters: [

    {
      name: 'descripcion',
      title: 'Descripcion',
      type: 'text',

    },
    {
      name: 'fecha',
      title: 'Fecha',
      type: 'date',

    },
    {
      name: 'sesion_clinica',
      title: 'Sesion clinica',
      type: 'select',
      items: []

    },
    {
      name: 'usuario',
      title: 'Usuario',
      type: 'select',
      items: []

    }
  ]
};
