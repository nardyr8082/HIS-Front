import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable, of } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { delay, map } from 'rxjs/operators';
import { Productstock } from '../models/productstock.model';

//

@Injectable({
  providedIn: 'root',
})
export class ProductstockService {
  private apiEndpoint = `${environment.apiUrl}alm_producto`;
  private existo = false;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getProductstock(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<Productstock>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<Productstock>>(this.apiEndpoint + queryParams);
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

  createProductstock(data: Productstock): Observable<Productstock> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editProductstock(data: Productstock): Observable<Productstock> {
    return this.http.patch<Productstock>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteProductstock(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
  getReal() {
    return this.http.get<any>(this.apiEndpoint);
  }
  checkNumber(num: string, id: any) {
    return this.http.get<any>(this.apiEndpoint).pipe(
      map((res) => {
        const miarre = res.results.filter((valores) => valores.codigo === num);
        if (miarre.length == 1) {
          if (miarre[0].id === id){
            return { isNumberAvailable: true };
          }
          return { isNumberAvailable: false };
        }
        return { isNumberAvailable: miarre.length !== 1 };
      }),
    );
  }
}
