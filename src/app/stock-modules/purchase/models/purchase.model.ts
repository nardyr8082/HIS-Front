export interface Purchase {
  id: number;
  numero?: number;
  fecha?: string;
  nro_control?: string;
  comentario?: string;
  almacen?: string;
  tipo_de_movimiento?: string;
  estado?: string;
  usuario?: string;
  proveedor?: string;
}
