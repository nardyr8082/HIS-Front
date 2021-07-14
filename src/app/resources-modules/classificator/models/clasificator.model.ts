import { ResourceAttribute } from './../../attribute/models/attribute.model';
import { ResourceType } from './../../type/models/type';
export interface Clasificator {
  id?: string;
  nombre?: string;
  tipo?: ResourceType;
  atributos: Array<ResourceAttribute>;
}
