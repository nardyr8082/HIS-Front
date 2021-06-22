import { Person } from './../../../../shared/models/Person.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @Input() user: User;
  @Input() person: Person;
  @Input() roles: Role[];
  @Input() catDoncents: CatDocent[];
  @Input() catSciences: CatScience[];
  @Input() specialties: Specialty[];
  @Input() docTypes: any[];
  @Input() nationalities: any[];

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

  constructor(private _formBuilder: FormBuilder, public utilsService: UtilsService, private toastService: ToastrService) {}

  ngOnInit(): void {
    this.buildForms();
  }

  buildForms() {
    this.userFormGroup = this._formBuilder.group({
      is_superuser: [this.user ? this.user.is_superuser : false, Validators.required],
      username: [this.user ? this.user.username : '', Validators.required],
      first_name: [this.user ? this.user.first_name : '', Validators.required],
      last_name: [this.user ? this.user.last_name : '', Validators.required],
      email: [this.user ? this.user.email : '', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      is_staff: [this.user ? this.user.is_staff : true, Validators.required],
      is_active: [this.user ? this.user.is_active : true, Validators.required],
      groups: [this.user ? this.user.groups : [], Validators.required],
      categ_docente: [this.user ? this.user.categ_docente : []],
      categ_cientifica: [this.user ? this.user.categ_cientifica : []],
      especialidad: [this.user ? this.user.especialidad : []],
      password: ['', this.user ? [Validators.required, Validators.minLength(8), createPasswordStrengthValidator(), passwordOnlyNumberValidator()] : []],
      confirm_password: ['', this.user ? [Validators.required] : ''],
    });

    this.personFormGroup = this._formBuilder.group({
      nro_identificacion: [this.person ? this.person.nro_identificacion : '', Validators.required],
      fecha_nacimiento: [this.person ? this.person.fecha_nacimiento : '', Validators.required],
      profesion: [this.person ? this.person.profesion : ''],
      ocupacion: [this.person ? this.person.ocupacion : ''],
      sexo: [this.person ? this.person.sexo : 1, Validators.required],
      tipo_doc: [this.person ? this.person.tipo_doc.id : [], Validators.required],
      nacionalidad: [this.person ? this.person.nacionalidad.name : []],
      municipio: [this.person ? this.person.municipio : ''],
      estado: [this.person ? this.person.estado : ''],
      pais: [this.person ? this.person.pais : ''],
      direccion: [this.person ? this.person.direccion : '', Validators.required],
      numero: [this.person ? this.person.numero : ''],
      cod_postal: [this.person ? this.person.cod_postal : ''],
      nombre_madre: [this.person ? this.person.nombre_madre : ''],
      nombre_padre: [this.person ? this.person.nombre_padre : ''],
      contacto_emergencia: [this.person ? this.person.contacto_emergencia : ''],
      telefono_emergencia: [this.person ? this.person.telefono_emergencia : ''],
      telefono_casa: [this.person ? this.person.telefono_casa : ''],
      telefono_trabajo: [this.person ? this.person.telefono_trabajo : ''],
      telefono_movil: [this.person ? this.person.telefono_movil : ''],
      foto: [''],
    });
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

  get passwordDontMatch() {
    return this.confirmPasswordControl?.dirty && this.passwordControl?.value != this.confirmPasswordControl?.value;
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
    console.log('date', date);
    const dateArray = date.split('/');
    return `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`;
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
      // const dateFormat = this.formatedDate(person.fecha_nacimiento);
      const dateFormat = person.fecha_nacimiento as Date;
      person.fecha_nacimiento = `${dateFormat.getFullYear()}-${dateFormat.getMonth() + 1}-${dateFormat.getDate()}`;
      this.user && this.person ? this.edit.emit({ user, person }) : this.create.emit({ user, person });
    } else {
      this.toastService.error('Por favor revise los formularios, quedan campos requeridos sin llenar', 'Error');
    }
  }
}
