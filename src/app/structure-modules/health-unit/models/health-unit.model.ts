export interface HealthUnit {
    id: number,
    nivel?: Nivel,
    nombre: string,
    direccion: string
}

export interface Nivel {
    id: number,
    nombre: string
}
