import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from 'src/app/core/models/api-response.model';
import { CatDocent } from '../models/cat-docent.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatDocentService {
  private apiEndpoint = `${environment.apiUrl}categoria_docente`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';
  private defaultSortDirection: string = 'desc';
  private defaultPage: number = 0;
  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getCatDocent(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<CatDocent>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<CatDocent>>(this.apiEndpoint + queryParams);
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

  createCatDocent(data: CatDocent): Observable<CatDocent> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editCatDocent(data: CatDocent): Observable<CatDocent> {
    return this.http.put<CatDocent>(`${this.apiEndpoint}/${data.id}/`, data)
  }

  deleteCatDocent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
