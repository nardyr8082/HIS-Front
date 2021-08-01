import { MatCheckboxChange } from '@angular/material/checkbox';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { BloodType } from './../../../nomenclator-modules/blood-type/models/blood-type.model';
import { Gender } from 'src/app/nomenclator-modules/gender/models/gender.model';
import { PatientService } from './../../services/patient.service';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Race } from './../../../nomenclator-modules/race/models/race.model';
import { CivilStatus } from './../../../nomenclator-modules/civil-status/models/civil-status.model';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Patient } from '../../models/patient.model';
import { Nationality } from 'src/app/nomenclator-modules/nationality/models/nationality.model';
import { Municipality } from 'src/app/nomenclator-modules/municipality/models/municipality.model';
import { DocTypeId } from 'src/app/nomenclator-modules/doc-type-id/models/doc-type-id.model';
import * as moment from 'moment';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
})
export class PatientFormComponent implements OnInit {
  @Input() patient: Patient;
  @Input() civilStatus: CivilStatus[];
  @Input() races: Race[];
  @Input() nationalities: Nationality[];
  @Input() municipalities: Municipality[];
  @Input() genders: Gender[];
  @Input() bloodTypes: BloodType[];
  @Input() docTypes: DocTypeId[];

  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  patientFormGroupStep1: FormGroup;
  patientFormGroupStep2: FormGroup;

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
  constructor(
    private _formBuilder: FormBuilder,
    public utilsService: UtilsService,
    private toastService: ToastrService,
    private patientService: PatientService,
  ) {}

  ngOnInit(): void {
    this.buildForms();
    this.validateDate();
  }

  ngOnChanges() {
    this.buildForms();
  }

  buildForms() {
    const fechaNacimiento = this.patient ? this.getFormattedDate(this.patient.fecha_nacimiento) : '';

    this.patientFormGroupStep1 = this._formBuilder.group({
      id: [this.patient ? this.patient.id : null],
      nro_identificacion: [this.patient ? this.patient.nro_identificacion : null, [Validators.required]],
      nombre: [this.patient ? this.patient.nombre : null, [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
      apellidos: [this.patient ? this.patient.apellidos : '', [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
      email: [this.patient ? this.patient.email : '', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      estado_civil: [this.patient ? this.patient.estado_civil.id : null, Validators.required],
      raza: [this.patient ? this.patient.raza.id : null, Validators.required],
      sexo: [this.patient ? this.patient.sexo.id : null, Validators.required],
      ocupacion: [this.patient ? this.patient.ocupacion : null, [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
      tipo_doc: [this.patient ? this.patient.tipo_doc.id : null, Validators.required],
      grupo_sanguineo: [this.patient ? this.patient?.grupo_sanguineo?.id : null, [Validators.required]],
      identificador_paciente: [this.patient ? this.patient.identificador_paciente : null],
      fecha_nacimiento: [fechaNacimiento, Validators.required],
    });

    const fechaDefuncion = this.patient ? this.getFormattedDate(this.patient.fecha_defuncion) : '';

    this.patientFormGroupStep2 = this._formBuilder.group({
      nacionalidad: [this.patient ? this.patient.nacionalidad.id : null, Validators.required],
      municipio: [this.patient ? this.patient.municipio.id : null, Validators.required],
      direccion: [this.patient ? this.patient.direccion : null, Validators.required],
      numero: [this.patient ? this.patient.numero : null, [Validators.required, Validators.pattern('^[0-9]+([,][0-9]+)?$')]],
      cod_postal: [this.patient ? this.patient.cod_postal : null, Validators.required],
      nombre_madre: [this.patient ? this.patient.nombre_madre : null, [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
      nombre_padre: [this.patient ? this.patient.nombre_padre : null, [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
      contacto_emergencia: [this.patient ? this.patient.contacto_emergencia : null, [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
      telefono_emergencia: [
        this.patient ? this.patient.telefono_casa : '+(240)',
        [Validators.required, Validators.pattern('^[+]*[(]{1,2}[0-9]{1,4}[)][-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$')],
      ],
      telefono_casa: [
        this.patient ? this.patient.telefono_casa : '+(240)',
        [Validators.required, Validators.pattern('^[+]*[(]{1,2}[0-9]{1,4}[)][-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$')],
      ],
      telefono_trabajo: [
        this.patient ? this.patient.telefono_casa : '+(240)',
        [Validators.required, Validators.pattern('^[+]*[(]{1,2}[0-9]{1,4}[)][-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$')],
      ],
      telefono_movil: [
        this.patient ? this.patient.telefono_casa : '+(240)',
        [Validators.required, Validators.pattern('^[+]*[(]{1,2}[0-9]{1,4}[)][-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$')],
      ],
      qr_code: [this.patient ? this.patient.qr_code : ''],
      seg_social: [this.patient ? this.patient.seg_social : null, [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
      nota_factura: [this.patient ? this.patient.nota_factura : null, [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
      fecha_defuncion: [fechaDefuncion, Validators.required],
      motivo_defuncion: [this.patient ? this.patient.motivo_defuncion : null, [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
    });

    /*this.nro_identificacionFormControl.valueChanges
      .pipe(
        debounceTime(3000),
        distinctUntilChanged(),
        map(() => {
          const myString = JSON.stringify({ codigo: this.qr_codeFormControl.value });
          const formData = new FormData();
          formData.append('data', myString);
          this.patientService
            .getQRCode(formData)
            .pipe(
              map((response) => {
                this.patientFormGroupStep2.setControl('qr_code', new FormControl(response.qrCode));
              }),
            )
            .subscribe();
        }),
      )
      .subscribe();*/
  }

  getFormattedDate(apiDate: string) {
    if (apiDate) {
      const arrayDate = apiDate.split('-');
      return new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]));
    }
    return null;
  }

  // FORMS CONTROLS
  get idFormControl() {
    return this.patientFormGroupStep1.get('id') as FormControl;
  }
  get nro_identificacionFormControl() {
    return this.patientFormGroupStep1.get('nro_identificacion') as FormControl;
  }
  get nombreFormControl() {
    return this.patientFormGroupStep1.get('nombre') as FormControl;
  }
  get apellidosFormControl() {
    return this.patientFormGroupStep1.get('apellidos') as FormControl;
  }
  get emailFormControl() {
    return this.patientFormGroupStep1.get('email') as FormControl;
  }
  get estado_civilFormControl() {
    return this.patientFormGroupStep1.get('estado_civil') as FormControl;
  }
  get razaFormControl() {
    return this.patientFormGroupStep1.get('raza') as FormControl;
  }
  get sexoFormControl() {
    return this.patientFormGroupStep1.get('sexo') as FormControl;
  }
  get ocupacionFormControl() {
    return this.patientFormGroupStep1.get('ocupacion') as FormControl;
  }
  get tipo_docFormControl() {
    return this.patientFormGroupStep1.get('tipo_doc') as FormControl;
  }
  get grupo_sanguineoFormControl() {
    return this.patientFormGroupStep1.get('grupo_sanguineo') as FormControl;
  }
  get identificador_pacienteFormControl() {
    return this.patientFormGroupStep1.get('identificador_paciente') as FormControl;
  }
  get fecha_nacimientoFormControl() {
    return this.patientFormGroupStep1.get('fecha_nacimiento') as FormControl;
  }

  get nacionalidadFormControl() {
    return this.patientFormGroupStep2.get('nacionalidad') as FormControl;
  }

  get municipioFormControl() {
    return this.patientFormGroupStep2.get('municipio') as FormControl;
  }

  get direccionFormControl() {
    return this.patientFormGroupStep2.get('direccion') as FormControl;
  }

  get numeroFormControl() {
    return this.patientFormGroupStep2.get('numero') as FormControl;
  }

  get cod_postalFormControl() {
    return this.patientFormGroupStep2.get('cod_postal') as FormControl;
  }

  get nombre_madreFormControl() {
    return this.patientFormGroupStep2.get('nombre_madre') as FormControl;
  }

  get nombre_padreFormControl() {
    return this.patientFormGroupStep2.get('nombre_padre') as FormControl;
  }

  get contacto_emergenciaFormControl() {
    return this.patientFormGroupStep2.get('contacto_emergencia') as FormControl;
  }

  get telefono_emergenciaFormControl() {
    return this.patientFormGroupStep2.get('telefono_emergencia') as FormControl;
  }

  get telefono_casaFormControl() {
    return this.patientFormGroupStep2.get('telefono_casa') as FormControl;
  }

  get telefono_trabajoFormControl() {
    return this.patientFormGroupStep2.get('telefono_trabajo') as FormControl;
  }

  get telefono_movilFormControl() {
    return this.patientFormGroupStep2.get('telefono_movil') as FormControl;
  }

  get qr_codeFormControl() {
    return this.patientFormGroupStep2.get('qr_code') as FormControl;
  }

  get seg_socialFormControl() {
    return this.patientFormGroupStep2.get('seg_social') as FormControl;
  }

  get nota_facturaFormControl() {
    return this.patientFormGroupStep2.get('nota_factura') as FormControl;
  }

  get fecha_defuncionFormControl() {
    return this.patientFormGroupStep2.get('fecha_defuncion') as FormControl;
  }

  get motivo_defuncionFormControl() {
    return this.patientFormGroupStep2.get('motivo_defuncion') as FormControl;
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

  sendData() {
    if (this.patientFormGroupStep1.valid && this.patientFormGroupStep2.valid) {
      const patient = { ...this.patientFormGroupStep1.value, ...this.patientFormGroupStep2.value };
      const dateFormat = moment(patient.fecha_nacimiento);
      const defuncionDateFormat = moment(patient.fecha_defuncion);
      patient.fecha_nacimiento = dateFormat.format('yyyy-MM-DD');
      patient.fecha_defuncion = defuncionDateFormat.format('yyyy-MM-DD');
      this.patient && this.patient ? this.edit.emit({ ...patient, foto: this.imageAvatarFile }) : this.create.emit({ ...patient, foto: this.imageAvatarFile });
    } else {
      this.toastService.error('Por favor revise los formularios, quedan campos requeridos sin llenar', 'Error');
    }
  }

  validateDate(): void {
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear - 18, 0, 1);
    this.minDate = new Date(currentYear - 100, 11, 31);
  }

  getGender(id) {
    const gender = this.genders.find((g) => g.id == id);
    return gender ? gender.descripcion : '';
  }

  getBloodType(id) {
    const bloodType = this.bloodTypes.find((g) => g.id == id);
    return bloodType ? bloodType.descripcion : '';
  }

  getDocType(id) {
    const docType = this.docTypes.find((d) => d.id == id);
    return docType ? docType.descripcion : '';
  }

  getNationality(id) {
    const nationality = this.nationalities.find((n) => n.id == id);
    return nationality ? nationality.descripcion : '';
  }

  getItemValue(id, list: Array<any>) {
    return list ? list.find((item) => item.id == id) : null;
  }
}
