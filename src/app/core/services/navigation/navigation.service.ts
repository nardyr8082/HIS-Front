import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  navBackend: any[] = [
    {
      displayName: 'Dashboard',
      iconName: ['home'],
      material: true,
      route: 'backend/dashboard',
      display: true,
    },
    {
      displayName: 'Estructura',
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
    {
      displayName: 'Seguridad',
      iconName: ['lock'],
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
      displayName: 'Mi Perfil',
      iconName: ['account_circle'],
      material: true,
      route: 'backend/perfil',
      display: true,
    },
  ];

  constructor() {}

  public getNavBackend() {
    return JSON.parse(JSON.stringify(this.navBackend));
  }
}
