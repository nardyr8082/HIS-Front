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
export class LanguageInfoService {
  url = environment.apiUrl + 'language-info';
  urlId = environment.apiUrl + 'language-info/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createLanguageInfo(body: any): Observable < any > {
    return this.httpClient.post < any > (this.url, body);
  }

  editLanguageInfo(data) {
    return this.httpClient.patch < any > (this.urlId.replace(':id', data.id), data, this.httpOptions);
  }

  removeLanguageInfo(data): Promise < any > {
    return this.httpClient.delete < any > (this.urlId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getAllLanguageInfos(query ? : IPagination, params ? : any) {
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
      if (params.values != undefined) {
        httpParams = httpParams.set(
          'filter[$and][values][$like]', '%' + params.values.toString() + '%');
      }
    }
    return this.httpClient.get < any > (this.url, {
      params: httpParams
    });
  }

  getLanguageInfo(data: any): Observable < any > {
    if (data.constructor == Object) {
      return this.httpClient.get < any > (this.urlId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get < any > (this.urlId.replace(':id', data + ''), this.httpOptions);
    }
  }
}