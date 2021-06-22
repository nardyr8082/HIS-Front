export interface HealthUnit {
    id: number,
    nivel?: Array<Nivel>,
    nombre: string,
    direccion: string
}

export interface Nivel {
    id: number,
    nombre: string
}