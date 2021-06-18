import { ShowToastrService } from './../show-toastr/show-toastr.service';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilsService } from '../utils/utils.service';
import { Router, NavigationEnd } from '@angular/router';

@Injectable()
export class HttpErrorInterceptorService implements HttpInterceptor {
  url = '';
  constructor(
    private utilsService: UtilsService,
    private showToastr: ShowToastrService,
    private loggedInUserService: LoggedInUserService,
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error del lado del cliente: ${error.error.message}`;
          this.showToastr.showError(errorMessage, 'Error');
        } else {
          errorMessage = error.error;
          console.log("aqui estoy", error);
          this.refreshToken(error);
        }
        // console.log('ErrorInterceptorService -> errorMessage', errorMessage);
        return throwError(errorMessage);
      }),
    );
  }
  refreshToken(error) {
    let refresh = this.loggedInUserService.getRefreshOfUser();
    console.log('test', refresh);
    if (refresh) {
      if (error.status == 401 && error.statusText === 'Unauthorized') {
        this.loggedInUserService.refreshToken().subscribe( resp => {
          console.log('aaaaaaaaa', resp);
          const access = resp.access;
          const data = {access: access, refresh: refresh};
          console.log('data', data);
          this.loggedInUserService.updateUserToken(data);
          window.location.reload();
        }, error1 => {
          this.processingBackendError(error);
        });
      } else {
        this.processingBackendError(error);
      }
    } else {
      this.processingBackendError(error);
    }
  }

  ///////////////////////Procesing Error////////////////////////////////
  processingBackendError(err) {
    if (err.status == 401) {
      if (this.router.url.includes('my-account')) {
      } else {
        localStorage.removeItem('user');
        this.loggedInUserService.setLoggedInUser(null);
        this.loggedInUserService.$loggedInUserUpdated.next(null);
        this.utilsService.errorHandle(err);
        this.router.navigate(['']);
      }
    } else if (err.status == 403) {
      this.showToastr.showError('Acceso prohibido');
      if (this.router.url.includes('backend')) {
        this.router.navigate(['/backend/error/403']);
      } else {
        this.router.navigate(['/error/403']);
      }
    } else if (err.status == 404) {
      if (this.router.url.includes('backend')) {
        this.router.navigate(['/backend/error/404']);
      } else {
        this.router.navigate(['/error/404']);
      }
    } else if (err.status == 400 || err.status == 500) {
      this.utilsService.errorHandle(err);
    } else if (err.status == 0 || err.status == undefined) {
      if (this.router.url.includes('backend')) {
        this.router.navigate(['/backend/error/lost-connection']);
      } else {
        this.router.navigate(['/error/lost-connection']);
      }
      this.showToastr.showError(
        `Server response failed, check your connection to the network, or contact the administrators`,
      );
    }
  }
  ///////////////////////////////////////////////////////
}
