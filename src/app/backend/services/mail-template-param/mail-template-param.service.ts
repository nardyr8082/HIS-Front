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
export class MailTemplateParamService {
  url = environment.apiUrl + 'mail-template-param';
  urlId = environment.apiUrl + 'mail-template-param/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createMailTemplateParam(body: any): Observable < any > {
    return this.httpClient.post < any > (this.url, body);
  }

  editMailTemplateParam(data) {
    return this.httpClient.patch < any > (this.urlId.replace(':id', data.id), data, this.httpOptions);
  }

  removeMailTemplateParam(data): Promise < any > {
    return this.httpClient.delete < any > (this.urlId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getAllMailTemplateParams(query ? : IPagination, params ? : any) {
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

      if (params.MailTemplateId != undefined) {
        if (params.MailTemplateId.constructor != Array) {
          httpParams = httpParams.set(
            'filter[$and][MailTemplateId]',
            params.MailTemplateId.toString()
          );
        }
        if (params.MailTemplateId.constructor == Array && params.MailTemplateId.length) {
          if (params.MailTemplateId.length == 1) {
            httpParams = httpParams.set(
              'filter[$and][MailTemplateId]',
              params.MailTemplateId[0].toString()
            );
          } else {
            params.MailTemplateId.map((item) => {
              httpParams = httpParams.append(
                'filter[$and][MailTemplateId]',
                item.toString()
              );
            });
          }
        }
      }
      if (params.param != undefined) {
        httpParams = httpParams.set(
          'filter[$and][param][$like]', '%' + params.param.toString() + '%');
      }
      if (params.description != undefined) {
        httpParams = httpParams.set(
          'filter[$and][description][$like]', '%' + params.description.toString() + '%');
      }
      if (params.example != undefined) {
        httpParams = httpParams.set(
          'filter[$and][example][$like]', '%' + params.example.toString() + '%');
      }
      if (params.type != undefined) {
        if (params.type.constructor != Array) {
          httpParams = httpParams.set(
            'filter[$and][type]',
            params.type.toString()
          );
        }
        if (params.type.constructor == Array && params.type.length) {
          if (params.type.length == 1) {
            httpParams = httpParams.set(
              'filter[$and][type]',
              params.type[0].toString()
            );
          } else {
            params.type.map((item) => {
              httpParams = httpParams.append(
                'filter[$and][type]',
                item.toString()
              );
            });
          }
        }
      }
    }
    return this.httpClient.get < any > (this.url, {
      params: httpParams
    });
  }

  getMailTemplateParam(data: any): Observable < any > {
    if (data.constructor == Object) {
      return this.httpClient.get < any > (this.urlId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get < any > (this.urlId.replace(':id', data + ''), this.httpOptions);
    }
  }
}