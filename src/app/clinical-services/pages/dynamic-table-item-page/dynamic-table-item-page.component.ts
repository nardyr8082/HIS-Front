import { MetaTableFieldService } from './../../services/metaTableField.service';
import { MetaFieldService } from './../../services/metaField.service';
import { MetaTableName } from './../../models/MetaTable/MetaTable.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaTableNameService } from '../../services/metaTableName.service';
import { catchError, map, filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, of, Subscription } from 'rxjs';
import { MetaField } from '../../models/MetaField/MetaField.model';
import { MetaTableField } from '../../models/MetaTableField/MetaTableField.model';

@Component({
  selector: 'app-dynamic-table-item-page',
  templateUrl: './dynamic-table-item-page.component.html',
  styleUrls: ['./dynamic-table-item-page.component.scss'],
})
export class DynamicTableItemPageComponent implements OnInit, OnDestroy {
  metaTableName: MetaTableName;
  metaTableNameId;
  metaFields: MetaField[];
  metaTableFields: MetaTableField[];

  subscriptions: Subscription[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private metaTableNameService: MetaTableNameService,
    private toastService: ToastrService,
    private metaFieldService: MetaFieldService,
    private metaTableFieldService: MetaTableFieldService,
    private router: Router,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.metaTableNameId = params['id'];
    });
  }
  ngOnInit(): void {
    if (this.metaTableNameId) {
      this.getMetaTableName(this.metaTableNameId);
    }
    this.getMetaFields();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  getMetaFields() {
    const sub = this.metaFieldService
      .getMetaFields({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.metaFields = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los campos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }
  getMetaTableName(metaTableNameId) {
    const sub = this.metaTableNameService
      .getMetaTableNameById(metaTableNameId)
      .pipe(
        map((response: MetaTableName) => {
          this.metaTableName = response;
          this.getMetaTableFields(response.id);
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener la tabla. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  getMetaTableFields(metaTableNameId) {
    const sub = this.metaTableFieldService
      .getMetaTableFields({ mtn__id: metaTableNameId }, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.metaTableFields = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un obteniendo los campos de la tabla. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onCreate(event) {
    const { tableName, fields } = event;
    const sub = this.metaTableNameService
      .createMetaTableName(tableName)
      .pipe(
        map((response) => {
          const fullFields = fields.map((f) => ({ ...f, mtn: response.id }));
          this.createFields(fullFields);
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al crear la tabla. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  createFields(newFields) {
    const sub = this.metaTableFieldService
      .createMultipleMetaTableField(newFields)
      .pipe(
        map(() => {
          this.toastService.success('La tabla fue creada correctamente.', 'Felicidades');
          this.router.navigateByUrl('/clinical-services/meta-table');
        }),
        catchError(() => {
          this.toastService.error('Hubo un error crear los campos de la tabla. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onEdit(event) {
    const sub = this.metaTableNameService
      .editMetaTableName(event)
      .pipe(
        map(() => {
          this.toastService.success('La tabla fue editada correctamente.', 'Felicidades');
          this.router.navigateByUrl('/clinical-services/meta-table');
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al editar la tabla. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }
}
