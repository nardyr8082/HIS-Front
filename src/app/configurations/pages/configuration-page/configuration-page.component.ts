import { ContactUsService } from './../../../backend/services/contact-us/contact-us.service';
import { ConfigurationsService } from './../../services/configurations.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Configurations } from '../../models/configurations.model';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-configuration-page',
  templateUrl: './configuration-page.component.html',
  styleUrls: ['./configuration-page.component.scss'],
})
export class ConfigurationPageComponent implements OnInit, OnDestroy {
  configuration: Configurations;
  subscriptions: Subscription[] = [];

  constructor(private configurationService: ConfigurationsService, private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.getConfiguration();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getConfiguration() {
    const sub = this.configurationService
      .getConfiguration()
      .pipe(
        map((response) => {
          this.configuration = response.results[0] ? response.results[0] : {};
        }),
        catchError((error) => {
          this.toastrService.error('Hubo un error al cargar la configuracón. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  editConfiguration(event) {
    const config = event.configuration;
    const files: any[] = event.files;

    const sub = this.configurationService
      .editConfiguration(config)
      .pipe(
        map((response) => {
          const formData = this.getFormData(files, response.id);
          this.configurationService
            .uploadImage(formData, response.id)
            .pipe(
              map((res) => {
                console.log('Res', res);
                this.toastrService.success('La configuración fue creada exitosamente', 'Felicidades');
                this.getConfiguration();
              }),
              catchError((err) => {
                this.toastrService.error('Hubo un error subiendo las imagenes.', 'Error');
                return of(null);
              }),
            )
            .subscribe();
        }),
        catchError((error) => {
          this.toastrService.error('Hubo un error creando la configuración.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  createConfiguration(event) {
    const config = event.configuration;
    const files: any[] = event.files;

    const sub = this.configurationService
      .createConfiguration(config)
      .pipe(
        map((response) => {
          const formData = this.getFormData(files, response.id);
          this.configurationService
            .uploadImage(formData, response.id)
            .pipe(
              map((res) => {
                console.log('Res', res);
                this.toastrService.success('La configuración fue creada exitosamente', 'Felicidades');
                this.getConfiguration();
              }),
              catchError((err) => {
                this.toastrService.error('Hubo un error subiendo las imagenes.', 'Error');
                return of(null);
              }),
            )
            .subscribe();
        }),
        catchError((error) => {
          this.toastrService.error('Hubo un error creando la configuración.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  uploadImages(file: File, fieldName: string, id) {
    const formData = new FormData();
    formData.append(fieldName, file);
    formData.append('id', id);
    return this.configurationService.uploadImage(formData, id);
  }

  getFormData(files: any[], id) {
    const formData = new FormData();
    formData.append('id', id);
    files.forEach((f) => {
      if (f.file) {
        formData.append(f.name, f.file);
      }
    });
    return formData;
  }
}
