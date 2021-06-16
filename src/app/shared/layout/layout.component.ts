import { Component, ViewChild, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { environment } from 'src/environments/environment';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';
import { NavigationService } from 'src/app/core/services/navigation/navigation.service';
import { SpinnerLoadingService } from '../../backend/services/spinner-loading/spinner-loading.service';
import { TranslateService } from '@ngx-translate/core';
import { PanelNotificationsComponent } from '../common-layout-components/panel-notifications/panel-notifications.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit, OnDestroy {
  applyStyle = false;
  innerWidth: any;
  previousUrl = '';
  currentUrl = '';
  loggedInUser: any;
  userUrl = environment.apiUrl;
  separator = '/';
  isHandset = false;
  navBarQuerySubscription: Subscription;
  navRouterSubscription: Subscription;
  userUpdatedSubscription: Subscription;
  routeChangeSubscrition: Subscription;
  isSmallDevice: boolean;
  language: string;
  valueSpiner = 50;
  bufferValue = 75;

  public flags = [
    { name: 'Español', image: 'assets/images/flags/es.svg', lang: 'es' },
    { name: 'English', image: 'assets/images/flags/en.svg', lang: 'en' },
  ];

  public currencies = ['USD', 'EUR'];

  flag: any = null;
  currency: any = null;

  @ViewChild('drawer', { static: true })
  public sidenav: MatSidenav;
  navigationData: any[] = [];
  year: any = null;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public dialog: MatDialog,
    private navigationService: NavigationService,
    public authService: AuthenticationService,
    public spinnerLoading: SpinnerLoadingService,
    private loggedInUserService: LoggedInUserService,
    private showToastr: ShowToastrService,
    private translateService: TranslateService,
  ) {
    this.loggedInUser = loggedInUserService.getLoggedInUser();
    this.loggedInUser = loggedInUserService.getLoggedInUser();
    this.navigationData = this.navigationService.getNavBackend();

    this.flags = this.loggedInUserService.getlaguages();

    this.navBarQuerySubscription = this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Handset, Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Tablet])
      .subscribe((data) => {
        this.isHandset = data.matches;
        this.isSmallDevice = data.matches;
      });

    this.navRouterSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        if (this.isHandset && this.sidenav && this.sidenav.opened) {
          const TimeCloseSid = setTimeout(() => {
            this.sidenav.close();
            clearTimeout(TimeCloseSid);
          }, 250);
        }
      }
    });

    this.year = new Date().getFullYear();
  }

  logout(): void {
    this.removeCookies();
    localStorage.removeItem('user');
    this.loggedInUserService.setLoggedInUser(null);
    localStorage.clear();
    this.router.navigate(['authentication']);
  }

  removeCookies() {
    const res = document.cookie;
    const multiple = res.split(';');
    for (let i = 0; i < multiple.length; i++) {
      const key = multiple[i].split('=');
      document.cookie = key[0] + ' =; expires = Thu, 01 Jan 1970 00:00:00 UTC';
    }
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 600) {
      this.applyStyle = false;
    } else {
      this.applyStyle = true;
    }

    this.userUpdatedSubscription = this.loggedInUserService.$loggedInUserUpdated.subscribe(() => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    });

    const tempCurrency = JSON.parse(localStorage.getItem('currency'));
    const tempFlag = JSON.parse(localStorage.getItem('language'));
    this.flag = tempFlag ? tempFlag : this.flags[0];
    this.currency = tempCurrency ? tempCurrency : this.currencies[0];
  }

  ngOnDestroy(): void {
    if (this.navBarQuerySubscription) {
      this.navBarQuerySubscription.unsubscribe();
    }
    if (this.navRouterSubscription) {
      this.navRouterSubscription.unsubscribe();
    }
    if (this.routeChangeSubscrition) {
      this.routeChangeSubscrition.unsubscribe();
    }
    if (this.userUpdatedSubscription) {
      this.userUpdatedSubscription.unsubscribe();
    }
  }

  /////////////// View Notifications //////////////////
  onViewNotifications(): void {
    let dialogRef: MatDialogRef<PanelNotificationsComponent, any>;
    dialogRef = this.dialog.open(PanelNotificationsComponent, {
      panelClass: 'app-panel-notifications',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.onRefreshData();
      }
    });
  }

  /////// Edit Profile /////
  onEditProfile(): void {
    let a = document.createElement('a');
    a.href = '/backend/perfil';
    a.click();

    // let dialogRef: MatDialogRef<AdminEditProfileComponent, any>;
    // dialogRef = this.dialog.open(AdminEditProfileComponent, {
    //   panelClass: 'app-admin-edit-profile',
    //   maxWidth: '100vw',
    //   maxHeight: '100vh',
    //   data: {},
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //   }
    // });
  }

  onLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['']);
    this.showToastr.showInfo('Usuario deslogeado exitósamente', 'Cerrar Sesión');
  }

  public changeLang(lang) {
    localStorage.setItem('language', JSON.stringify(lang));
    this.flag = lang;
    this.translateService.use(lang.lang || 'es');
  }
}
