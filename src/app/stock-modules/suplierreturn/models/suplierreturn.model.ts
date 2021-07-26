import { Stock } from '../../stock/models/stock.model';
import { Provider } from '../../classifiers/provider/models/provider.model';
import { User } from '../../../security-module/user/models/user.model';
import { MoveStatus } from '../../classifiers/move-status/models/move-status.model';
import { MoveType } from '../../classifiers/move-type/models/move-type.model';

export interface Suplierreturn {
  id?: string;
  fecha?: string;
  numero?: number;
  comentario?: string;
  nro_control?: string;
  almacen?: Stock;
  estado?: MoveStatus;
  tipo_de_movimiento?: MoveType;
  usuario?: User;
  proveedor?: Provider;
  almacen_string?: string;
  estado_string?: string;
  tipo_de_movimiento_string?: string;
  usuario_string?: string;
  proveedor_string?: string;
}

