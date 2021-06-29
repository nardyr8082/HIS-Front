import { ToastrService } from 'ngx-toastr';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { of, Subscription } from 'rxjs';
import * as moment from 'moment';
import { Role } from 'src/app/security-module/role/models/role.model';
import { Location } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  user: User;
  userId: number;
  subscriptions: Subscription[] = [];
  timeAgo;
  apiUrl = environment.serverUrl;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private toastService: ToastrService, private _location: Location) {
    this.activatedRoute.params.subscribe((params) => {
      this.userId = params['id'];
    });
  }

  ngOnInit(): void {
    if (this.userId) {
      this.getUser(this.userId);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  goBack() {
    this._location.back();
  }

  getItemsDescription(items: Array<any>) {
    let result = '';
    items.forEach((item) => {
      result = result.concat(`${item.descripcion}, `);
    });
    return result.slice(0, -2);
  }

  getItemsRole(roles: Role[]) {
    let result = '';
    roles.forEach((item) => {
      result = result.concat(`${item.name}, `);
    });
    return result.slice(0, -2);
  }

  getUser(userId) {
    const sub = this.userService
      .getUserById(userId)
      .pipe(
        map((response: User) => {
          this.user = response;
          moment.locale('es');
          this.timeAgo = moment(this.user.date_joined).fromNow(true);
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener el usuario. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
}
