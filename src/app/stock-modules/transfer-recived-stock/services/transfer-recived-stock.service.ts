import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { TransferRecivedStock } from '../models/transfer-recived-stock.model';

//

@Injectable({
  providedIn: 'root',
})
export class TransferRecivedService {
  private apiEndpoint = `${environment.apiUrl}alm_transf_recibida_almacen`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getTransferRecivedStock(
    filter: any,
    sortColumn: string,
    sortDirection: string,
    page: number,
    pageSize: number,
  ): Observable<ApiResponse<TransferRecivedStock>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<TransferRecivedStock>>(this.apiEndpoint + queryParams);
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

  createTransferRecivedStock(data: TransferRecivedStock): Observable<TransferRecivedStock> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editTransferRecivedStock(data: TransferRecivedStock): Observable<TransferRecivedStock> {
    return this.http.patch<TransferRecivedStock>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteTransferRecivedStock(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
