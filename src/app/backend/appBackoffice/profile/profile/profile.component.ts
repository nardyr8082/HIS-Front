import { PersonService } from './../../../../shared/services/person.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './../../../../security-module/user/services/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription, Observable, combineLatest } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from 'src/app/security-module/user/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  subsciptions: Subscription[] = [];
  user: User;

  constructor(private userService: UserService, private personService: PersonService, private toastrService: ToastrService) {}

  ngOnInit(): void {
    const userId = JSON.parse(localStorage.getItem('id'));
    this.getUserById(userId);
  }

  ngOnDestroy() {
    this.subsciptions.forEach((s) => s.unsubscribe());
  }

  getUserById(id) {
    const sub = this.userService
      .getUserById(id)
      .pipe(
        map((response) => {
          this.user = response;
        }),
        catchError(() => {
          this.toastrService.error('Hubo un error obteniendo los datos del usuario.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subsciptions.push(sub);
  }

  updateUser(event) {
    const { direccion, email, first_name, last_name, telefono_movil, foto } = event;
    const formData = new FormData();
    formData.append('id', this.user.persona.id.toString());
    const userObs = this.userService.editUser({ first_name, last_name, email, id: this.user.id });
    const personObs = this.personService.editPerson({ direccion, telefono_movil, id: this.user.persona.id });
    let obs: Array<Observable<any>>;
    if (foto) {
      formData.append('foto', foto);
      const imageObs = this.personService.uploadImagePerson(formData, this.user.persona.id);
       obs = [userObs, personObs, imageObs];
    } else {
      obs = [userObs, personObs];
    }
    const sub = combineLatest(obs)
      .pipe(
        map((res) => {
          this.toastrService
            .success('El perfil ha sido actualizado satisfactoriamente', 'Felicidades');
            if (foto) {
              setTimeout( function() {
                window.location.reload();
              }, 1500);
            }
        }),
        catchError(() => {
          this.toastrService.error('Hubo un error actualizando el perfil', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subsciptions.push(sub);
  }

  changePassword(data) {
    const sub = this.userService
      .editUser(data)
      .pipe(
        map(() => {
          this.toastrService.success('La contraseña ha sido modificada correctamente.', 'Felicidades');
        }),
        catchError(() => {
          this.toastrService.error('Hubo un error cambiando la contraseña.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subsciptions.push(sub);
  }
}
