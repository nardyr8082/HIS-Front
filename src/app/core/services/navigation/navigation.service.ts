import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  navBackend: any[] = [
    {
      displayName: 'Inicio',
      iconName: ['home'],
      material: true,
      route: 'backend/dashboard',
      display: true,
    },
    {
      displayName: 'Sistema',
      iconName: ['dashboard'],
      material: true,
      children: [
        {
          displayName: 'Usuarios',
          iconName: ['perm_identity'],
          route: 'user',
          material: true,
          display: true,
        },
        {
          displayName: 'Pacientes',
          iconName: ['supervisor_account'],
          route: 'patient',
          material: true,
          display: true,
        },
        {
          displayName: 'Entidades',
          iconName: ['domain'],
          material: true,
          children: [
            {
              displayName: 'Ubicación Organizacional',
              iconName: ['account_balance'],
              route: 'org-level',
              material: true,
              display: true,
            },
            {
              displayName: 'Unidad de Salud',
              iconName: ['local_hospital'],
              route: 'health-unit',
              material: true,
              display: true,
            },
            {
              displayName: 'Departamento',
              iconName: ['location_city'],
              route: 'office',
              material: true,
              display: true,
            },
            {
              displayName: 'Puesto de Trabajo',
              iconName: ['store'],
              route: 'work-station',
              material: true,
              display: true,
            },
          ],
          display: true,
        },
        {
          displayName: 'Sistema',
          iconName: ['line_style'],
          route: 'sistem',
          material: true,
          display: true,
        },
        {
          displayName: 'Seguridad',
          iconName: ['lock'],
          material: true,
          children: [
            {
              displayName: 'Roles',
              iconName: ['assignment_ind'],
              route: 'roles',
              material: true,
              display: true,
            },
            {
              displayName: 'Historial de acceso',
              iconName: ['receipt'],
              route: 'trace-access',
              material: true,
              display: true,
            },
            {
              displayName: 'Historial de acciones',
              iconName: ['list_alt'],
              route: 'trace-actions',
              material: true,
              display: true,
            },
          ],
          display: true,
        },
        {
          displayName: 'Clasificadores',
          iconName: ['build'],
          material: true,
          children: [
            {
              displayName: 'Categoria Cientifica',
              iconName: ['radio_button_unchecked'],
              route: 'cat-science',
              material: true,
              display: true,
            },
            {
              displayName: 'Categoria Docente',
              iconName: ['radio_button_unchecked'],
              route: 'cat-docent',
              material: true,
              display: true,
            },
            {
              displayName: 'Profesión',
              iconName: ['radio_button_unchecked'],
              route: 'profession',
              material: true,
              display: true,
            },
            {
              displayName: 'Sexo',
              iconName: ['radio_button_unchecked'],
              route: 'gender',
              material: true,
              display: true,
            },
            {
              displayName: 'Grupo Sangíneo',
              iconName: ['radio_button_unchecked'],
              route: 'blood-type',
              material: true,
              display: true,
            },
            {
              displayName: 'Tipo Documento Id',
              iconName: ['radio_button_unchecked'],
              route: 'doc-type-id',
              material: true,
              display: true,
            },
            {
              displayName: 'Especialidad',
              iconName: ['radio_button_unchecked'],
              route: 'specialty',
              material: true,
              display: true,
            },
            {
              displayName: 'Estado Civil',
              iconName: ['radio_button_unchecked'],
              route: 'civil_status',
              material: true,
              display: true,
            },
            {
              displayName: 'Nacionalidad',
              iconName: ['radio_button_unchecked'],
              route: 'nationality',
              material: true,
              display: true,
            },
            {
              displayName: 'Raza',
              iconName: ['radio_button_unchecked'],
              route: 'race',
              material: true,
              display: true,
            },
            {
              displayName: 'Pais',
              iconName: ['radio_button_unchecked'],
              route: 'country',
              material: true,
              display: true,
            },
            {
              displayName: 'Provincia',
              iconName: ['radio_button_unchecked'],
              route: 'state',
              material: true,
              display: true,
            },
            {
              displayName: 'Distrito',
              iconName: ['radio_button_unchecked'],
              route: 'municipality',
              material: true,
              display: true,
            },
          ],
          display: true,
        },
      ],
      display: true,
    },
    {
      displayName: 'Servicios Clinicos',
      iconName: ['assignment'],
      material: true,
      children: [
        {
          displayName: 'Gestionar Admisión',
          iconName: ['input'],
          children: [
            {
              displayName: 'Sistema',
              iconName: ['radio_button_unchecked'],
              route: 'system-manager',
              material: true,
              display: true,
            },
          ],
          material: true,
          display: true,
        },
        {
          displayName: 'Hitoria Clínica',
          iconName: ['note'],
          children: [
            {
              displayName: 'Historia Clínica',
              iconName: ['radio_button_unchecked'],
              route: 'clinical-services/clinic-history',
              material: true,
              display: true,
            },
            {
              displayName: 'Crear Tabla dinamica',
              iconName: ['radio_button_unchecked'],
              route: 'clinical-services/meta-table',
              material: true,
              display: true,
            },
            {
              displayName: 'Nomenclador Tabla dinamica',
              iconName: ['radio_button_unchecked'],
              route: 'clinical-services/meta-field',
              material: true,
              display: true,
            },
          ],
          material: true,
          display: true,
        },
        {
          displayName: 'Núcleo Funcional',
          iconName: ['center_focus_strong'],
          route: '',
          material: true,
          display: true,
        },
        {
          displayName: 'Cita',
          iconName: ['today'],
          route: '',
          material: true,
          display: true,
        },
        {
          displayName: 'Clasificadores',
          iconName: ['build'],
          material: true,
          children: [
            {
              displayName: 'Enfermedades',
              iconName: ['radio_button_unchecked'],
              route: 'diseases',
              material: true,
              display: true,
            },
          ],
          display: true,
        },
      ],
      display: true,
    },
    {
      displayName: 'Recursos Médicos',
      iconName: ['queue'],
      material: true,
      children: [
        {
          displayName: 'Programas',
          iconName: ['dns'],
          route: '',
          material: true,
          display: true,
        },
        {
          displayName: 'Inventarios',
          iconName: ['view_list'],
          route: '',
          material: true,
          display: true,
        },
        {
          displayName: 'Movimientos',
          iconName: ['sync_alt'],
          route: '',
          material: true,
          display: true,
        },
        {
          displayName: 'Esquema de trabajo',
          iconName: ['work'],
          route: '',
          material: true,
          display: true,
        },
        {
          displayName: 'Nomencladores',
          iconName: ['build'],
          material: true,
          children: [
            {
              displayName: 'Categoria Cientifica',
              iconName: ['radio_button_unchecked'],
              route: 'cat-science',
              material: true,
              display: true,
            },
            {
              displayName: 'Categoria Docente',
              iconName: ['radio_button_unchecked'],
              route: 'cat-docent',
              material: true,
              display: true,
            },
            {
              displayName: 'Profesión',
              iconName: ['radio_button_unchecked'],
              route: 'profession',
              material: true,
              display: true,
            },
            {
              displayName: 'Sexo',
              iconName: ['radio_button_unchecked'],
              route: 'gender',
              material: true,
              display: true,
            },
            {
              displayName: 'Tipo Documento Id',
              iconName: ['radio_button_unchecked'],
              route: 'doc-type-id',
              material: true,
              display: true,
            },
            {
              displayName: 'Especialidad',
              iconName: ['radio_button_unchecked'],
              route: 'specialty',
              material: true,
              display: true,
            },
            {
              displayName: 'Estado Civil',
              iconName: ['radio_button_unchecked'],
              route: 'civil_status',
              material: true,
              display: true,
            },
            {
              displayName: 'Nacionalidad',
              iconName: ['radio_button_unchecked'],
              route: 'nationality',
              material: true,
              display: true,
            },
            {
              displayName: 'Raza',
              iconName: ['radio_button_unchecked'],
              route: 'race',
              material: true,
              display: true,
            },
            {
              displayName: 'Pais',
              iconName: ['radio_button_unchecked'],
              route: 'country',
              material: true,
              display: true,
            },
            {
              displayName: 'Provincia',
              iconName: ['radio_button_unchecked'],
              route: 'state',
              material: true,
              display: true,
            },
            {
              displayName: 'Distrito',
              iconName: ['radio_button_unchecked'],
              route: 'municipality',
              material: true,
              display: true,
            },
          ],
          display: true,
        },
      ],
      display: true,
    },
    {
      displayName: 'Recursos',
      iconName: ['work'],
      material: true,
      display: true,
      children: [
        {
          displayName: 'Recurso Propio',
          iconName: ['radio_button_unchecked'],
          route: 'resource-self',
          material: true,
          display: true,
        },
        {
          displayName: 'Estado de Recurso',
          iconName: ['radio_button_unchecked'],
          route: 'resource-status',
          material: true,
          display: true,
        },
        {
          displayName: 'Tipo de Recurso',
          iconName: ['radio_button_unchecked'],
          route: 'resource-type',
          material: true,
          display: true,
        },
        {
          displayName: 'Clasificador',
          iconName: ['radio_button_unchecked'],
          route: 'resource-clasificator',
          material: true,
          display: true,
        },
      ],
    },
    {
      displayName: 'Estadísticas',
      iconName: ['equalizer'],
      material: true,
      children: [
        {
          displayName: 'Alarmas de stock',
          iconName: ['alarm'],
          route: '',
          material: true,
          display: true,
        },
        {
          displayName: 'Registros Médicos',
          iconName: ['folder_open'],
          route: '',
          material: true,
          display: true,
        },
        {
          displayName: 'Indicadores',
          iconName: ['short_text'],
          route: '',
          material: true,
          display: true,
        },
        {
          displayName: 'Programas',
          iconName: ['list_alt'],
          route: '',
          material: true,
          display: true,
        },
        {
          displayName: 'Epidemiología',
          iconName: ['create_new_folder'],
          route: '',
          material: true,
          display: true,
        },
      ],
      display: true,
    },
    {
      displayName: 'Salida',
      iconName: ['assessment'],
      material: true,
      children: [
        {
          displayName: 'Reporte 1',
          iconName: ['picture_as_pdf'],
          route: '',
          material: true,
          display: true,
        },
        {
          displayName: 'Reporte 2',
          iconName: ['picture_as_pdf'],
          route: '',
          material: true,
          display: true,
        },
        {
          displayName: 'Reporte 3',
          iconName: ['picture_as_pdf'],
          route: '',
          material: true,
          display: true,
        },
        {
          displayName: 'Reporte 4',
          iconName: ['picture_as_pdf'],
          route: '',
          material: true,
          display: true,
        },
      ],
      display: true,
    },
    {
      displayName: 'Almacén',
      iconName: ['store'],
      material: true,
      children: [
        {
          displayName: 'Existencia',
          iconName: ['swap_vertical_circle'],
          route: 'existence',
          material: true,
          display: true,
        },
        {
          displayName: 'Caja',
          iconName: ['swap_vertical_circle'],
          route: 'stock-box',
          material: true,
          display: true,
        },
        {
          displayName: 'Producto',
          iconName: ['swap_vertical_circle'],
          route: 'stock-product',
          material: true,
          display: true,
        },
        {
          displayName: 'Factura',
          iconName: ['swap_vertical_circle'],
          route: 'facture',
          material: true,
          display: true,
        },
        {
          displayName: 'Servicio',
          iconName: ['swap_vertical_circle'],
          route: 'stock-services',
          material: true,
          display: true,
        },
        {
          displayName: 'Factura de Servicio',
          iconName: ['swap_vertical_circle'],
          route: 'facture-service',
          material: true,
          display: true,
        },
        {
          displayName: 'Venta',
          iconName: ['swap_vertical_circle'],
          route: 'sale',
          material: true,
          display: true,
        },
        {
          displayName: 'Estado de cita',
          iconName: ['swap_vertical_circle'],
          route: 'stock-state-appointment',
          material: true,
          display: true,
        },
        {
          displayName: 'Distribucion de Lote',
          iconName: ['swap_vertical_circle'],
          route: 'batch-distribution',
          material: true,
          display: true,
        },
        {
          displayName: 'Inventario',
          iconName: ['swap_vertical_circle'],
          material: true,
          children: [
            {
              displayName: 'Diferencia',
              iconName: ['swap_vertical_circle'],
              route: 'warehouse-inventory-difference',
              material: true,
              display: true,
            },
            {
              displayName: 'Inventario',
              iconName: ['swap_vertical_circle'],
              route: 'stock-inventory',
              material: true,
              display: true,
            },
          ],
          display: true,
        },
        {
          displayName: 'Conteo Inventario',
          iconName: ['swap_vertical_circle'],
          route: 'inventory-count',
          material: true,
          display: true,
        },
        {
          displayName: 'Cambio Precio',
          iconName: ['swap_vertical_circle'],
          route: 'change-price',
          material: true,
          display: true,
        },
        {
          displayName: 'Clasificadores',
          iconName: ['build'],
          material: true,
          children: [
            {
              displayName: 'Medida',
              iconName: ['radio_button_unchecked'],
              route: 'stock-measure',
              material: true,
              display: true,
            },
            {
              displayName: 'Impuestos',
              iconName: ['radio_button_unchecked'],
              route: 'stock-tax',
              material: true,
              display: true,
            },
            {
              displayName: 'Programa',
              iconName: ['radio_button_unchecked'],
              route: 'stock-program',
              material: true,
              display: true,
            },
            {
              displayName: 'Operación Comercial',
              iconName: ['radio_button_unchecked'],
              route: 'stock-commercial-operation',
              material: true,
              display: true,
            },
            {
              displayName: 'Proveedores',
              iconName: ['radio_button_unchecked'],
              route: 'provider',
              material: true,
              display: true,
            },
            {
              displayName: 'Atributo',
              iconName: ['radio_button_unchecked'],
              route: 'attribute',
              material: true,
              display: true,
            },
            {
              displayName: 'Categoría Producto',
              iconName: ['radio_button_unchecked'],
              route: 'stock-product-category',
              material: true,
              display: true,
            },
            {
              displayName: 'Estado Factura',
              iconName: ['radio_button_unchecked'],
              route: 'stock-invoice-status',
              material: true,
              display: true,
            },
            {
              displayName: 'Tipo de Movimiento',
              iconName: ['radio_button_unchecked'],
              route: 'move-type',
              material: true,
              display: true,
            },
            {
              displayName: 'Detalle Movimiento',
              iconName: ['radio_button_unchecked'],
              route: 'warehouse-movement-detail',
              material: true,
              display: true,
            },
            {
              displayName: 'Estado de Movimiento',
              iconName: ['radio_button_unchecked'],
              route: 'move-status',
              material: true,
              display: true,
            },
            {
              displayName: 'Estado de Inventario',
              iconName: ['radio_button_unchecked'],
              route: 'stock-invetory-status',
              material: true,
              display: true,
            },
            {
              displayName: 'Familia de Producto',
              iconName: ['radio_button_unchecked'],
              route: 'stock-product-family',
              material: true,
              display: true,
            },
          ],
          display: true,
        },
      ],
      display: true,
    },
    {
      displayName: 'Indicadores',
      iconName: ['short_text'],
      material: true,
      children: [
        {
          displayName: 'Indicador',
          iconName: ['radio_button_unchecked'],
          route: 'indicator',
          material: true,
          display: true,
        },
        {
          displayName: 'Tipo de Indicador',
          iconName: ['radio_button_unchecked'],
          route: 'indicator-type',
          material: true,
          display: true,
        },
        {
          displayName: 'Indicador Variable',
          iconName: ['radio_button_unchecked'],
          route: 'variable-indicator',
          material: true,
          display: true,
        },
        {
          displayName: 'Clasificadores',
          iconName: ['build'],
          material: true,
          children: [
            {
              displayName: 'Subcategoría',
              iconName: ['radio_button_unchecked'],
              route: 'indicator-subcategory',
              material: true,
              display: true,
            },
            {
              displayName: 'Categoría',
              iconName: ['radio_button_unchecked'],
              route: 'indicator-category',
              material: true,
              display: true,
            },
            {
              displayName: 'Frecuencia',
              iconName: ['radio_button_unchecked'],
              route: 'indicator-frequency',
              material: true,
              display: true,
            },
            {
              displayName: 'Subprograma',
              iconName: ['radio_button_unchecked'],
              route: 'subprogram',
              material: true,
              display: true,
            },
          ],
          display: true,
        },
      ],
      display: true,
    },
    {
      displayName: 'Mi Perfil',
      iconName: ['account_circle'],
      material: true,
      route: 'backend/perfil',
      display: true,
    },
    {
      displayName: 'Configuración',
      iconName: ['settings'],
      material: true,
      route: 'configurations',
      display: true,
    },
  ];

  constructor() {}

  public getNavBackend() {
    return JSON.parse(JSON.stringify(this.navBackend));
  }
}
