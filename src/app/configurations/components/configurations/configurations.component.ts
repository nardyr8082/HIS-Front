import { Subscription } from 'rxjs';
import { ConfigurationsService } from './../../services/configurations.service';
import { Configurations } from './../../models/configurations.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss'],
})
export class ConfigurationsComponent implements OnInit, OnDestroy {
  constructor(private _formBuilder: FormBuilder, private configurationService: ConfigurationsService) {}

  configurationForm: FormGroup;
  configuration: Configurations;
  subscriptions: Array<Subscription> = [];

  ngOnInit(): void {
    this.getConfiguration();
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getConfiguration() {
    const sub = this.configurationService.getConfiguration();
  }

  buildForm() {
    this.configurationForm = this._formBuilder.group({
      nombre_sistema: [this.configuration ? this.configuration.nombre_sistema : '', Validators.required],
      logo_1: [this.configuration ? this.configuration.logo_1 : '', Validators.required],
      separador_decimales: [this.configuration ? this.configuration.separador_decimales : '', Validators.required],
      separador_miles: [this.configuration ? this.configuration.separador_miles : '', Validators.required],
      formato_fecha: [this.configuration ? this.configuration.formato_fecha : '', Validators.required],
      formato_hora: [this.configuration ? this.configuration.formato_hora : '', Validators.required],
      imagen_cabecera_informe: [this.configuration ? this.configuration.imagen_cabecera_informe : '', Validators.required],
      imagen_pie_firma_informe: [this.configuration ? this.configuration.imagen_pie_firma_informe : '', Validators.required],
    });
  }
}
