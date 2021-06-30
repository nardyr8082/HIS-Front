import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { environment } from '../../../environments/environment';
import { Configurations } from '../models/configurations.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationsService {
  private apiEndpoint = `${environment.apiUrl}configuracion`;

  constructor(private http: HttpClient) {}

  getConfiguration(): Observable<ApiResponse<Configurations>> {
    return this.http.get<ApiResponse<Configurations>>(this.apiEndpoint);
  }
}
