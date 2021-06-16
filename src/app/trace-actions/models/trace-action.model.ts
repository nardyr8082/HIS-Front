export interface TraceAction {
  id: number;
  fecha?: string;
  hora?: string;
  ip?: string;
  data_old?: boolean;
  data_new?: boolean;
  objeto?: number;
  usuario?: number;
  evento?: number;
}
