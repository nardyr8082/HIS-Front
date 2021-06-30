import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { WorkStation } from '../models/work-station.model';
//

@Injectable({
  providedIn: 'root',
})
export class WorkStationService {
  private apiEndpoint = `${environment.apiUrl}puesto_de_trabajo`;
  private apiDepartamentEndpoint = `${environment.apiUrl}departamento`;
  private apiGroupEndpoint = `${environment.apiUrl}auth/grupo`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getWorkStations(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<WorkStation>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<WorkStation>>(this.apiEndpoint + queryParams);
  }

  getDepartaments() {
    return this.http.get<ApiResponse<any>>(this.apiDepartamentEndpoint);
  }
  getRole(id: number = null) {
    let queryParams = '?';
    if (id && id != null) {
      queryParams += `pt__id=${id}`;
    } else {
      queryParams += `pt__view=true`;
    }
    return this.http.get<ApiResponse<any>>(this.apiGroupEndpoint + queryParams);
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

  createWorkStation(data: WorkStation): Observable<WorkStation> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editWorkStation(data: WorkStation): Observable<WorkStation> {
    return this.http.put<WorkStation>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteWorkStation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
