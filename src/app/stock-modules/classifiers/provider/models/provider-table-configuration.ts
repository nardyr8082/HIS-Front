import { DEFAULT_PAGINATION_SIZE } from '../../../../core/models/api-response.model';

export const PROVIDER_TABLE_CONFIGURATION = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['nombre', 'descripcion', 'telefono', 'correo', 'representante'],
  columnsName: ['Nombre', 'Descripción', 'Teléfono', 'Correo', 'Representante'],
  tableFilters: [
    {
      name: 'nombre',
      type: 'text',
      title: 'Nombre',
    },
    {
      name: 'descripcion',
      type: 'text',
      title: 'Descripción',
    },
    {
      name: 'telefono',
      type: 'text',
      title: 'Teléfono',
    },
    {
      name: 'correo',
      type: 'text',
      title: 'Correo',
    },
    {
      name: 'representante',
      type: 'text',
      title: 'Representante',
    },
  ],
};
