import { PersonService } from './../../../../shared/services/person.service';
import { DocTypeIdService } from './../../../../nomenclator-modules/doc-type-id/services/doc-type-id.service';
import { NationalityService } from './../../../../nomenclator-modules/nationality/services/nationality.service';
import { Specialty } from './../../../../nomenclator-modules/specialty/models/specialty';
import { SpecialtyService } from './../../../../nomenclator-modules/specialty/services/specialty.service';
import { CatScience } from './../../../../nomenclator-modules/cat-science/models/cat-science.model';
import { CatDocent } from './../../../../nomenclator-modules/cat-docent/models/cat-docent.model';
import { RoleService } from './../../../role/services/role.service';
import { User } from './../../models/user.model';
import { ApiResponse } from './../../../../core/models/api-response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { catchError, map } from 'rxjs/operators';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { CatDocentService } from 'src/app/nomenclator-modules/cat-docent/services/cat-docent.service';
import { CatScienceService } from 'src/app/nomenclator-modules/cat-science/services/cat-science.service';
import { Role } from 'src/app/security-module/role/models/role.model';
import { Person } from 'src/app/shared/models/Person.model';
import { observable } from 'rxjs';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent implements OnInit, OnDestroy {
  user: User;
  person: Person;
  userId;

  roles: Role[];
  catDoncents: CatDocent[];
  catSciences: CatScience[];
  specialties: Specialty[];
  docTypes: any[];
  nationalities: any[];

  subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastrService,
    private roleService: RoleService,
    private catDocentService: CatDocentService,
    private catScienceService: CatScienceService,
    private specialtyService: SpecialtyService,
    private nationalityService: NationalityService,
    private docTypeIdService: DocTypeIdService,
    private personService: PersonService,
    private router: Router,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.userId = params['id'];
    });
  }

  ngOnInit(): void {
    if (this.userId) {
      this.getUser(this.userId);
    }

    this.getRoles();
    this.getCatDocents();
    this.getCatSciences();
    this.getSpecialties();
    this.getNationalities();
    this.getDocTypeIds();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getUser(userId) {
    const sub = this.userService
      .getUserById(userId)
      .pipe(
        map((response: User) => {
          this.user = response;
          this.getPerson(this.user.persona);
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener el usuario. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getPerson(personId: number) {
    const sub = this.personService
      .getPersonById(personId)
      .pipe(
        map((response: Person) => {
          this.person = response;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener el usuario. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getRoles() {
    const sub = this.roleService
      .getRoles({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<Role>) => {
          this.roles = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los grupos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getCatDocents() {
    const sub = this.catDocentService
      .getCatDocent({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<CatDocent>) => {
          this.catDoncents = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener las categorias docentes. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getCatSciences() {
    const sub = this.catScienceService
      .getCatScience({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<CatScience>) => {
          this.catSciences = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener las categorias científicas. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getSpecialties() {
    const sub = this.specialtyService
      .getSpecialties({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<Specialty>) => {
          this.specialties = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener las especialidades. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getNationalities() {
    const sub = this.nationalityService
      .getNationalities({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.nationalities = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener las Nacionalidades. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getDocTypeIds() {
    const sub = this.docTypeIdService
      .getDocTypeId({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.docTypes = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los tipos de documentos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onCreate(item) {
    this.createPerson(item);
  }

  createPerson(item) {
    const sub = this.personService
      .createPerson(item.person)
      .pipe(
        map((response) => {
          this.createUser(item.user, response.id);
        }),
        catchError(() => {
          this.toastService.error('Hubo un error creando la Persona. Por favor, inténtelo de nuevo más tarde.');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  editPerson(person) {
    person.id = this.person.id;
    return this.personService.editPerson(person).pipe(
      catchError(() => {
        this.toastService.error('Hubo un error editando la Persona. Por favor, inténtelo de nuevo más tarde.');
        return of(null);
      }),
    );
    //   .subscribe();

    // this.subscriptions.push(sub);
  }

  editUser(user) {
    user.id = this.user.id;
    return this.userService.editUser(user).pipe(
      catchError(() => {
        this.toastService.error('Hubo un error editando el usuario. Por favor, inténtelo de nuevo más tarde.');
        return of(null);
      }),
    );
    //   .subscribe();

    // this.subscriptions.push(sub);
  }

  createUser(user, personId) {
    const fullUser = { ...user, persona: personId };
    const sub = this.userService
      .createUser(fullUser)
      .pipe(
        map(() => {
          this.toastService.success('El usuario fue creado satisfactoriamente', 'Felicidades');
          this.router.navigateByUrl('/user');
        }),
        catchError(() => {
          this.toastService.error('Hubo un error creando el usuario. Por favor, inténtelo de nuevo más tarde.');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onEdit(item) {
    const editPerson: Observable<any> = this.editPerson(item.person);
    const editUser: Observable<any> = this.editUser(item.user);
    const observables: Observable<any>[] = [editPerson, editUser];
    forkJoin(observables)
      .pipe(
        map(() => {
          this.toastService.success('El usuario ha sido editado correctamente.', 'Felicidades');
          this.router.navigateByUrl('/user');
        }),
        catchError((error) => {
          this.toastService.error('Hubo un error editando el final del usuario. Por favor, inténtelo de nuevo más tarde.');
          return of(error);
        }),
      )
      .subscribe();
  }
}
