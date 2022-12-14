import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { IBreadcrumdItem } from './class/breadcrumd-item.class';
import { BreadcrumbService } from './service/breadcrumb.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-breadcrumd',
  templateUrl: './breadcrumd.component.html',
  styleUrls: ['./breadcrumd.component.scss'],
})
export class BreadcrumdComponent implements OnInit, OnDestroy {
  @Input() separator: string;
  breadcrumdList: IBreadcrumdItem[];
  _unSubscribe: Subscription;

  constructor(private breadcrumbService: BreadcrumbService, private router: Router, private location: Location) {}

  ngOnInit() {
    this._unSubscribe = this.breadcrumbService.breadcrumbUpdated$.subscribe((data) => {
      this.breadcrumdList = data;
    });
  }

  ngOnDestroy() {
    this._unSubscribe.unsubscribe();
  }

  goToLink(breadcrumd: IBreadcrumdItem) {
    if (breadcrumd.link) {
      // this.ngProgress.start();
      this.router.navigate([breadcrumd.link]);
    }
  }

  goBack() {
    this.location.back();
  }
}
