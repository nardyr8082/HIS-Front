import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { LoggedInUserService } from '../loggedInUser/logged-in-user.service';
import { Observable } from 'rxjs';
import { IUser } from '../../classes/user.class';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userUrl = environment.apiUrl + 'auth/login';
  userLogout = environment.apiUrl + 'auth/logout';
  urlSingUp = environment.apiUrl + 'auth/sign-up';
  urlSendPing = environment.apiUrl + 'auth/validate';
  urlForgot = environment.apiUrl + 'auth/forgot';
  urlChangePass = environment.apiUrl + 'auth/forgot';
  urlChangePassUserloged = environment.apiUrl + 'change-pass';

  // -----------------------URL UPDATE PERSON------------------------ //
  urlProfile = environment.apiUrl + 'profile';

  constructor(private httpClient: HttpClient, private loggedInUserService: LoggedInUserService) {}

  login(user: string, password: string) {
    const base64EncodedPw = btoa(user + ':' + password);
    const data = {
      username: user,
      password: password,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + base64EncodedPw,
      }),
    };

    return this.httpClient.post<any>(this.userUrl, data, httpOptions);
  }

  logout(): Observable<any> {
    return this.httpClient.get(this.userLogout);
  }

  singUp(body): Observable<any> {
    return this.httpClient.post<any>(this.urlSingUp, body);
  }

  validatePing(body): Observable<any> {
    return this.httpClient.post<any>(this.urlSendPing, body);
  }

  passForgot(body): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('email', body.email);
    return this.httpClient.get<any>(this.urlForgot, { params: httpParams });
  }
  changePass(body): Observable<any> {
    return this.httpClient.patch<any>(this.urlChangePass, body);
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user_data'));
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  editProfile(data): Observable<any> {
    return this.httpClient.patch(this.urlProfile, data);
  }

  changePasswordUserLoged(data): Observable<any> {
    return this.httpClient.post(this.urlChangePassUserloged, data);
  }
}

export const AUTH_PROVIDERS: Array<any> = [
  {
    provide: AuthenticationService,
    useClass: AuthenticationService,
  },
];
