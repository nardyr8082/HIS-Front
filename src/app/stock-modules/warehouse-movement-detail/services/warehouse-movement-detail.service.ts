import { environment } from '../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../app/core/models/api-response.model';
import { WarehouseMovementDetail } from '../models/warehouse-movement-detail.model';
import { Measure } from '../../classifiers/measure/models/measure.model';
import { warehouseProduct } from '../../warehouse-lot/models/warehouseProduct';
import { WarehouseMove } from '../models/warehouse-move.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WarehouseMovementDetailService {
  private apiEndpoint = `${environment.apiUrl}alm_detalle_movimiento`;
  private apiEndpointMeasure = `${environment.apiUrl}alm_medida`;
  private apiEndpointWareHouseProduct = `${environment.apiUrl}alm_producto`;
  private apiEndpointMovement = `${environment.apiUrl}alm_movimiento`;

  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) { }

  getWarehouseMovementDetail(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<WarehouseMovementDetail>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<WarehouseMovementDetail>>(this.apiEndpoint + queryParams);
  }
  getMeasure(): Observable<ApiResponse<Measure>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointMeasure);
  }

  getWarehouseProduct(): Observable<ApiResponse<warehouseProduct>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointWareHouseProduct);
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

  createWarehouseMovementDetail(data: WarehouseMovementDetail): Observable<WarehouseMovementDetail> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editWarehouseMovementDetail(data: WarehouseMovementDetail): Observable<WarehouseMovementDetail> {
    return this.http.patch<WarehouseMovementDetail>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteWarehouseMovementDetail(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
  checkNumberMov(mov: any, idPro: any) {
    return this.http.get<any>(this.apiEndpoint).pipe(
      map((res) => {
        console.log('ID: ', idPro);
        const miarre = res.results.filter((valores) => {
          console.log('Dentro del filter', valores);
          if (valores.movimiento.id === mov && valores.producto.id === idPro)
           return valores;
        });
        if (miarre.length == 1) {
          console.log('Primero ', miarre);
          return { isNumberAvailable: false };
        }
        console.log('Segundo ', miarre);
        return { isNumberAvailable: true };
      }),
    );
  }

}
