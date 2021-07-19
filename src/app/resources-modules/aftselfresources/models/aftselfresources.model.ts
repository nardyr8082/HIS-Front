import { Office } from '../../../structure-modules/office/models/office.model';
import { ResourceStatus } from '../../status/models/resource-status.model';
import { Clasificator } from '../../classificator/models/clasificator.model';
import { Race } from '../../../nomenclator-modules/race/models/race.model';
import { CivilStatus } from '../../../nomenclator-modules/civil-status/models/civil-status.model';

export interface Aftselfresources {
  id?: string;
  nro_inventario?: string;
  activo?: boolean;
  id_estado?: ResourceStatus;
  id_recurso?: Clasificator;
  id_departamento?: Office;
  paciente?: Patient;
  id_estado_string?: string;
  id_recurso_string?: string;
  id_departamento_string?: string;
  paciente_string?: string;
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
