import { AuthenticationService } from './../core/services/authentication/authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoggedInUserService } from '../core/services/loggedInUser/logged-in-user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private loggedInUserService: LoggedInUserService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAccess();
  }

  checkAccess(): boolean {
    const loggedInUser = this.loggedInUserService.getLoggedInUser();
    if (loggedInUser && this.loggedInUserService.isAdminUser()) {
      this.router.navigate(['backend/dashboard']);
      return true;
    } else {
      this.authenticationService.logout();
      return true;
    }
  }
}
