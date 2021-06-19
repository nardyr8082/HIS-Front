import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Nationality } from '../models/nationality.model';

//

@Injectable({
  providedIn: 'root',
})
export class NationalityService {
  private apiEndpoint = `${environment.apiUrl}nacionalidad`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'descripcion';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getNationalities(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<Nationality>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<Nationality>>(this.apiEndpoint + queryParams);
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

  createNationality(data: Nationality): Observable<Nationality> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editNationality(data: Nationality): Observable<Nationality> {
    return this.http.patch<Nationality>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteNationality(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
