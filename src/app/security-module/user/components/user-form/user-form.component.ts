import { CatScience } from './../../../../nomenclator-modules/cat-science/models/cat-science.model';
import { CatDocent } from './../../../../nomenclator-modules/cat-docent/models/cat-docent.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/security-module/role/models/role.model';
import { User } from '../../models/user.model';
import { Specialty } from 'src/app/nomenclator-modules/specialty/models/specialty';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @Input() user: User;
  @Input() roles: Role[];
  @Input() catDoncents: CatDocent[];
  @Input() catSciences: CatScience[];
  @Input() specialties: Specialty[];
  @Input() docTypes: any[];
  @Input() nationalities: any[];
  @Input() contacts: any[];
  @Input() addresses: any[];

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

  constructor(private _formBuilder: FormBuilder, public utilsService: UtilsService, private toastService: ToastrService) {}

  ngOnInit(): void {
    this.buildForms();
  }

  buildForms() {
    this.userFormGroup = this._formBuilder.group({
      is_superuser: [false, Validators.required],
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      is_staff: [true, Validators.required],
      is_active: [true, Validators.required],
      groups: [[], Validators.required],
      categ_docente: [[], Validators.required],
      categ_cientifica: [[], Validators.required],
      especialidad: [[], Validators.required],
    });

    this.personFormGroup = this._formBuilder.group({
      nro_identificacion: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      profesion: ['', Validators.required],
      ocupacion: ['', Validators.required],
      sexo: ['', Validators.required],
      tipo_doc: [1, Validators.required],
      direccion: [1],
      nacionalidad: [1],
      contacto: [1],
      // foto: ['', Validators.required],
    });
  }

  get emailControl() {
    return this.userFormGroup.get('email') as FormControl;
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

  sendData() {
    if (this.userFormGroup.valid && this.personFormGroup.valid) {
      const user = this.userFormGroup.value;
      const person = this.personFormGroup.value;
      // const dateFormat = this.formatedDate(person.fecha_nacimiento);
      const dateFormat = person.fecha_nacimiento as Date;
      person.fecha_nacimiento = `${dateFormat.getFullYear()}-${dateFormat.getMonth() + 1}-${dateFormat.getDate()}`;
      this.user ? this.edit.emit({ user, person }) : this.create.emit({ user, person });
    } else {
      this.toastService.error('Por favor revise los formularios, quedan campos requeridos sin llenar', 'Error');
    }
  }
}
