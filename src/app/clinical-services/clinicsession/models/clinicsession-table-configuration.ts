import { TableConfiguration } from '../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../app/core/models/api-response.model';
export const Clinicsession_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  /*
  * hc?: number;
  medico_realiza?: number;
  medico_solicita?: number;
  cita?: number;
  departamento?: number;
  enfermedades?: number;
  hc_string?: string;
  medico_realiza_string?: string;
  medico_solicita_string?: string;
  cita_string?: string;
  departamento_string?: string;
  enfermedades_string?: string;*/
  displayedColumns: ['motivo', 'fecha_solicitud', 'fecha_realizacion', 'hc_string', 'medico_realiza_string', 'medico_solicita_string', 'cita_string', 'departamento_string', 'enfermedades_string'],
  columnsName: ['Número', 'Fecha Solicitud', 'Fecha Realización', 'Hc', 'Médico Realiza', 'Médico Solicita', 'Cita', 'Departamento', 'Enfermedades'],
  tableFilters: [
    {
      name: 'motivo',
      type: 'text',
      title: 'Motivo',
    },
    {
      name: 'fecha_solicitud',
      type: 'date',
      title: 'Fecha Solicitud',
    },
    {
      name: 'fecha_realizacion',
      title: 'Fecha Realización',
      type: 'date',
    },
    {
      name: 'hc_string',
      title: 'Hc',
      type: 'select',
      items: [],
    },
    {
      name: 'medico_realiza',
      title: 'Médico Realiza',
      type: 'select',
      items: [],
    },
    {
      name: 'medico_solicita',
      title: 'Médico Solicita',
      type: 'select',
      items: [],
    },
    {
      name: 'cita',
      title: 'Cita',
      type: 'select',
      items: [],
    },
    {
      name: 'departamento',
      title: 'Departamento',
      type: 'select',
      items: [],
    },
    {
      name: 'enfermedades',
      title: 'Enfermedades',
      type: 'select',
      items: [],
    },
  ],
};
