import { Race } from '../../../nomenclator-modules/race/models/race.model';
import { CivilStatus } from '../../../nomenclator-modules/civil-status/models/civil-status.model';

export interface Aftselfresources {
  id?: string;
  nro_inventario?: string;
  activo?: string;
  id_estado?: number;
  id_recurso?: number;
  id_departamento?: number;
  paciente?: number;
}

export interface Patient {
  id?: string;
  nombre?: string;
  apellidos?: string;
  identificador_paciente?: string;
  seg_social?: string;
  nota_factura?: string;
  fecha_defuncion?: string;
  motivo_defuncion?: string;
  estado_civil?: CivilStatus;
  raza?: Race;
  ocupacion?: string;
}
