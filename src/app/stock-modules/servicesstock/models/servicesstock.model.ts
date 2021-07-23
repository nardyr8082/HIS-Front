import { Office } from '../../../structure-modules/office/models/office.model';
import { User } from '../../../security-module/user/models/user.model';
import { Tax } from '../../classifiers/tax/models/tax.model';

export interface Servicesstock {
  id: number;
  codigo?: string;
  nombre?: string;
  precio?: number;
  departamento?: Array<Office>;
  departamento_string?: string;
  impuesto?: Tax;
  impuesto_string?: string;
  usuario?: User;
  usuario_string?: string;
}


