import { ToastrService } from 'ngx-toastr';
import { DATE_FORMATS, DECIMAL_SPLITER, ItemConfiguration, MILLAR_SPLITER, TIME_FORMATS } from './../../models/configuration.config';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { ConfigurationsService } from './../../services/configurations.service';
import { Configurations } from './../../models/configurations.model';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss'],
})
export class ConfigurationsComponent implements OnInit, OnChanges, OnDestroy {
  constructor(private _formBuilder: FormBuilder, private configurationService: ConfigurationsService, private toastrService: ToastrService) {}

  @Input() configuration: Configurations;
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() create: EventEmitter<any> = new EventEmitter();

  configurationForm: FormGroup;
  imagesForm: FormGroup;
  subscriptions: Array<Subscription> = [];

  decimalSpliter: Array<ItemConfiguration> = DECIMAL_SPLITER;
  millarSpleiter: Array<ItemConfiguration> = MILLAR_SPLITER;
  dateFormat: Array<ItemConfiguration> = DATE_FORMATS;
  timeFormat: Array<ItemConfiguration> = TIME_FORMATS;

  customDecimalSpliter = new FormControl(false);
  customMillarSpliter = new FormControl(false);
  customDateFormat = new FormControl(false);
  customTimeFormat = new FormControl(false);

  logos: File[] = [];
  headerImage: File[] = [];
  footerImage: File[] = [];

  currentLogo: string;
  currentHeaderImage: string;
  currentFooterImage: string;

  ngOnInit(): void {}

  ngOnChanges() {
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onSelectLogo(event) {
    this.logos.push(...event.addedFiles);
    this.logoFormControl.setValue(this.logos);
  }

  onSelectHeaderImage(event) {
    this.headerImage.push(...event.addedFiles);
    this.headerImageFormControl.setValue(this.headerImage);
  }

  onSelectFooterImage(event) {
    this.footerImage.push(...event.addedFiles);
    this.footerImageFormControl.setValue(this.footerImage);
  }

  onRemoveLogo(event) {
    this.logos.splice(this.logos.indexOf(event), 1);
    this.logoFormControl.setValue(this.logos);
  }

  onRemoveHeaderImage(event) {
    this.headerImage.splice(this.headerImage.indexOf(event), 1);
    this.headerImageFormControl.setValue(this.headerImage);
  }

  onRemoveFooterImage(event) {
    this.footerImage.splice(this.footerImage.indexOf(event), 1);
    this.footerImageFormControl.setValue(this.footerImage);
  }

  buildForm() {
    this.configurationForm = this._formBuilder.group({
      nombre_sistema: [this.configuration ? this.configuration?.nombre_sistema : '', Validators.required],
      separador_decimales: [this.configuration ? this.configuration?.separador_decimales : ''],
      separador_miles: [this.configuration ? this.configuration?.separador_miles : ''],
      formato_fecha: [this.configuration ? this.configuration?.formato_fecha : '', Validators.required],
      formato_hora: [this.configuration ? this.configuration?.formato_hora : '', Validators.required],
    });

    this.currentLogo = this.configuration?.logo_1;
    this.currentHeaderImage = this.configuration?.imagen_cabecera_informe;
    this.currentFooterImage = this.configuration?.imagen_pie_firma_informe;

    if (this.configuration?.id) {
      this.configurationForm.addControl('id', new FormControl(this.configuration?.id));
    }

    this.imagesForm = this._formBuilder.group({
      logo_1: [this.configuration ? this.configuration.logo_1 : '', Validators.required],
      imagen_cabecera_informe: [this.configuration ? this.configuration.imagen_cabecera_informe : '', Validators.required],
      imagen_pie_firma_informe: [this.configuration ? this.configuration.imagen_pie_firma_informe : '', Validators.required],
    });
  }

  // Form Controls
  get systemNameFormControl() {
    return this.configurationForm?.get('nombre_sistema') as FormControl;
  }

  get decimalSpliterFormControl() {
    return this.configurationForm?.get('separador_decimales') as FormControl;
  }

  get millarSpliterFormControl() {
    return this.configurationForm?.get('separador_miles') as FormControl;
  }

  get dateFormatFormControl() {
    return this.configurationForm?.get('formato_fecha') as FormControl;
  }

  get timeFormatFormControl() {
    return this.configurationForm?.get('formato_hora') as FormControl;
  }

  get idFormControl() {
    return this.configurationForm?.get('id') as FormControl;
  }

  get logoFormControl() {
    return this.imagesForm?.get('logo_1') as FormControl;
  }

  get headerImageFormControl() {
    return this.imagesForm?.get('imagen_cabecera_informe') as FormControl;
  }

  get footerImageFormControl() {
    return this.imagesForm?.get('imagen_pie_firma_informe') as FormControl;
  }

  sendData() {
    const config = this.configurationForm.value;
    const files = [
      { name: 'logo_1', file: this.logos[0] },
      { name: 'imagen_cabecera_informe', file: this.headerImage[0] },
      { name: 'imagen_pie_firma_informe', file: this.footerImage[0] },
    ];
    if (this.configuration?.id) {
      this.edit.emit({ configuration: config, files: files });
    } else {
      this.create.emit({ configuration: config, files: files });
    }
  }

  checkImages(id): Observable<any>[] {
    const result: Observable<any>[] = [];
    if (this.logos?.length > 0) {
      result.push(this.uploadImage(this.logos[0], 'logo_1', id));
    }
    if (this.headerImage?.length > 0) {
      result.push(this.uploadImage(this.headerImage[0], 'imagen_cabecera_informe', id));
    }

    if (this.footerImage?.length > 0) {
      result.push(this.uploadImage(this.footerImage[0], 'imagen_pie_firma_informe', id));
    }

    return result;
  }

  uploadImage(file: File, fieldName: string, id) {
    const formData = new FormData();
    formData.append(fieldName, file);
    formData.append('id', id);
    return this.configurationService.uploadImage(formData, id);
  }
}
