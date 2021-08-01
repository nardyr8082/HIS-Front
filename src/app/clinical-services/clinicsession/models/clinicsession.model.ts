import { Office } from '../../../structure-modules/office/models/office.model';
import { User } from '../../../security-module/user/models/user.model';
import { ClinicHistoryStatic } from '../../clinic-history-static/models/clinic-history-static.model';
import { Disease } from '../../disease/models/disease.model';
import { Attribute } from '../../../stock-modules/classifiers/attribute/models/attribute.model';

export interface Clinicsession {
  id: number;
  motivo?: string;
  fecha_inicio?: string;
  fecha_inicioT?: string;
  horaiT?: string;
  horafT?: string;
  fecha_finT?: string;
  fecha_fin?: string;
  fecha_realizacion?: string;
  fecha_solicitud?: string;
  hc?: ClinicHistoryStatic;
  medico_realiza?: User;
  medico_solicita?: User;
  cita?: AdmCita;
  departamento?: Office;
  enfermedades?: Array<Disease>;
  hc_string?: string;
  medico_realiza_string?: string;
  medico_solicita_string?: string;
  cita_string?: string;
  departamento_string?: string;
  enfermedades_string?: string;
}

export interface AdmCita {
  id: number;
  numero?: string;
  fecha?: string;
  hora_inicio?: string;
  hora_fin?: string;
  observaciones?: string;
  paciente?: number;
  servicio?: number;
  medico?: number;
  departamento?: number;
  estado_cita?: number;
}
