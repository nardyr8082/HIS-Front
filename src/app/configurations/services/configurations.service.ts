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

  createConfiguration(data: Configurations): Observable<Configurations> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editConfiguration(data: Configurations): Observable<Configurations> {
    return this.http.patch<Configurations>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  uploadImage(data, id): Observable<any> {
    return this.http.patch<any>(`${this.apiEndpoint}/${id}/`, data);
  }
}
