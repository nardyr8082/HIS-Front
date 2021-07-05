import { ProfessionService } from './../../../../nomenclator-modules/profession/services/profession.service';
import { MunicipalityService } from './../../../../nomenclator-modules/municipality/services/municipality.service';
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
import { Municipality } from 'src/app/nomenclator-modules/municipality/models/municipality.model';
import { Profession } from 'src/app/nomenclator-modules/profession/models/profession.model';
import { GenderService } from 'src/app/nomenclator-modules/gender/services/gender.service';
import { Gender } from 'src/app/nomenclator-modules/gender/models/gender.model';
import { BloodType } from '../../../../nomenclator-modules/blood-type/models/blood-type.model';
import { BloodTypeService } from '../../../../nomenclator-modules/blood-type/services/blood-type.service';

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
  municipalities: Municipality[];
  professions: Profession[];
  genders: Gender[];
  bloodTypes: BloodType[];

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
    private municipalityService: MunicipalityService,
    private professionService: ProfessionService,
    private genderService: GenderService,
    private bloodTypeService: BloodTypeService,
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
    this.getMunicipalities();
    this.getProffessions();
    this.getGenders();
    this.getBloodTypes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getProffessions() {
    const sub = this.professionService
      .getProfession({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<Profession>) => {
          this.professions = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener las profesiones. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getGenders() {
    const sub = this.genderService
      .getGenders({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<Gender>) => {
          this.genders = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los sexos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getBloodTypes() {
    const sub = this.bloodTypeService
      .getBloodType({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<BloodType>) => {
          this.bloodTypes = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los grupos sanguíneos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getMunicipalities() {
    const sub = this.municipalityService
      .getMunicipalities({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<Municipality>) => {
          this.municipalities = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los municipios. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getUser(userId) {
    const sub = this.userService
      .getUserById(userId)
      .pipe(
        map((response: User) => {
          this.user = response;
          this.getPerson(this.user.persona.id);
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
          this.toastService.error('Hubo un error al obtener los roles. Por favor, inténtelo de nuevo más tarde.', 'Error');
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
          this.toastService.error('Hubo un error al obtener las categorías docentes. Por favor, inténtelo de nuevo más tarde.', 'Error');
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
          this.toastService.error('Hubo un error al obtener las categorías científicas. Por favor, inténtelo de nuevo más tarde.', 'Error');
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
          if (item.foto) {
            const formData = new FormData();
            formData.append('id', response.id);
            formData.append('foto', item.foto);
            const sub = this.personService.uploadImagePerson(formData, response.id).subscribe();
            this.subscriptions.push(sub);
          }
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

    if (item.foto) {
      const formData = new FormData();
      formData.append('id', item.person.id);
      formData.append('foto', item.foto);
      const uploadImageObservable = this.personService.uploadImagePerson(formData, item.person.id);
      observables.push(uploadImageObservable);
    }

    forkJoin(observables)
      .pipe(
        map((response) => {
          this.toastService.success('El usuario ha sido editado correctamente.', 'Felicidades');
          this.router.navigateByUrl('/user');
          return response;
        }),
        catchError((error) => {
          this.toastService.error('Hubo un error editando el final del usuario. Por favor, inténtelo de nuevo más tarde.');
          return of(error);
        }),
      )
      .subscribe();
  }
}
