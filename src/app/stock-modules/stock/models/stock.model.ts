import { User } from '../../../security-module/user/models/user.model';
import { Office } from '../../../structure-modules/office/models/office.model';

export interface Stock {
  id?: string;
  codigo?: string;
  nombre?: string;
  direccion?: string;
  activo?: boolean;
  punto_de_venta?: boolean;
  jefe_almacen?: User;
  departamento?: Office;
  activo_string?: string;
  punto_de_venta_string?: string;
  jefe_almacen_string?: string;
  departamento_string?: string;
}
