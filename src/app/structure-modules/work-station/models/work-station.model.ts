export interface WorkStation {
  id: number;
  rol: Role;
  departamento: Departament;
  descripcion: string;
}
export interface Role {
  id: number;
  name: string;
}

export interface Departament {
  id: number;
  name: string;
  nombre?: string;
}
