import { MoveType } from './../../classifiers/move-type/models/move-type.model';
import { MoveStatus } from './../../classifiers/move-status/models/move-status.model';
import { Stock } from './../../boxstock/models/boxstock.model';
import { User } from '../../../security-module/user/models/user.model';

export interface StockMove {
  id?: string;
  fecha?: string;
  numero?: number;
  comentario?: string;
  nro_control?: string;
  almacen?: Stock;
  estado?: any;
  tipo_de_movimiento?: MoveType;
  usuario?: User;
}
