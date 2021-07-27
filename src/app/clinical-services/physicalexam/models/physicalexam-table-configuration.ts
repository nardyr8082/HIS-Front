import { TableConfiguration } from '../../../../../src/app/shared/models/table-configuration.model';
import { DEFAULT_PAGINATION_SIZE } from '../../../../app/core/models/api-response.model';
export const Physicalexam_TABLE_CONFIGURATION: TableConfiguration = {
  paginationSize: DEFAULT_PAGINATION_SIZE,
  displayedColumns: ['ta', 'fr', 'temperatura', 'peso', 'altura', 'imc', 'impresion_general', 'constitucion', 'actitud', 'decubito', 'marcha', 'observaciones_generales', 'sesion_clinica_string'],
  columnsName: ['Ta', 'Fr', 'Temperatura', 'Peso', 'Altura', 'Imc', 'Impresión General', 'Constitución', 'Actitud', 'Decubito', 'Marcha', 'Observaciones Generales',  'Sesión Clínica'],
  tableFilters: [
    {
      name: 'ta',
      type: 'text',
      title: 'Fecha Ingreso',
    },
    {
      name: 'fr',
      type: 'text',
      title: 'Fr',
    },
    {
      name: 'temperatura',
      type: 'text',
      title: 'Temperatura',
    },
    {
      name: 'peso',
      type: 'text',
      title: 'Peso',
    },
    {
      name: 'altura',
      type: 'text',
      title: 'Altura',
    },
    {
      name: 'imc',
      type: 'text',
      title: 'Imc',
    },
    {
      name: 'impresion_general',
      type: 'text',
      title: 'Impresión General',
    },
    {
      name: 'constitucion',
      type: 'text',
      title: 'Constitución',
    },
    {
      name: 'actitud',
      type: 'text',
      title: 'Actitud',
    },
    {
      name: 'decubito',
      type: 'text',
      title: 'Decubito',
    },
    {
      name: 'marcha',
      type: 'text',
      title: 'Marcha',
    },
    {
      name: 'observaciones_generales',
      type: 'text',
      title: 'Observaciones Generales',
    },
    {
      name: 'sesion_clinica',
      title: 'Sesión Clínica',
      type: 'select',
      items: [],
    }
  ],
};
