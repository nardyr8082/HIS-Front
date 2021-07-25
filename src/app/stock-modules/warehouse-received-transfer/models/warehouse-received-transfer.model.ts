import { MoveType } from './../../classifiers/move-type/models/move-type.model';
import { MoveStatus } from './../../classifiers/move-status/models/move-status.model';
import { Stock } from '../../boxstock/models/boxstock.model';
import { User } from 'src/app/security-module/user/models/user.model';
import { TransferEmitedStock } from '../../transfer-emited-stock/models/transfer-emited-stock.model';

export interface WarehouseReceivedTransfer {
  id?: string;
  fecha?: string;
  numero?: number;
  comentario?: string;
  nro_control?: string;
  almacen?: Stock;
  estado?: MoveStatus;
  tipo_de_movimiento?: MoveType;
  usuario?: User;
  transferencia_origen: TransferEmitedStock;
}
