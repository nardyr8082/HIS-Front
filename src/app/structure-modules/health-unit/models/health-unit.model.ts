export interface HealthUnit {
    id: number;
    nivel?: Nivel;
    nombre: string;
    direccion: string
    levels_string?: string;
}

export interface Nivel {
    id: number;
    name: string;
}
