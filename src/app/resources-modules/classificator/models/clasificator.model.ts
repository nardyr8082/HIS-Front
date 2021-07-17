import { ResourceType } from './../../type/models/type';
export interface Clasificator {
  id?: string;
  nombre?: string;
  tipo?: ResourceType;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
}
