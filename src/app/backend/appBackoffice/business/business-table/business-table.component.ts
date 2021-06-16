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
import { DialogAddEditBusinessComponent } from '../dialog-add-edit-business/dialog-add-edit-business.component';
import { BusinessService } from '../../../services/business/business.service';
import { ConfirmationDialogComponent } from 'src/app/backend/common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from 'src/app/shared/common-layout-components/breadcrumd/service/breadcrumb.service';

@Component({
  selector: 'app-business-table',
  templateUrl: './business-table.component.html',
  styleUrls: ['./business-table.component.scss'],
})
export class BusinessTableComponent implements OnInit, OnDestroy {
  allBusinesss: any[] = [];
  searchForm: FormGroup;
  formFilters: FormGroup;
  dataSource: MatTableDataSource<any>;
  showFilterBusiness: boolean;
  loggedInUser: any;
  loading = false;
  _unsubscribeAll: Subject<any>;
  selection: SelectionModel<any>;
  imageUrl: any;
  showActionsBtn = false;
  language = 'es';
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

  displayedColumns: string[] = ['select', 'name', 'apiUrl', 'businessUUID', 'hiddenCode', 'actions'];
  displayedColumnsFilters: string[] = ['selectF', 'nameF', 'apiUrlF', 'businessUUIDF', 'hiddenCodeF', 'actionsF'];

  constructor(
    private fb: FormBuilder,
    private loggedInUserService: LoggedInUserService,
    private businessService: BusinessService,
    private breadcrumbService: BreadcrumbService,
    public dialog: MatDialog,
    public utilsService: UtilsService,
    private translateService: TranslateService,

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
    this.breadcrumbService.setBreadcrumd('Businesss', true);

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
      this.query.filter.properties.push('filter[$or][name][$like]');
      this.query.filter.properties.push('filter[$or][apiUrl][$like]');
      this.query.filter.properties.push('filter[$or][businessUUID][$like]');
      this.query.filter.properties.push('filter[$or][hiddenCode][$like]');
    } else {
      this.query.filter.filterText = '';
    }
    const searchFilter = this.formFilters.value;
    this.businessService.getAllBusinesss(this.query, searchFilter).subscribe(
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
    this.allBusinesss = data;
    this.dataSource = new MatTableDataSource(data);
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      textCtrl: ['', [Validators.required]],
    });
    this.formFilters = this.fb.group({
      name: [null, []],
      apiUrl: [null, []],
      businessUUID: [null, []],
      hiddenCode: [null, []],
    });
  }

  showSearchForm() {
    this.showFilterBusiness = true;
  }

  hideSearchForm() {
    this.showFilterBusiness = false;
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

  onCreateBusiness(): void {
    let dialogRef: MatDialogRef<DialogAddEditBusinessComponent, any>;
    dialogRef = this.dialog.open(DialogAddEditBusinessComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        isEditing: false,
        selectedBusiness: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData();
    });
  }

  onEditBusiness(business): void {
    this.businessService.getBusiness(business).subscribe(
      (data) => {
        let dialogRef: MatDialogRef<DialogAddEditBusinessComponent, any>;
        dialogRef = this.dialog.open(DialogAddEditBusinessComponent, {
          panelClass: 'app-dialog-add-edit-business',
          maxWidth: '100vw',
          maxHeight: '100vh',
          data: {
            isEditing: true,
            selectedBusiness: data.data,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.refreshData();
        });
      },
      (error) => {},
    );
  }

  async onRemoveBusinesss(elements) {
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
          const data = await Promise.all(elements.map((item) => this.businessService.removeBusiness(item)));
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
