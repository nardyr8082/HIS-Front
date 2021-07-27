import { Patient } from '../../../patient/models/patient.model';
import { User } from '../../../security-module/user/models/user.model';
import { Office } from '../../../structure-modules/office/models/office.model';
import { Aftselfresources } from '../../../resources-modules/aftselfresources/models/aftselfresources.model';

export interface Entry {
  id: number;
  numero?: string;
  fecha_ingreso?: string;
  fecha_alta?: string;
  paciente?: Patient;
  medico_solicitante?: User;
  sala?: Office;
  cama?: Aftselfresources;
  fechai?: string;
  horai?: string;
  fechaa?: string;
  horaa?: string;
  paciente_string?: string;
  user_string?: string;
  sala_string?: string;
  cama_string?: string;
}
