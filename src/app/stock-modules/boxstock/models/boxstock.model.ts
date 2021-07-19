export interface Boxstock {
  id?: string;
  nro?: string;
  cajero?: number;
  almacen?: Stock;
  almacen_string?: string;
}
export interface Stock {
  id?: string;
  codigo?: string;
  nombre?: string;
  direccion?: string;
  activo?: boolean;
  punto_de_venta?: boolean;
  jefe_almacen?: string ;
  departamento?: string ;
}
