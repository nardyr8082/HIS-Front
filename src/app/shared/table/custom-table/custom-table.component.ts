import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { DEFAULT_PAGINATION_SIZE } from 'src/app/core/models/api-response.model';
import { FilterResponse, FilterTable } from '../../models/table-filter.model';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() data: MatTableDataSource<any>;
  @Input() dataCount: number = 0;
  @Input() displayedColumns: string[] = [];
  @Input() columnsName: string[] = [];
  @Input() paginationSize = DEFAULT_PAGINATION_SIZE;
  @Input() filters: FilterTable[];
  @Input() rowActionButtons?: any[];
  @Input() loading: boolean;

  @Output() changeFilter: EventEmitter<FilterResponse> = new EventEmitter();
  @Output() changePage: EventEmitter<PageEvent> = new EventEmitter();
  @Output() changeSort: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  subscriptions: Subscription[] = [];

  searchTerm = new Subject<any>();
  filterForm: FormGroup;

  constructor() {
    const sub = this.searchTerm
      .pipe(
        map(() => this.filterForm.value),
        debounceTime(400),
        distinctUntilChanged(),
      )
      .subscribe((searchTerm) => {
        this.filters.forEach((filter) => {
          if (filter.type === 'date') {
            delete searchTerm[filter.name + '___date'];
          }
        });
        this.changeFilter.emit(searchTerm);
      });

    this.subscriptions.push(sub);
  }

  ngOnInit() {
    this.fillDataSource();

    if (this.filters) {
      this.filterForm = new FormGroup({});
      this.filters.forEach((filter) => {
        if (filter.type === 'date') {
          this.filterForm.addControl(filter.name + '___date', new FormControl(''));
          this.filterForm.addControl(filter.name, new FormControl(''));
        } else {
          this.filterForm.addControl(filter.name, new FormControl(''));
        }
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngAfterViewInit() {
    this.data.paginator = this.paginator;
    this.data.sort = this.sort;
  }

  fillDataSource() {
    if (this.data) {
      if (this.rowActionButtons) {
        const hasAction = !!this.displayedColumns.find((c) => c === 'actions');
        if (!hasAction) {
          this.columnsName.push('Actions');
          this.displayedColumns.push('actions');
        }
      }
      // this.dataSource = new MatTableDataSource<any>(this.data);
      // if (!this.pagination) {
      //   this.dataSource.paginator = this.paginator;
      // }
    }
  }

  fireActionButtonEvent(item, button) {
    button.callback(item);
  }

  applyFilter(event: Event, filterName: string) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  onChangePage(page: PageEvent) {
    this.changePage.emit(page);
  }

  resetFilters() {
    this.filters.forEach((filter) => {
      this.filterForm.get(filter.name).setValue('');
    });
    this.searchTerm.next();
  }

  sortData(sort: Sort) {
    this.changeSort.emit(sort);
  }

  changeDate(filterDate, filterName) {
    const date = moment(filterDate).format('yyyy-MM-DD').toString();
    this.filterForm.get(filterName + '___date').setValue(filterDate);
    this.filterForm.get(filterName).setValue(date);
    console.log('Date', date);
    this.searchTerm.next();
  }
}
