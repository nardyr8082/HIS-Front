import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ProductstockFormComponent } from '../../components/productstock-form/productstock-form.component';
import { Productstock } from '../../models/productstock.model';
import { Productstock_TABLE_CONFIGURATION } from '../../models/productstock-table-configuration';
import { ProductstockService } from '../../services/productstock.service';
import { Measure } from '../../../classifiers/measure/models/measure.model';
import { MeasureService } from '../../../classifiers/measure/services/measure.service';
import { ProductFamily } from '../../../classifiers/product-family/models/product-family.model';
import { ProductFamilyService } from '../../../classifiers/product-family/services/product-family.service';
import { TaxService } from '../../../classifiers/tax/services/tax.service';
import { ProgramService } from '../../../classifiers/program/services/program.service';
import { Program } from '../../../classifiers/program/models/program.model';
import { Tax } from '../../../classifiers/tax/models/tax.model';
import { AttributeService } from '../../../classifiers/attribute/services/attribute.service';


@Component({
  selector: 'app-productstock-page',
  templateUrl: './productstock-page.component.html',
  styleUrls: ['./productstock-page.component.scss'],
})
export class ProductstockPageComponent implements OnInit {
  productstock: Productstock[];
  dataCount = 0;
  configuration = Productstock_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Almacén Caja',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Almacén Caja',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteProductstock(item),
    },
  ];

  constructor(private attributeService: AttributeService, private programService: ProgramService, private taxService: TaxService, private familyService: ProductFamilyService, private measureService: MeasureService, private productstockService: ProductstockService, private toastService: ToastrService, public dialog: MatDialog) {
    this.putMeasure();
    this.putFamily();
    this.putTax();
    this.putProgram();
    this.putAtributes();
  }

  ngOnInit(): void {
    this.getProductstock();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  putMeasure(filters = {}) {
    const sub = this.measureService
      .getMeasures(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[4].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  putFamily(filters = {}) {
    const sub = this.familyService
      .getProductFamily(null, filters, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[5].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  putTax(filters = {}) {
    const sub = this.taxService
      .getTaxs(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[6].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  putProgram(filters = {}) {
    const sub = this.programService
      .getPrograms(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[7].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  putAtributes(filters = {}) {
    const sub = this.attributeService
      .getAttributes(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[3].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getProductstock(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.productstockService
      .getProductstock(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Productstock>) => {
          this.productstock = response.results.map((res) => {
            //console.log('Hay datos: ', res);
            const measureString = this.getProductsmeasureString(res.unidad_medida);
            const familyString = this.getFamilyString(res.familia);
            const taxString = this.getTaxString(res.impuesto);
            const programString = this.getProgramString(res.programa);
            const attributeString = this.getAttributeString(res.atributos);
            const activo = res.activo ? '<p class="text-success">Si</p>' : '<p class="text-danger">No</p>';
            return { ...res, activo_string: activo, unidad_medida_string: measureString, familia_string: familyString, impuesto_string: taxString, programa_string: programString, atributos_string: attributeString };
          });
          this.dataCount = response.count;
          this.loading = false;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los datos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          this.loading = false;
          return null;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getProductsmeasureString(m: Measure) {
    return m.descripcion;
  }

  getFamilyString(m: ProductFamily) {
    return m.descripcion;
  }
  getTaxString(m: Tax) {
    return m.descripcion;
  }
  getProgramString(m: Program) {
    return m.descripcion;
  }
  getAttributeString(attribute: any) {
    let attribute_string = '';
    attribute.forEach((off) => {
      attribute_string = attribute_string.concat(`${off.descripcion}, `);
    });
    return attribute_string.substring(0, attribute_string.length - 2);
  }
  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getProductstock(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getProductstock(filters, 'id', 'desc');
  }

  createProductstock() {
    let dialogRef: MatDialogRef<ProductstockFormComponent, any>;

    dialogRef = this.dialog.open(ProductstockFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        productstock: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ProductstockFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((productstock: Productstock) =>
          this.productstockService.createProductstock(productstock).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Almacén producto. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProductstock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Almacén producto fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<ProductstockFormComponent, any>;

    dialogRef = this.dialog.open(ProductstockFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        productstock: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ProductstockFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((productstock: Productstock) =>
          this.productstockService.editProductstock({ ...productstock, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Almacén producto. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProductstock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Almacén producto fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteProductstock(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Almacén producto: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.productstockService.deleteProductstock(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Almacén producto. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProductstock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El almacen producto fue eliminado correctamente.', 'Felicidades');
                modalRef.close();
              }
            }),
          ),
        ),
      )
      .subscribe();

    const sub1 = modalComponentRef.cancel.pipe(tap(() => modalRef.close())).subscribe();
    this.subscriptions.push(sub, sub1);
  }

  changeSort(sort: Sort) {
    this.getProductstock(this.filters, sort.active, sort.direction);
  }
}

