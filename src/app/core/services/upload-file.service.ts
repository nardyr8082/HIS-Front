import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams, HttpEventType, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  urlFile = environment.apiUrl + 'file';

  constructor(private httpClient: HttpClient) {}

  public createFile(data): Observable<any> {
    return this.httpClient.post<any>(this.urlFile, data, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public createFileLink(data): Observable<any> {
    return this.httpClient.post<any>(this.urlFile + '/link', data);
  }

  public getAllFiles(query, params?): Observable<any> {
    let httpParams = new HttpParams();
    if (query) {
      httpParams = httpParams.append('limit', query.limit.toString());
      httpParams = httpParams.append('offset', query.offset.toString());
      if (query.filter && query.filter.properties) {
        query.filter.properties.forEach((item) => {
          httpParams = httpParams.append(item, '%' + query.filter.filterText + '%');
        });
      }
      if (query.order) {
        httpParams = httpParams.append('order', query.order);
      }
    } else {
      httpParams = httpParams.set('limit', '0');
      httpParams = httpParams.set('offset', '0');
    }
    if (params) {
      if (params.fkModel) {
        httpParams = httpParams.set('filter[$and][fkModel]', params.fkModel);
      }
      if (params.fkId) {
        httpParams = httpParams.set('filter[$and][fkId]', params.fkId);
      }
    }
    return this.httpClient.get<any>(this.urlFile, { params: httpParams });
  }

  public editFile(data) {
    return this.httpClient.patch<any>(this.urlFile + `/${data.id}`, data);
  }

  public removeFile(id): Observable<any> {
    return this.httpClient.delete<any>(this.urlFile + `/${id}`);
  }
}
