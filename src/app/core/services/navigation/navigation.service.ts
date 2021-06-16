import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  navBackend: any[] = [
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
