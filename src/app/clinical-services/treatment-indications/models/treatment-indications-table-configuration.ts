import { TableConfiguration } from '../../../shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const TREATMENT_INDICATIONS_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['descripcion', 'fecha', 'hora', 'sesion_clinica'],
  columnsName: ['Descripcion', 'Fecha', 'Hora', 'Sesion clinica'],

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

    }
  ]
};
