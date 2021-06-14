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
export class MailOriginService {
  url = environment.apiUrl + 'mail-origin';
  urlId = environment.apiUrl + 'mail-origin/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createMailOrigin(body: any): Observable < any > {
    return this.httpClient.post < any > (this.url, body);
  }

  editMailOrigin(data) {
    return this.httpClient.patch < any > (this.urlId.replace(':id', data.id), data, this.httpOptions);
  }

  removeMailOrigin(data): Promise < any > {
    return this.httpClient.delete < any > (this.urlId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getAllMailOrigins(query ? : IPagination, params ? : any) {
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
      if (params.host != undefined) {
        if (params.host.constructor != Array) {
          httpParams = httpParams.set(
            'filter[$and][host]',
            params.host.toString()
          );
        }
        if (params.host.constructor == Array && params.host.length) {
          if (params.host.length == 1) {
            httpParams = httpParams.set(
              'filter[$and][host]',
              params.host[0].toString()
            );
          } else {
            params.host.map((item) => {
              httpParams = httpParams.append(
                'filter[$and][host]',
                item.toString()
              );
            });
          }
        }
      }
      if (params.port != undefined) {
        httpParams = httpParams.set(
          'filter[$and][port][$like]', '%' + params.port.toString() + '%');
      }
      if (params.user != undefined) {
        if (params.user.constructor != Array) {
          httpParams = httpParams.set(
            'filter[$and][user]',
            params.user.toString()
          );
        }
        if (params.user.constructor == Array && params.user.length) {
          if (params.user.length == 1) {
            httpParams = httpParams.set(
              'filter[$and][user]',
              params.user[0].toString()
            );
          } else {
            params.user.map((item) => {
              httpParams = httpParams.append(
                'filter[$and][user]',
                item.toString()
              );
            });
          }
        }
      }
      if (params.password != undefined) {
        if (params.password.constructor != Array) {
          httpParams = httpParams.set(
            'filter[$and][password]',
            params.password.toString()
          );
        }
        if (params.password.constructor == Array && params.password.length) {
          if (params.password.length == 1) {
            httpParams = httpParams.set(
              'filter[$and][password]',
              params.password[0].toString()
            );
          } else {
            params.password.map((item) => {
              httpParams = httpParams.append(
                'filter[$and][password]',
                item.toString()
              );
            });
          }
        }
      }
      if (params.testTo != undefined) {
        if (params.testTo.constructor != Array) {
          httpParams = httpParams.set(
            'filter[$and][testTo]',
            params.testTo.toString()
          );
        }
        if (params.testTo.constructor == Array && params.testTo.length) {
          if (params.testTo.length == 1) {
            httpParams = httpParams.set(
              'filter[$and][testTo]',
              params.testTo[0].toString()
            );
          } else {
            params.testTo.map((item) => {
              httpParams = httpParams.append(
                'filter[$and][testTo]',
                item.toString()
              );
            });
          }
        }
      }
      if (params.isOK != undefined) {
        httpParams = httpParams.set(
          'filter[$and][isOK]', params.isOK.toString());
      }
    }
    return this.httpClient.get < any > (this.url, {
      params: httpParams
    });
  }

  getMailOrigin(data: any): Observable < any > {
    if (data.constructor == Object) {
      return this.httpClient.get < any > (this.urlId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get < any > (this.urlId.replace(':id', data + ''), this.httpOptions);
    }
  }
}