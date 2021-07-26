export interface Pricechanges {
  id: number;
  fecha?: string;
  fechaT?: string;
  hora?: string;
  precio_viejo?: number,
  precio_nuevo?: number;
  comentario?: string;
  lote?: number;
  usuario?: number;
}

