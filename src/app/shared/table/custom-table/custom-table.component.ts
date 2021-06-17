import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { DEFAULT_PAGINATION_SIZE } from 'src/app/core/models/api-response.model';
import { FilterResponse, FilterTable } from '../../models/table-filter.model';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent implements AfterViewInit, OnInit {
  @Input() data: MatTableDataSource<any>;
  @Input() dataCount: number = 0;
  @Input() displayedColumns: string[] = [];
  @Input() columnsName: string[] = [];
  @Input() paginationSize = DEFAULT_PAGINATION_SIZE;
  @Input() filters: FilterTable[];

  @Output() changeFilter: EventEmitter<FilterResponse> = new EventEmitter();
  @Output() changePage: EventEmitter<PageEvent> = new EventEmitter();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchTerm = new Subject<any>();
  filterForm: FormGroup;

  constructor() {
    this.searchTerm
      .pipe(
        map(() => this.filterForm.value),
        debounceTime(400),
        distinctUntilChanged(),
      )
      .subscribe((searchTerm) => {
        this.changeFilter.emit(searchTerm);
      });
  }

  ngOnInit() {
    if (this.filters) {
      this.filterForm = new FormGroup({});
      this.filters.forEach((filter) => {
        this.filterForm.addControl(filter.name, new FormControl(''));
      });
    }
  }

  ngAfterViewInit() {
    this.data.paginator = this.paginator;
    this.data.sort = this.sort;
  }

  applyFilter(event: Event, filterName: string) {
    console.log((event.target as HTMLInputElement).value, filterName);
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
}
