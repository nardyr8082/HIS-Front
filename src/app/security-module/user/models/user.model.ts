import { Profession } from 'src/app/nomenclator-modules/profession/models/profession.model';
import { Person } from 'src/app/shared/models/Person.model';
import { CatDocent } from './../../../nomenclator-modules/cat-docent/models/cat-docent.model';
import { CatScience } from './../../../nomenclator-modules/cat-science/models/cat-science.model';
import { Role } from './../../role/models/role.model';
export interface User {
  id?: number;
  password?: string;
  last_login?: Date;
  is_superuser?: boolean;
  is_online?: boolean;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  is_staff?: boolean;
  active?: boolean;
  date_joined?: Date;
  persona?: Person;
  groups?: Array<Role>;
  categ_docente?: Array<CatDocent>;
  categ_cientifica?: Array<CatScience>;
  especialidad?: Array<any>;
  profesion?: Profession;
}
