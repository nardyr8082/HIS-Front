export interface Person {
  id: number;
  tipo_doc: Item;
  nacionalidad: Item;
  municipio: Item;
  estado: Item;
  pais: Item;
  nro_identificacion: string;
  fecha_nacimiento: string;
  profesion: Item;
  ocupacion: string;
  foto: string;
  direccion: string;
  numero: string;
  cod_postal: string;
  nombre_madre: string;
  nombre_padre: string;
  contacto_emergencia: string;
  telefono_emergencia: string;
  telefono_casa: string;
  telefono_trabajo: string;
  telefono_movil: string;
  email: string;
  sexo: any;
  grupo_sanguineo: any;
  qr_code: string;
  barrio: string;
}

interface Item {
  id: number;
  name: string;
  descripcion?: string;
  nombre?: string;
}
