import { IPagination } from 'src/app/core/classes/pagination.class';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { DialogAddEditMailTemplateParamComponent } from '../dialog-add-edit-mail-template-param/dialog-add-edit-mail-template-param.component';

import { MailTemplateParamService } from '../../../services/mail-template-param/mail-template-param.service';
import { ConfirmationDialogComponent } from 'src/app/backend/common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MailTemplateService } from '../../../services/mail-template/mail-template.service';
import { BreadcrumbService } from 'src/app/shared/common-layout-components/breadcrumd/service/breadcrumb.service';

@Component({
  selector: 'app-mail-template-param-table',
  templateUrl: './mail-template-param-table.component.html',
  styleUrls: ['./mail-template-param-table.component.scss'],
})
export class MailTemplateParamTableComponent implements OnInit, OnDestroy {
  allMailTemplateParams: any[] = [];
  searchForm: FormGroup;
  formFilters: FormGroup;
  dataSource: MatTableDataSource<any>;
  showFilterMailTemplateParam: boolean;
  loggedInUser: any;
  loading = false;
  _unsubscribeAll: Subject<any>;
  selection: SelectionModel<any>;
  imageUrl: any;
  showActionsBtn = false;
  language: 'es';
  initialPage = 10;
  pageSizeOptions: number[] = [this.initialPage, 25, 100, 1000];
  searchElementCount = 0;
  @ViewChild(MatPaginator, {
    static: true,
  })
  paginator: MatPaginator;
  @ViewChild(MatSort, {
    static: true,
  })
  sort: MatSort;
  isLoading = false;
  query: IPagination = {
    limit: this.initialPage,
    offset: 0,
    total: 0,
    page: 0,
    order: 'id',
    filter: {
      filterText: '',
      properties: [],
    },
  };

  displayedColumns: string[] = ['select', 'MailTemplateId', 'param', 'description', 'example', 'type', 'actions'];
  displayedColumnsFilters: string[] = ['selectF', 'MailTemplateIdF', 'paramF', 'descriptionF', 'exampleF', 'typeF', 'actionsF'];
  allMailTemplate: any[] = [];
  allType: any[] = ['STRING', 'FILE'];

  constructor(
    private fb: FormBuilder,
    private loggedInUserService: LoggedInUserService,
    private mailTemplateParamService: MailTemplateParamService,
    private breadcrumbService: BreadcrumbService,
    public dialog: MatDialog,
    public utilsService: UtilsService,
    private translateService: TranslateService,
    private mailtemplateService: MailTemplateService,
    private showToastr: ShowToastrService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.dataSource = new MatTableDataSource([]);
    this.selection = new SelectionModel<any>(true, []);
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.imageUrl = environment.imageUrl;

    // ------------------------------------------------
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    // -------------------------------------------------
  }

  ngOnInit() {
    this.createSearchForm();
    this.refreshData();

    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('MailTemplateParams', true);

    ///////////////////////////////////////////

    this.searchForm.valueChanges.pipe(takeUntil(this._unsubscribeAll), distinctUntilChanged(), debounceTime(250)).subscribe((val: any) => {
      if (val.textCtrl.length !== 0) {
        if (val.textCtrl.toString().trim() !== '') {
          this.refreshData();
          this.paginator.firstPage();
        }
      } else {
        this.query = {
          limit: this.initialPage,
          offset: 0,
          total: 0,
          page: 0,
          order: this.query.order || 'id',
          filter: {
            filterText: '',
          },
        };
        this.refreshData();
        this.paginator.firstPage();
      }
    });

    this.formFilters.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
      this.refreshData();
    });
    //////////////////////////////////////////////
    this.fetchData();
    ///////////////////////////////////////////
    ///////////////////////////////////////////
    this.translateService.onLangChange.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });
    ///////////////////////////////////////////////
    //////////////////////////////////////////////
  }

  fetchData() {
    /*Ponga aqui las peticiones para loas datos de Tipo REFERENCE*/
    this.mailtemplateService.getAllMailTemplates().subscribe(
      (data) => {
        this.allMailTemplate = data.data;
      },
      (e) => {
        //catch error
      },
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  refreshData(): void {
    this.isLoading = true;
    const searchvalue = this.searchForm.controls['textCtrl'].value;
    if (searchvalue && searchvalue !== '') {
      this.query.filter.filterText = searchvalue.toString().trim();
      this.query.filter.properties = [];
      this.query.filter.properties.push('filter[$or][param][$like]');
      this.query.filter.properties.push('filter[$or][description][$like]');
      this.query.filter.properties.push('filter[$or][example][$like]');
      this.query.filter.properties.push('filter[$or][type][$like]');
    } else {
      this.query.filter.filterText = '';
    }
    const searchFilter = this.formFilters.value;
    this.mailTemplateParamService.getAllMailTemplateParams(this.query, searchFilter).subscribe(
      (data) => {
        this.initTable(data.data);
        this.query.total = data.meta.pagination.total;
        this.selection.clear();
        this.isLoading = false;
      },
      (error) => {
        this.selection.clear();
        this.isLoading = false;
      },
    );
  }

  initTable(data) {
    this.allMailTemplateParams = data;
    this.dataSource = new MatTableDataSource(data);
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      textCtrl: ['', [Validators.required]],
    });
    this.formFilters = this.fb.group({
      MailTemplateId: [null, []],
      param: [null, []],
      description: [null, []],
      example: [null, []],
      type: [null, []],
    });
  }

  showSearchForm() {
    this.showFilterMailTemplateParam = true;
  }

  hideSearchForm() {
    this.showFilterMailTemplateParam = false;
    this.searchForm.controls['textCtrl'].setValue('');
  }

  //////////////////// Pagination Api ////////////////////////////
  OnPaginatorChange(event) {
    if (event) {
      this.query.limit = event.pageSize || this.initialPage;
      this.query.offset = event.pageIndex * event.pageSize;
      this.query.page = event.pageIndex;
    } else {
      this.query.limit = this.initialPage;
      this.query.offset = 0;
      this.query.page = 1;
    }
    this.refreshData();
  }
  /////////////////////////////////////
  /////// Select logic/////////////////

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  //////////////////////////////

  onCreateMailTemplateParam(): void {
    let dialogRef: MatDialogRef<DialogAddEditMailTemplateParamComponent, any>;
    dialogRef = this.dialog.open(DialogAddEditMailTemplateParamComponent, {
      panelClass: 'app-dialog-add-edit-mail-template-param',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        isEditing: false,
        selectedMailTemplateParam: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData();
    });
  }

  onEditMailTemplateParam(mailTemplateParam): void {
    this.mailTemplateParamService.getMailTemplateParam(mailTemplateParam).subscribe(
      (data) => {
        let dialogRef: MatDialogRef<DialogAddEditMailTemplateParamComponent, any>;
        dialogRef = this.dialog.open(DialogAddEditMailTemplateParamComponent, {
          panelClass: 'app-dialog-add-edit-mail-template-param',
          maxWidth: '100vw',
          maxHeight: '100vh',
          data: {
            isEditing: true,
            selectedMailTemplateParam: data.data,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.refreshData();
        });
      },
      (error) => {},
    );
  }

  async onRemoveMailTemplateParams(elements) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: 'Estas seguro de eliminar este(os) elemento(s)?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          const data = await Promise.all(elements.map((item) => this.mailTemplateParamService.removeMailTemplateParam(item)));
          this.showToastr.showSucces('Elementos correctamente eliminados', 'Éxito', 7500);
          this.refreshData();
        }
      } catch (error) {
        this.refreshData();
      }
    });
  }

  sortData(event) {
    let value = event.active;
    value = event.direction == 'desc' ? `-${value}` : `${value}`;
    this.query.order = value;
    this.refreshData();
  }
}
