import { CatDocent } from './../../../nomenclator-modules/cat-docent/models/cat-docent.model';
import { CatScience } from './../../../nomenclator-modules/cat-science/models/cat-science.model';
import { Role } from './../../role/models/role.model';
export interface User {
  id: number;
  password?: string;
  last_login: Date;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: Date;
  persona: number;
  groups: Array<Role>;
  categ_docente: Array<CatDocent>;
  categ_cientifica: Array<CatScience>;
  especialidad: Array<any>;
}
