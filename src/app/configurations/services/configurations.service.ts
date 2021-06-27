import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {
  private apiEndpoint = `${environment.apiUrl}configuracion`;
  constructor() { }
}
