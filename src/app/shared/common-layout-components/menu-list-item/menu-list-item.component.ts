import { PreviousRouteService } from './../../../core/services/previous-route/previous-route.service';
import { Component, HostBinding, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavService } from './nav.service';

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed', animate('250ms cubic-bezier(0.4,0.0,0.2,1)')),
    ]),
  ],
})
export class MenuListItemComponent implements OnInit, OnDestroy {
  @Input() expanded: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: any;
  @Input() depth: number;

  isChildOfMeFlag = false;

  _unsubscribeAll: Subject<any>;

  constructor(public navService: NavService, public previousRouteService: PreviousRouteService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit() {
    this.navService.currentUrl.pipe(takeUntil(this._unsubscribeAll)).subscribe((url: string) => {
      if (this.item.route && url) {
        // this.isChildOfMeFlag = false;
        // this.isRuteChildofMy(this.item, url);
        // this.expanded = this.isChildOfMeFlag;
        // this.ariaExpanded = this.expanded;
        if (this.compareUrl(this.item.route, url)) {
          // this.ngProgress.done();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onItemSelected(item: any) {
    if (!item.children || !item.children.length) {
      const currentUrl = this.previousRouteService.getCurrentUrl();
      const itemUrl = item.route;
      if (!this.compareUrl(itemUrl, currentUrl)) {
        // this.ngProgress.start();
      }
      this.router.navigate([item.route]);
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

  public compareUrl(itemUrl, navUrl): boolean {
    let a = '';
    let b = '';
    itemUrl.split('/').map((item) => {
      a += item.trim().toLowerCase();
    });
    navUrl.split('/').map((item) => {
      b += item.trim().toLowerCase();
    });
    return a === b;
  }

  isRuteChildofMy(item: any, rute: string) {
    if (item.route && this.compareUrl(item.route, rute)) {
      this.isChildOfMeFlag = true;
      return;
    }
    const childrenList = JSON.parse(JSON.stringify(item.children));
    for (let i = 0; i < childrenList.length; i++) {
      this.isRuteChildofMy(childrenList[i], rute);
    }
  }
  isActiveSomeChild(item) {
    let res = false;
    const children: any[] = item.children && item.children.length ? item.children : null;
    const url = this.router.url.substring(1);
    if (children) {
      if (children.some((child) => child.route == url)) {
        return true;
      } else {
        const self = this;
        children.forEach(function(grandItem) {
          if (self.hasGrandChild(grandItem, url)) {
            res = true;
          }
        });
      }
    }
    return res;
  }

  hasGrandChild(item, url) {
    const children: any[] = item.children && item.children.length ? item.children : null;
    if (children) {
      if (children.some((child) => child.route == url)) {
        return true;
      } else {
        const self = this;
        children.forEach(function(grandItem) {
          if (grandItem.children && grandItem.children.length) {
            return self.hasGrandChild(grandItem, url);
          }
        });
      }
    }
  }
}
