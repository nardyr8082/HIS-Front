import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';
export const Aftselfresources_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nro_inventario', 'activo', 'id_recurso_nombre', 'id_departamento_nombre', 'paciente_nombre', 'id_estado_descripcion'],
  columnsName: ['Número Inventario', 'Activo', 'Recurso', 'Departamento', 'Paciente', 'Estado'],
  tableFilters: [
    {
      name: 'nro_inventario',
      type: 'text',
      title: 'Número Inventario',
    },
    {
      name: 'activo',
      type: 'text',
      title: 'Activo',
    },
    {
      name: 'id_recurso',
      type: 'select',
      items: [],
      title: 'Recurso',
    },
    {
      name: 'id_departamento',
      type: 'select',
      items: [],
      title: 'Departamento',
    },
    {
      name: 'paciente',
      type: 'select',
      items: [],
      title: 'Paciente',
    },
    {
      name: 'id_estado',
      type: 'select',
      items: [],
      title: 'Estado',
    }
  ],
};
