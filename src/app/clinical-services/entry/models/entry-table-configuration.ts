import { TableConfiguration } from '../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../app/core/models/api-response.model';
export const Entry_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['fecha_ingreso', 'fecha_alta', 'paciente_string', 'user_string', 'sala_string', 'cama_string'],
  columnsName: ['Fecha Ingreso', 'Fecha Alta', 'Paciente', 'Médico', 'Sala', 'Cama'],
  tableFilters: [
    {
      name: 'fecha_ingreso',
      type: 'date',
      title: 'Fecha Ingreso',
    },
    {
      name: 'fecha_alta',
      type: 'date',
      title: 'Fecha Alta',
    },
    {
      name: 'paciente',
      title: 'Paciente',
      type: 'select',
      items: [],
    },
    {
      name: 'medico_solicitante',
      title: 'Médico',
      type: 'select',
      items: [],
    },
    {
      name: 'sala',
      title: 'Sala',
      type: 'select',
      items: [],
    },
    {
      name: 'cama',
      title: 'Cama',
      type: 'select',
      items: [],
    },
  ],
};
