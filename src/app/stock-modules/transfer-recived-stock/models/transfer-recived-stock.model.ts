import { WarehouseMove } from './../../warehouse-movement-detail/models/warehouse-move.model';
export interface TransferRecivedStock {
  id?: string;
  movimiento?: WarehouseMove;
  movimiento_origen?: WarehouseMove;
}
