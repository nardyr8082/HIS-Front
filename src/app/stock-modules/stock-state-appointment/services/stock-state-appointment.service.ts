import { ApiResponse } from './../../../core/models/api-response.model';
import { StateAppointment } from '../models/stock-state-appointment.model';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

//

@Injectable({
  providedIn: 'root',
})
export class StateAppointmentService {
  private apiEndpoint = `${environment.apiUrl}adm_estado_cita`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getStateAppointments(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<StateAppointment>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<StateAppointment>>(this.apiEndpoint + queryParams);
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

  createStateAppointment(data: StateAppointment): Observable<StateAppointment> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editStateAppointment(data: StateAppointment): Observable<StateAppointment> {
    return this.http.put<StateAppointment>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteStateAppointment(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
