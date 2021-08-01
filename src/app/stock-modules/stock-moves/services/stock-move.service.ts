import { StockMove } from './../models/stock-move.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { map } from 'rxjs/operators';

//

@Injectable({
  providedIn: 'root',
})
export class StockMoveService {
  private apiEndpoint = `${environment.apiUrl}alm_movimiento`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getStockMove(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<StockMove>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<StockMove>>(this.apiEndpoint + queryParams);
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

  getStockMoveById(id: string): Observable<StockMove> {
    return this.http.get<any>(`${this.apiEndpoint}/${id}/`);
  }

  createStockMove(data: StockMove): Observable<StockMove> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editStockMove(data: StockMove): Observable<StockMove> {
    return this.http.put<StockMove>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteStockMove(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
  checkNumber(num: string, id: any) {
    return this.http.get<any>(this.apiEndpoint).pipe(
      map((res) => {
        const miarre = res.results.filter((valores) => valores.codigo === num);
        if (miarre.length == 1) {
          if (miarre[0].id === id) {
            return { isNumberAvailable: true };
          }
          return { isNumberAvailable: false };
        }
        return { isNumberAvailable: miarre.length !== 1 };
      }),
    );
  }
}
