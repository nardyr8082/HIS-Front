import { Injectable } from '@angular/core';
import { environment } from '../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../app/core/models/api-response.model';
import { Appointment } from '../models/appointment.model';
import { Patient } from 'src/app/patient/models/patient.model';
import { Servicesstock } from 'src/app/stock-modules/servicesstock/models/servicesstock.model';
import { User } from 'src/app/security-module/user/models/user.model';
import { Departament } from 'src/app/structure-modules/work-station/models/work-station.model';
import { StateAppointment } from 'src/app/stock-modules/stock-state-appointment/models/stock-state-appointment.model';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiEndpoint = `${environment.apiUrl}adm_cita`;
  private apiEndpointPatient = `${environment.apiUrl}paciente`;
  private apiEndpointUser = `${environment.apiUrl}usuario`;
  private apiEndpointServicesstock = `${environment.apiUrl}alm_servicio`;
  private apiEndpointDepartament = `${environment.apiUrl}departamento`;
  private apiEndpointStateAppointment = `${environment.apiUrl}adm_estado_cita`;

  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) { }

  getAppointment(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<Appointment>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<Appointment>>(this.apiEndpoint + queryParams);

  }

  private formatQueryParams(filters?: any, sortColumn?: string, sortDirection?: string, pageIndex?: number, pageSize?: number): string {
    let queryParams = '';

    if (filters) {
      for (const property in filters) {
        queryParams += queryParams.length > 0 ? '&' : '?';
        queryParams += `${property}=${filters[property]}`;
      }
    }
    if (sortColumn) {
      let ordering = '';

      if (sortDirection === 'desc') {
        ordering = '-';
      }
      ordering += sortColumn;
      queryParams += queryParams.length > 0 ? '&' : '?';
      queryParams += `ordering=${ordering}`;
    }

    if (pageIndex !== undefined) {
      queryParams += queryParams.length > 0 ? '&' : '?';
      queryParams += `page=${pageIndex}`;
    }

    if (pageSize !== undefined) {
      queryParams += queryParams.length > 0 ? '&' : '?';
      queryParams += `page_size=${pageSize}`;
    }

    return queryParams;
  }

  getUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointUser);
  }

  getPatient(): Observable<ApiResponse<Patient>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointPatient);
  }

  getServicesstock(): Observable<ApiResponse<Servicesstock>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointServicesstock);
  }

  getStateAppointment(): Observable<ApiResponse<StateAppointment>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointStateAppointment);
  }

  getDepartament(): Observable<ApiResponse<Departament>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointDepartament);
  }

  createAppointment(data: Appointment): Observable<Appointment> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editAppointment(data: Appointment): Observable<Appointment> {

    return this.http.patch<Appointment>(`${this.apiEndpoint}/${data.id}/`, data);

  }

  deleteAppointment(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
