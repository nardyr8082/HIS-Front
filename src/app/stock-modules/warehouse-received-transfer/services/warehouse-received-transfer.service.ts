import { environment } from '../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../app/core/models/api-response.model';
import { WarehouseReceivedTransfer } from './../models/warehouse-received-transfer.model';
import { WarehouseMove } from '../../warehouse-movement-detail/models/warehouse-move.model';

@Injectable({
  providedIn: 'root'
})
export class WarehouseReceivedTransferService {
  private apiEndpoint = `${environment.apiUrl}alm_transf_recibida_almacen`;
  private apiEndpointMovement = `${environment.apiUrl}alm_movimiento`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) { }

  getWarehouseReceivedTransfer(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<WarehouseReceivedTransfer>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<WarehouseReceivedTransfer>>(this.apiEndpoint + queryParams);

  }

  getMovement(): Observable<ApiResponse<WarehouseMove>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointMovement);
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

  createWarehouseReceivedTransfer(data: WarehouseReceivedTransfer): Observable<WarehouseReceivedTransfer> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editWarehouseReceivedTransfer(data: WarehouseReceivedTransfer): Observable<WarehouseReceivedTransfer> {
    return this.http.patch<WarehouseReceivedTransfer>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteWarehouseReceivedTransfer(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }

}
