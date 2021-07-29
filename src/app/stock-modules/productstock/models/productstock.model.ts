import { ProductFamily } from '../../classifiers/product-family/models/product-family.model';
import { Tax } from '../../classifiers/tax/models/tax.model';
import { Measure } from '../../classifiers/measure/models/measure.model';
import { Program } from '../../classifiers/program/models/program.model';
import { Attribute } from '../../classifiers/attribute/models/attribute.model';

export interface Productstock {
  id?: any;
  codigo?: string;
  descripcion?: string;
  activo?: boolean;
  activo_string?: string;
  unidad_medida?: Measure;
  familia?: ProductFamily;
  impuesto?: Tax;
  programa?: Program;
  atributos?: Array<Attribute>;
  unidad_medida_string?: string;
  familia_string?: string;
  impuesto_string?: string;
  programa_string?: string;
  atributos_string?: string;
}
