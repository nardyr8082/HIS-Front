import { Servicesstock } from './../../servicesstock/models/servicesstock.model';
import { Facture } from './../../facture/models/facture.model';
export interface FactureServiceModel {
  id?: string;
  cantidad?: number;
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
  servicio?: Servicesstock;
}
