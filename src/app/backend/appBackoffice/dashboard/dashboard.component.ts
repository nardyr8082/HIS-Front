import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { TABLE_CONFIGURATION } from './dashboard-table-configuration';
import { DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  data: any = [];
  dataCount = 0;
  configuration = TABLE_CONFIGURATION;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;
  loading = false;
  constructor(public dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe((resp) => {
      this.data = resp.dataCount;
      this.dataCount = resp.count;
    });
  }

  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
  }
}
