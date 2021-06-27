import { Person } from './../../../../shared/models/Person.model';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/security-module/role/models/role.model';
import { Specialty } from 'src/app/nomenclator-modules/specialty/models/specialty';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { ToastrService } from 'ngx-toastr';
import { CatDocent } from 'src/app/nomenclator-modules/cat-docent/models/cat-docent.model';
import { CatScience } from 'src/app/nomenclator-modules/cat-science/models/cat-science.model';
import { User } from 'src/app/security-module/user/models/user.model';
import { createPasswordStrengthValidator } from 'src/app/security-module/user/validators/PasswordStrength.validator';
import { passwordOnlyNumberValidator } from 'src/app/security-module/user/validators/PasswordOnlyNumber.validators';
import * as moment from 'moment';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Municipality } from 'src/app/nomenclator-modules/municipality/models/municipality.model';
import { Profession } from 'src/app/nomenclator-modules/profession/models/profession.model';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: User;
  @Input() person: Person;
  @Input() roles: Role[];
  @Input() catDoncents: CatDocent[];
  @Input() catSciences: CatScience[];
  @Input() specialties: Specialty[];
  @Input() docTypes: any[];
  @Input() nationalities: any[];
  @Input() municipalities: Municipality[];
  @Input() professions: Profession[];

  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  userFormGroup: FormGroup;
  personFormGroup: FormGroup;

  loadImage = false;
  imageAvatarChange = false;
  showErrorImage = false;
  urlImage = 'data:image/jpeg;base64,';
  base64textString = null;
  imageAvatar = null;
  passwordType = 'password';
  imageAvatarFile;

  apiUrl = environment.serverUrl;
  minDate: Date;
  maxDate: Date;
  constructor(private _formBuilder: FormBuilder, public utilsService: UtilsService, private toastService: ToastrService, private userService: UserService) {}

  ngOnInit(): void {
    this.buildForms();
    this.validateDate();
  }

  ngOnChanges() {
    this.buildForms();
  }

  buildForms() {
    this.userFormGroup = this._formBuilder.group({
      username: [this.user ? this.user.username : '', Validators.required],
      first_name: [this.user ? this.user.first_name : '', Validators.required],
      last_name: [this.user ? this.user.last_name : '', Validators.required],
      email: [this.user ? this.user.email : '', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      active: [this.user ? this.user.active : true, Validators.required],
      groups: [this.user ? this.user.groups.map((item) => item.id) : [], Validators.required],
      categ_docente: [this.user ? this.user.categ_docente.map((item) => item.id) : null, Validators.required],
      categ_cientifica: [this.user ? this.user.categ_cientifica.map((item) => item.id) : null, Validators.required],
      especialidad: [this.user ? this.user.especialidad.map((item) => item.id) : null, Validators.required],
      profesion: [this.user ? this.user.profesion.id : null, Validators.required],
      // password: ['', !this.user ? [Validators.required, Validators.minLength(8), createPasswordStrengthValidator(), passwordOnlyNumberValidator()] : null],
      // confirm_password: ['', !this.user ? [Validators.required] : null],
    });

    if (this.user) {
      this.userFormGroup.setControl('change_password', new FormControl(false));
    } else {
      this.userFormGroup.setControl(
        'password',
        new FormControl('', [Validators.required, Validators.minLength(8), createPasswordStrengthValidator(), passwordOnlyNumberValidator()]),
      );
      this.userFormGroup.setControl('confirm_password', new FormControl('', [Validators.required]));
    }

    // const fechaNacimiento = this.person ? moment(this.person.fecha_nacimiento, 'yyyy-MM-DD') : '';
    const fechaNacimiento = this.person ? this.getFormattedDate(this.person.fecha_nacimiento) : '';

    this.personFormGroup = this._formBuilder.group({
      nro_identificacion: [this.person ? this.person.nro_identificacion : '', Validators.required],
      fecha_nacimiento: [fechaNacimiento, Validators.required],
      sexo: [this.person ? this.person.sexo : '1', Validators.required],
      tipo_doc: [this.person ? this.person.tipo_doc.id : [], Validators.required],
      nacionalidad: [this.person ? this.person.nacionalidad?.id : null, Validators.required],
      municipio: [this.person ? this.person.municipio?.id : '', Validators.required],
      direccion: [this.person ? this.person.direccion : '', Validators.required],
      numero: [this.person ? this.person.numero : '', Validators.required],
      cod_postal: [this.person ? this.person.cod_postal : '', Validators.required],
      nombre_madre: [this.person ? this.person.nombre_madre : '', Validators.required],
      nombre_padre: [this.person ? this.person.nombre_padre : '', Validators.required],
      contacto_emergencia: [this.person ? this.person.contacto_emergencia : '', Validators.required],
      telefono_emergencia: [this.person ? this.person.telefono_emergencia : '', Validators.required],
      telefono_casa: [this.person ? this.person.telefono_casa : '', Validators.required],
      telefono_trabajo: [this.person ? this.person.telefono_trabajo : '', Validators.required],
      telefono_movil: [this.person ? this.person.telefono_movil : '', Validators.required],
      qr_code: [this.person ? this.person.qr_code : ''],
    });

    this.identificationCodeControl.valueChanges
      .pipe(
        debounceTime(3000),
        distinctUntilChanged(),
        map(() => {
          const myString = JSON.stringify({ codigo: this.identificationCodeControl.value });
          const formData = new FormData();
          formData.append('data', myString);
          this.userService
            .getQRCode(formData)
            .pipe(
              map((response) => {
                this.personFormGroup.setControl('qr_code', new FormControl(response.qrCode));
              }),
            )
            .subscribe();
        }),
      )
      .subscribe();
  }

  getFormattedDate(apiDate: string) {
    const arrayDate = apiDate.split('-');
    return new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]));
  }

  // FORMS CONTROLS

  get qrCodeControl() {
    return this.personFormGroup?.get('qr_code') as FormControl;
  }

  get firstNameControl() {
    return this.userFormGroup?.get('first_name') as FormControl;
  }

  get lastNameControl() {
    return this.userFormGroup?.get('last_name') as FormControl;
  }

  get usernameControl() {
    return this.userFormGroup?.get('username') as FormControl;
  }

  get emailControl() {
    return this.userFormGroup?.get('email') as FormControl;
  }

  get passwordControl() {
    return this.userFormGroup?.get('password') as FormControl;
  }

  get confirmPasswordControl() {
    return this.userFormGroup?.get('confirm_password') as FormControl;
  }

  get rolesControl() {
    return this.userFormGroup?.get('groups') as FormControl;
  }

  get catDocentControl() {
    return this.userFormGroup?.get('categ_docente') as FormControl;
  }

  get catScientControl() {
    return this.userFormGroup?.get('categ_cientifica') as FormControl;
  }

  get specialtyControl() {
    return this.userFormGroup?.get('especialidad') as FormControl;
  }

  get passwordDontMatch() {
    return this.confirmPasswordControl?.dirty && this.passwordControl?.value != this.confirmPasswordControl?.value;
  }

  get identificationCodeControl() {
    return this.personFormGroup?.get('nro_identificacion') as FormControl;
  }

  changeIdentificationCode(text) {}

  changePasswordControl(event: MatCheckboxChange) {
    if (event.checked) {
      this.userFormGroup.setControl(
        'password',
        new FormControl('', [Validators.required, Validators.minLength(8), createPasswordStrengthValidator(), passwordOnlyNumberValidator()]),
      );
      this.userFormGroup.setControl('confirm_password', new FormControl('', [Validators.required]));
    } else {
      this.userFormGroup.removeControl('password');
      this.userFormGroup.removeControl('confirm_password');
    }
  }

  openFileBrowser(event) {
    event.preventDefault();

    const element: HTMLElement = document.getElementById('filePicker') as HTMLElement;
    element.click();
  }

  handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];
    if (files[0].size < 500000) {
      if (files && file) {
        this.imageAvatarFile = file;
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    } else {
      this.showErrorImage = true;
    }
  }

  handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.urlImage = 'data:image/jpeg;base64,';
    this.imageAvatar = this.urlImage + this.base64textString;
    this.loadImage = true;
    this.showErrorImage = false;
    this.imageAvatarChange = true;
  }

  formatedDate(date: string) {
    const dateArray = date.split('/');
    return `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`;
  }

  getRolesNames() {
    if (this.rolesControl?.value) {
      const roles: any[] = this.rolesControl?.value;
      let result = '';
      roles.forEach((rol) => {
        result = result.concat(`${this.roles[rol]?.name}, `);
      });

      return result.slice(0, -2);
    }
  }

  getCatDocentNames() {
    if (this.catDocentControl?.value) {
      const array: any[] = this.catDocentControl?.value;
      let result = '';
      array.forEach((item) => {
        result = result.concat(`${this.catDoncents[item]?.descripcion}, `);
      });

      return result.slice(0, -2);
    }
  }

  getCatScienceNames() {
    if (this.catScientControl?.value) {
      const array: any[] = this.catScientControl?.value;
      let result = '';
      array.forEach((item) => {
        result = result.concat(`${this.catSciences[item]?.descripcion}, `);
      });

      return result.slice(0, -2);
    }
  }

  getSpecialtiesNames() {
    if (this.specialtyControl?.value) {
      const array: any[] = this.specialtyControl?.value;
      let result = '';
      array.forEach((item) => {
        result = result.concat(`${this.specialties[item]?.descripcion}, `);
      });

      return result.slice(0, -2);
    }
  }

  get passwordLetterAndNumberValidation() {
    const regExpLetter = /[a-zA-Z]/g;
    const regExpNumber = /\d/;
    const password = this.userFormGroup.controls['password'].value;

    return regExpLetter.test(password) && regExpNumber.test(password);
  }

  get passwordOnlyNumberValidation() {
    const regExpLetter = /[a-zA-Z]/g;
    const password = this.userFormGroup.controls['password'].value;

    return !regExpLetter.test(password);
  }

  get passwordContainNameValidation() {
    const password: string = this.userFormGroup.controls['password'].value;
    const username: string = this.userFormGroup.controls['username'].value;
    const first_name: string = this.userFormGroup.controls['first_name'].value;
    const last_name: string = this.userFormGroup.controls['last_name'].value;

    return password.includes(username) || password.includes(first_name) || password.includes(last_name);
  }

  sendData() {
    if (this.userFormGroup.valid && this.personFormGroup.valid) {
      const user = this.userFormGroup.value;
      const person = this.personFormGroup.value;
      const dateFormat = moment(person.fecha_nacimiento);
      person.fecha_nacimiento = dateFormat.format('yyyy-MM-DD');
      this.user && this.person ? this.edit.emit({ user, person, foto: this.imageAvatarFile }) : this.create.emit({ user, person, foto: this.imageAvatarFile });
    } else {
      this.toastService.error('Por favor revise los formularios, quedan campos requeridos sin llenar', 'Error');
    }
  }

  validateDate(): void {
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear - 18, 0, 1);
    this.minDate = new Date(currentYear - 130, 11, 31);
  }
}
