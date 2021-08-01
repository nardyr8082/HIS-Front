import { TableConfiguration } from '../../../shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const APPOINTMENT_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['numero', 'fecha', 'hora_inicio', 'hora_fin', 'observaciones', 'paciente', 'servicio', 'medico', 'departamento', 'estado_cita'],
  columnsName: ['Número', 'Fecha', 'Hora inicio', 'Hora fin', 'Observaciones', 'Paciente', 'Servicio', 'Médico', 'Departamento', 'Estado cita'],

  tableFilters: [

    {
      name: 'numero',
      title: 'Número',
      type: 'text',

    },
    {
      name: 'fecha',
      title: 'Fecha',
      type: 'date',

    },
    {
      name: 'hora_inicio',
      title: 'Hora inicio',
      type: 'text',
    },
    {
      name: 'hora_fin',
      title: 'Hora fin',
      type: 'text',
    },
    {
      name: 'observaciones',
      title: 'Observaciones',
      type: 'text'
    }, {
      name: 'paciente',
      title: 'Paciente',
      type: 'select',
      items: []
    }, {
      name: 'servicio',
      title: 'Servicio',
      type: 'select',
      items: []
    }, {
      name: 'medico',
      title: 'Médico',
      type: 'select',
      items: []
    }, {
      name: 'departamento',
      title: 'Departamento',
      type: 'select',
      items: []
    },
    {
      name: 'estado_cita',
      title: 'Estado cita',
      type: 'select',
      items: []
    }
  ]
};
