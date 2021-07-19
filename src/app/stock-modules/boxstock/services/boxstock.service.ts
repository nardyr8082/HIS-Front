import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable, of } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Boxstock } from '../models/boxstock.model';
import { delay, map } from 'rxjs/operators';

//

@Injectable({
  providedIn: 'root',
})
export class BoxstockService {
  private apiEndpoint = `${environment.apiUrl}alm_caja`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getBoxstock(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<Boxstock>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<Boxstock>>(this.apiEndpoint + queryParams);
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

  createBoxstock(data: Boxstock): Observable<Boxstock> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editBoxstock(data: Boxstock): Observable<Boxstock> {
    return this.http.patch<Boxstock>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteBoxstock(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }

  checkNumber(num: string) {
    return this.http.get<any>(this.apiEndpoint).pipe(
      map((res) => {
        const miarre = res.results.filter((valores) => valores.nro === num);
        return { isNumberAvailable: miarre.length !== 1 };
      }),
    );
  }
}
