import { environment } from './../../../../environments/environment';
import { IPagination } from './../../../core/classes/pagination.class';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactMailService {
  url = environment.apiUrl + 'contact-mail';
  urlId = environment.apiUrl + 'contact-mail/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createContactMail(body: any): Observable<any> {
    return this.httpClient.post<any>(this.url, body);
  }

  editContactMail(data) {
    return this.httpClient.patch<any>(this.urlId.replace(':id', data.id), data, this.httpOptions);
  }

  removeContactMail(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getAllContactMails(query?: IPagination, params?: any) {
    let httpParams = new HttpParams();
    if (query) {
      Object.keys(query).map((keyQuery) => {
        if (query[keyQuery] != undefined && keyQuery !== 'filter') {
          httpParams = httpParams.append(keyQuery, query[keyQuery] + '');
        }
      });
      if (query.filter && query.filter.properties) {
        query.filter.properties.forEach((item) => {
          httpParams = httpParams.append(item, '%' + query.filter.filterText + '%');
        });
      }
    }
    if (params) {
      if (params.name != undefined) {
        httpParams = httpParams.set('filter[$and][name][$like]', '%' + params.name.toString() + '%');
      }
      if (params.phone != undefined) {
        httpParams = httpParams.set('filter[$and][phone][$like]', '%' + params.phone.toString() + '%');
      }
      if (params.topic != undefined) {
        httpParams = httpParams.set('filter[$and][topic][$like]', '%' + params.topic.toString() + '%');
      }
      if (params.email != undefined) {
        httpParams = httpParams.set('filter[$and][email][$like]', '%' + params.email.toString() + '%');
      }
      if (params.message != undefined) {
        httpParams = httpParams.set('filter[$and][message][$like]', '%' + params.message.toString() + '%');
      }
    }
    return this.httpClient.get<any>(this.url, {
      params: httpParams,
    });
  }

  getContactMail(data: any): Observable<any> {
    if (data.constructor == Object) {
      return this.httpClient.get<any>(this.urlId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlId.replace(':id', data + ''), this.httpOptions);
    }
  }
}
