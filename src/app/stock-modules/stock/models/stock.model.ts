import { User } from '../../../security-module/user/models/user.model';
import { Office } from '../../../structure-modules/office/models/office.model';

export interface Stock {
  id?: string;
  codigo?: string;
  nombre?: string;
  direccion?: string;
  activo?: string;
  punto_de_venta?: string;
  jefe_almacen?: User;
  departamento?: Office;
  jefe_almacen_string?: string;
  departamento_string?: string;
}
