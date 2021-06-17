import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  navBackend: any[] = [
    {
      displayName: 'Estructura',
      iconName: ['domain'],
      material: true,
      children: [
        {
          displayName: 'Nivel Organizacional',
          iconName: ['account_balance'],
          route: 'backend/about-us/about',
          material: true,
          display: true,
        },
        {
          displayName: 'Unidad de Salud',
          iconName: ['local_hospital'],
          route: 'backend/about-us/about',
          material: true,
          display: true,
        },
        {
          displayName: 'Departamento',
          iconName: ['apartment'],
          route: 'backend/about-us/about',
          material: true,
          display: true,
        },
        {
          displayName: 'Puesto de Trabajo',
          iconName: ['store'],
          route: 'trace-actions',
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
          route: 'backend/about-us/about',
          material: true,
          display: true,
        },
        {
          displayName: 'Categoria Docente',
          iconName: ['radio_button_unchecked'],
          route: 'backend/about-us/about',
          material: true,
          display: true,
        },
        {
          displayName: 'Sexo',
          iconName: ['radio_button_unchecked'],
          route: 'backend/about-us/about',
          material: true,
          display: true,
        },
        {
          displayName: 'Tipo Documento Id',
          iconName: ['radio_button_unchecked'],
          route: 'trace-actions',
          material: true,
          display: true,
        },
        {
          displayName: 'Especialidad',
          iconName: ['radio_button_unchecked'],
          route: 'backend/about-us/about',
          material: true,
          display: true,
        },
        {
          displayName: 'Pais',
          iconName: ['radio_button_unchecked'],
          route: 'backend/about-us/about',
          material: true,
          display: true,
        },
        {
          displayName: 'Estado',
          iconName: ['radio_button_unchecked'],
          route: 'backend/about-us/about',
          material: true,
          display: true,
        },
        {
          displayName: 'Estado Civil',
          iconName: ['radio_button_unchecked'],
          route: 'trace-actions',
          material: true,
          display: true,
        },
        {
          displayName: 'Municipio',
          iconName: ['radio_button_unchecked'],
          route: 'backend/about-us/about',
          material: true,
          display: true,
        },
        {
          displayName: 'Nacionalidad',
          iconName: ['radio_button_unchecked'],
          route: 'backend/about-us/about',
          material: true,
          display: true,
        },
        {
          displayName: 'Raza',
          iconName: ['radio_button_unchecked'],
          route: 'backend/about-us/about',
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
          route: 'backend/about-us/about',
          material: true,
          display: true,
        },
        {
          displayName: 'Roles',
          iconName: ['manage_accounts'],
          route: 'backend/about-us/about',
          material: true,
          display: true,
        },
        {
          displayName: 'Historial de acceso',
          iconName: ['receipt'],
          route: 'backend/about-us/about',
          material: true,
          display: true,
        },
        {
          displayName: 'Historial de acciones',
          iconName: ['offline_bolt'],
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
