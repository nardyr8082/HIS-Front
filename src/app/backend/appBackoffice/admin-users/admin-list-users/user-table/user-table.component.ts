import { DialogAddEditUserComponent } from '../../dialog-add-edit-user/dialog-add-edit-user.component';
import { UserService } from './../../../../services/user/user.service';
import { IPagination } from 'src/app/core/classes/pagination.class';
import { IUser } from 'src/app/core/classes/user.class';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Component, HostListener, OnInit, ViewChild, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { environment } from 'src/environments/environment';

import { UtilsService } from 'src/app/core/services/utils/utils.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/backend/common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements OnInit {
  @Input() role;
  urlImage: string;
  innerWidth: any;
  applyStyle = false;
  allUsers: IUser[] = [];
  searchForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  showFilterUser: boolean;
  loggedInUser: IUser;
  isLoading = false;
  _unsubscribeAll: Subject<any>;
  selection: SelectionModel<any>;
  imageUrl: any;
  showActionsBtn = false;
  displayedColumns: string[] = ['select', 'avatar', 'name', 'lastName', 'email', 'username', 'status', 'actions'];
  initialPage = 10;
  pageSizeOptions: number[] = [this.initialPage, 25, 100, 1000];
  searchElementCount = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  language: 'es';
  posibleEstatus = {
    enabled: 'habilitado',
    pending: 'pendiente',
    disabled: 'deshabilitado',
  };

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

  constructor(
    private fb: FormBuilder,
    private loggedInUserService: LoggedInUserService,
    private userService: UserService,

    public dialog: MatDialog,
    private utilsService: UtilsService,
    private showToastr: ShowToastrService,
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.selection = new SelectionModel<any>(true, []);
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.imageUrl = environment.imageUrl;
    this._unsubscribeAll = new Subject<any>();
    console.log('TCL: UserTableComponent -> environment.imageUrl', this.imageUrl);
  }

  ngOnInit() {
    this.updateDisplayColumnsData();
    this.createSearchForm();
    this.refreshData();

    ///////////////////////////////////////////

    this.searchForm.valueChanges
      .pipe(takeUntil(this._unsubscribeAll), distinctUntilChanged(), debounceTime(250))
      .subscribe((val: any) => {
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
            order: 'id',
            filter: {
              filterText: '',
            },
          };
          this.refreshData();
          this.paginator.firstPage();
        }
      });

    ///////////////////////////////////////////
  }

  refreshData(): void {
    this.isLoading = true;
    const searchvalue = this.searchForm.controls['textCtrl'].value;
    if (searchvalue && searchvalue !== '') {
      this.query.filter.filterText = searchvalue.toString().trim();
      this.query.filter.properties = [];
      this.query.filter.properties.push('filter[$or][name][$like]');
    } else {
      this.query.filter.filterText = '';
    }

    if (this.role === 'Messenger') {
      this.userService.getAllMEssengers(this.query, { role: this.role }).subscribe(
        (data) => {
          data.data = [
            ...data.data.map((item) => {
              item.name = item.Person.name;
              item.lastName = item.Person.lastName;
              item.email = item.Person.email;
              item.username = item.Person.username;
              item.status = item.Person.status;
              return item;
            }),
          ];
          this.initTable(data.data);
          this.searchElementCount = data.meta.total;
          this.query.total = data.meta.pagination.total;
          this.selection.clear();
          this.isLoading = false;
        },
        (error) => {
          this.utilsService.errorHandle(error);
          this.selection.clear();
          this.isLoading = false;
        },
      );
    } else {
      this.userService.getAllUsers(this.query, { role: this.role }).subscribe(
        (data) => {
          this.initTable(data.data);
          this.searchElementCount = data.meta.total;
          this.query.total = data.meta.pagination.total;
          this.selection.clear();
          this.isLoading = false;
        },
        (error) => {
          this.utilsService.errorHandle(error);
          this.selection.clear();
          this.isLoading = false;
        },
      );
    }

    // let users = [
    //   { avatar: null, name: 'Jose', lastName: 'Alejandro', email: 'jalejandro2928@gmail.com', username: 'jalejandro2928' },
    //   { avatar: null, name: 'Pedro', lastName: 'Gonzales', email: 'pedro@gmail.com', username: 'pedro2928' },
    //   { avatar: null, name: 'Joaquin', lastName: 'Amigo', email: 'jamigo@gmail.com', username: 'jpm28' },
    //   { avatar: null, name: 'Jose', lastName: 'Perez', email: 'garcia@gmail.com', username: 'jnuipo28' }];
    // this.initTable(users);
  }

  initTable(data) {
    this.allUsers = data;
    this.dataSource = new MatTableDataSource(data);
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      textCtrl: ['', [Validators.required]],
    });
  }

  showSearchForm() {
    this.showFilterUser = true;
  }

  hideSearchForm() {
    this.showFilterUser = false;
    this.searchForm.controls['textCtrl'].setValue('');
  }

  filterUsersByName(name: string) {
    let temp = this.allUsers.filter(
      (user) =>
        user.username.toLowerCase().indexOf(name.toLowerCase()) >= 0 ||
        (user.name && user.name.toLowerCase().indexOf(name.toLowerCase()) >= 0) ||
        (user.lastName && user.lastName.toLowerCase().indexOf(name.toLowerCase()) >= 0) ||
        (user.email && user.email.toLowerCase().indexOf(name.toLowerCase()) >= 0),
    );
    this.searchElementCount = temp.length;
    return temp;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 600) {
      this.applyStyle = false;
    } else {
      this.applyStyle = true;
    }
  }

  ///////Select logic/////////////////

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

  onCreateUser(): void {
    let dialogRef: MatDialogRef<DialogAddEditUserComponent, any>;
    dialogRef = this.dialog.open(DialogAddEditUserComponent, {
      panelClass: 'app-dialog-add-edit-user',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        isEditing: false,
        selectedUser: null,
        role: this.role,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData();
    });
  }

  onEditUser(person): void {
    let dialogRef: MatDialogRef<DialogAddEditUserComponent, any>;
    this.userService.getUser(person).subscribe(
      (data) => {
        dialogRef = this.dialog.open(DialogAddEditUserComponent, {
          panelClass: 'app-dialog-add-edit-user',
          maxWidth: '100vw',
          maxHeight: '100vh',
          data: {
            isEditing: true,
            selectedUser: data.data,
            role: this.role,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.refreshData();
        });
      },
      (err) => {
        this.utilsService.errorHandle(err, 'User', 'Listing');
      },
    );
  }

  async onRemoveUser(users) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: '¿Está seguro que desea eliminar el usuario?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          if (this.role === 'Messenger') {
            const data = await Promise.all(users.map((item) => this.userService.removeMEssenger(item)));
            this.showToastr.showSucces('Messengers successfully removed', 'Succes', 7500);
            this.refreshData();
          } else {
            const data = await Promise.all(users.map((item) => this.userService.removeUser(item)));
            this.showToastr.showSucces('Users successfully removed', 'Succes', 7500);
            this.refreshData();
          }
        }
      } catch (error) {
        this.utilsService.errorHandle(error);
        this.refreshData();
      }
    });
  }

  updateDisplayColumnsData() {
    if (this.role === 'Messenger') {
      this.displayedColumns = [
        'select',
        'avatar',
        'fullName',
        'email',
        'username',
        'dni',
        'countries',
        'status',
        'actions',
      ];
    }
  }

  //////////////////////////////
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
  ////////////////////////////////////////////////////////
}
