export interface WarehouseLot {
  id?: string;
  codigo?: number;
  codigo_barra_venta?: string;
  precio_costo?: string;
  precio_venta?: string;
  fecha_fabricacion?: string;
  fecha_vencimiento?: string;
  retenido?: boolean;
  vencido?: boolean;
  producto?: string;


}
