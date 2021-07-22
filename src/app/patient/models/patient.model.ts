import { BloodType } from './../../nomenclator-modules/blood-type/models/blood-type.model';
import { DocTypeId } from 'src/app/nomenclator-modules/doc-type-id/models/doc-type-id.model';
import { Gender } from 'src/app/nomenclator-modules/gender/models/gender.model';
import { Municipality } from 'src/app/nomenclator-modules/municipality/models/municipality.model';
import { Nationality } from 'src/app/nomenclator-modules/nationality/models/nationality.model';

interface Item {
  id: number;
  name?: string;
  descripcion?: string;
}

export interface Patient {
  id?: number;
  estado_civil?: Item;
  raza?: Item;
  nro_identificacion?: string;
  fecha_nacimiento?: string;
  foto?: string;
  direccion?: string;
  numero?: number;
  cod_postal?: string;
  nombre_madre?: string;
  nombre_padre?: string;
  contacto_emergencia?: string;
  telefono_emergencia?: string;
  telefono_casa?: string;
  telefono_trabajo?: string;
  telefono_movil?: string;
  email?: string;
  qr_code?: string;
  nombre?: string;
  apellidos?: string;
  identificador_paciente?: string;
  seg_social?: string;
  nota_factura?: string;
  fecha_defuncion?: string;
  motivo_defuncion?: string;
  ocupacion?: string;
  sexo?: Gender;
  grupo_sanguineo?: BloodType;
  tipo_doc?: DocTypeId;
  nacionalidad?: Nationality;
  municipio?: Municipality;
}
