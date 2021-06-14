import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  navBackend: any[] = [
    {
      displayName: 'Gestión',
      route: null,
      material: true,
      display: true,
      header: true,
    },
    {
      displayName: 'Business',
      iconName: ['business_center'],
      route: 'backend/business',
      material: true,
      children: [],
      display: true,
    },
    {
      displayName: 'Mail Origin',
      iconName: ['games'],
      route: 'backend/mail-origin',
      material: true,
      children: [],
      display: true,
    },
    {
      displayName: 'Mail Template',
      iconName: ['receipt'],
      route: 'backend/mail-template',
      material: true,
      children: [],
      display: true,
    },
    {
      displayName: 'Mail Template Params',
      iconName: ['subject'],
      route: 'backend/mail-template-param',
      material: true,
      children: [],
      display: true,
    },
    {
      displayName: 'Attached to Mail',
      iconName: ['attach_file'],
      route: 'backend/attached-mail',
      material: true,
      children: [],
      display: true,
    },
    {
      displayName: 'Language Info',
      iconName: ['language'],
      route: 'backend/language',
      material: true,
      children: [],
      display: true,
    },
    {
      displayName: 'Send Mail',
      iconName: ['email'],
      route: 'backend/send-mail-testing',
      material: true,
      children: [],
      display: true,
    },
    {
      displayName: 'Usuarios',
      iconName: ['person'],
      route: 'backend/users',
      material: true,
      children: [],
      display: true,
    },
    {
      displayName: 'Perfil',
      type: 'Perfil',
      iconName: ['build'],
      route: 'backend/perfil',
      material: true,
      children: [],
      display: true,
    },
    {
      displayName: 'Reportes',
      iconName: ['business'],
      material: true,
      children: [
        {
          displayName: 'Características',
          iconName: ['format_size'],
          route: 'backend/about-us/about',
          material: true,
          display: true,
        },
        {
          displayName: 'Valores',
          iconName: ['format_size'],
          route: 'backend/about-us/valores',
          material: true,
          display: true,
        },
      ],
      display: true,
    },
  ];

  constructor() {}

  public getNavBackend() {
    return JSON.parse(JSON.stringify(this.navBackend));
  }
}
