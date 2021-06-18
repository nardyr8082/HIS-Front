import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { CatScience } from '../models/cat-science.model';

//

@Injectable({
  providedIn: 'root',
})
export class CatScienceService {
  private apiEndpoint = `${environment.apiUrl}categoria_cientifica`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'descripcion';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getCatScience(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<CatScience>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<CatScience>>(this.apiEndpoint + queryParams);
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

  createCatScience(data: CatScience): Observable<CatScience> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editCatScience(data: CatScience): Observable<CatScience> {
    return this.http.put<CatScience>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteCatScience(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
