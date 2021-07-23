import { Servicesstock } from './../../servicesstock/models/servicesstock.model';
import { Facture } from './../../facture/models/facture.model';
export interface FactureServiceModel {
  id?: string;
  cantidad?: number;
  factura?: Facture;
  servicio?: Servicesstock;
}
