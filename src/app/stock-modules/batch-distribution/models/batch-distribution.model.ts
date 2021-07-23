import { WarehouseLot } from './../../warehouse-lot/models/warehouseLot';
export interface BatchDistribution {
  id?: string;
  cant_por_lote?: number;
  lote?: WarehouseLot;
  // TODO: Waiting for model
  detalle_movimiento?: any;
}
