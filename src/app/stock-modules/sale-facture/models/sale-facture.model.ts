export interface Facture {
  id: number;
  nro_factura?: number;
  fecha_emision?: string;
  fecha_entrega?: string;
  importe_total?: number;
  descuento?: number;
  arancel?: number;
  comentarios?: string;
  operacion_comercial?: string;
  estado?: string;
  comercial?: string;
}
