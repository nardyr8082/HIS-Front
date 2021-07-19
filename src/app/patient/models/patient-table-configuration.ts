import { DEFAULT_PAGINATION_SIZE } from './../../core/models/api-response.model';

export const PATIENT_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre', 'apellidos', 'nro_identificacion', 'email'],
  columnsName: ['Nombre', 'Apellidos', 'Número de Identificación', 'Correo'],
  tableFilters: [
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
    },
    {
      name: 'apellidos',
      type: 'text',
      title: 'Apellido',
    },
    {
      name: 'nro_identificacion',
      type: 'text',
      title: 'Número de Identificación',
    },
    {
      name: 'email',
      type: 'text',
      title: 'Correo',
    },
  ],
};
