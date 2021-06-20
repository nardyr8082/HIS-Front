import { PersonService } from './../../../../shared/services/person.service';
import { AddressService } from './../../../../shared/services/address.service';
import { ContactService } from './../../../../shared/services/contact.service';
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
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { CatDocentService } from 'src/app/nomenclator-modules/cat-docent/services/cat-docent.service';
import { CatScienceService } from 'src/app/nomenclator-modules/cat-science/services/cat-science.service';
import { Role } from 'src/app/security-module/role/models/role.model';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent implements OnInit, OnDestroy {
  user: User;
  userId;

  roles: Role[];
  catDoncents: CatDocent[];
  catSciences: CatScience[];
  specialties: Specialty[];
  docTypes: any[];
  nationalities: any[];
  contacts: any[];
  addresses: any[];

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
    private contactService: ContactService,
    private addressesService: AddressService,
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
    this.getContacts();
    this.getAddresses();
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

  getContacts() {
    const sub = this.contactService
      .getContacts({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.contacts = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los contactos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getAddresses() {
    const sub = this.addressesService
      .getAddresses({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.addresses = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener las direcciones. Por favor, inténtelo de nuevo más tarde.', 'Error');
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
          console.log('Response', response);
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

  createUser(user, personId) {
    const fullUser = { ...user, persona: personId };
    console.log('Full user', fullUser);
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

  onEdit(item) {}
}
