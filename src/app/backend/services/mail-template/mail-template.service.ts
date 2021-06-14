import {
  environment
} from './../../../../environments/environment';
import {
  IPagination
} from './../../../core/classes/pagination.class';
import {
  Injectable
} from '@angular/core';
import {
  BehaviorSubject,
  Observable
} from 'rxjs';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MailTemplateService {
  url = environment.apiUrl + 'mail-template';
  urlId = environment.apiUrl + 'mail-template/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createMailTemplate(body: any): Observable < any > {
    return this.httpClient.post < any > (this.url, body);
  }

  editMailTemplate(data) {
    return this.httpClient.patch < any > (this.urlId.replace(':id', data.id), data, this.httpOptions);
  }

  removeMailTemplate(data): Promise < any > {
    return this.httpClient.delete < any > (this.urlId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getAllMailTemplates(query ? : IPagination, params ? : any) {
    let httpParams = new HttpParams();
    if (query) {
      Object.keys(query).map((keyQuery) => {
        if (query[keyQuery] != undefined && keyQuery !== "filter") {
          httpParams = httpParams.append(keyQuery, query[keyQuery] + "");
        }
      });
      if (query.filter && query.filter.properties) {
        query.filter.properties.forEach((item) => {
          httpParams = httpParams.append(
            item,
            "%" + query.filter.filterText + "%"
          );
        });
      }
    }
    if (params) {

      if (params.CreatorId != undefined) {
        if (params.CreatorId.constructor != Array) {
          httpParams = httpParams.set(
            'filter[$and][CreatorId]',
            params.CreatorId.toString()
          );
        }
        if (params.CreatorId.constructor == Array && params.CreatorId.length) {
          if (params.CreatorId.length == 1) {
            httpParams = httpParams.set(
              'filter[$and][CreatorId]',
              params.CreatorId[0].toString()
            );
          } else {
            params.CreatorId.map((item) => {
              httpParams = httpParams.append(
                'filter[$and][CreatorId]',
                item.toString()
              );
            });
          }
        }
      }
      if (params.code != undefined) {
        if (params.code.constructor != Array) {
          httpParams = httpParams.set(
            'filter[$and][code]',
            params.code.toString()
          );
        }
        if (params.code.constructor == Array && params.code.length) {
          if (params.code.length == 1) {
            httpParams = httpParams.set(
              'filter[$and][code]',
              params.code[0].toString()
            );
          } else {
            params.code.map((item) => {
              httpParams = httpParams.append(
                'filter[$and][code]',
                item.toString()
              );
            });
          }
        }
      }
      if (params.keepXHours != undefined) {
        httpParams = httpParams.set(
          'filter[$and][keepXHours][$like]', '%' + params.keepXHours.toString() + '%');
      }
      if (params.emailTitle != undefined) {
        httpParams = httpParams.set(
          'filter[$and][emailTitle][$like]', '%' + params.emailTitle.toString() + '%');
      }
      if (params.emailBody != undefined) {
        httpParams = httpParams.set(
          'filter[$and][emailBody][$like]', '%' + params.emailBody.toString() + '%');
      }
      if (params.keys != undefined) {
        httpParams = httpParams.set(
          'filter[$and][keys][$like]', '%' + params.keys.toString() + '%');
      }
    }
    return this.httpClient.get < any > (this.url, {
      params: httpParams
    });
  }

  getMailTemplate(data: any): Observable < any > {
    if (data.constructor == Object) {
      return this.httpClient.get < any > (this.urlId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get < any > (this.urlId.replace(':id', data + ''), this.httpOptions);
    }
  }
}