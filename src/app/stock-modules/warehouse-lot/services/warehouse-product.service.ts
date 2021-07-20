import { environment } from '../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../app/core/models/api-response.model';
import { warehouseProduct } from '../models/warehouseProduct';
import { Measure } from '../../classifiers/measure/models/measure.model';
import { ProductFamily } from '../../classifiers/product-family/models/product-family.model';
import { Program } from '../../classifiers/program/models/program.model';
import { Tax } from '../../classifiers/tax/models/tax.model';


@Injectable({
  providedIn: 'root'
})
export class WarehouseProductService {
  private apiEndpoint = `${environment.apiUrl}alm_producto`;
  private apiEndpointMeasure = `${environment.apiUrl}alm_medida`;
  private apiEndpointFamily = `${environment.apiUrl}alm_familia_producto`;
  private apiEndpointTax = `${environment.apiUrl}alm_impuesto`;
  private apiEndpointProgram = `${environment.apiUrl}alm_programa`;


  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;


  constructor(private http: HttpClient) { }

  geWarehouseProduct(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<warehouseProduct>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<warehouseProduct>>(this.apiEndpoint + queryParams);
  }

  getMeasure(): Observable<ApiResponse<Measure>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointMeasure);
  }

  getFamily(): Observable<ApiResponse<ProductFamily>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointFamily);
  }

  getTax(): Observable<ApiResponse<Tax>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointTax);
  }

  getProgram(): Observable<ApiResponse<Program>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointProgram);
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

  createWarehouseLot(data: warehouseProduct): Observable<warehouseProduct> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editWarehouseLot(data: warehouseProduct): Observable<warehouseProduct> {

    return this.http.patch<warehouseProduct>(`${this.apiEndpoint}/${data.id}/`, data);

  }

  deleteWarehouseLot(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }

}
