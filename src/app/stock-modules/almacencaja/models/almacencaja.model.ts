export interface Almacencaja {
  id?: string;
  nro?: number;
  cajero?: Almacen;
  cajero_string?: string;
}
export interface Almacen {
  id?: string;
  codigo?: string;
  nombre?: string;
  direccion?: string;
  activo?: boolean;
  punto_de_venta?: boolean;
  jefe_almacen?: string ;
  departamento?: string ;
}
