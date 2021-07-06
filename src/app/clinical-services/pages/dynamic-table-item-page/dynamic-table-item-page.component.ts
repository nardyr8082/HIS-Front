import { MetaTableName } from './../../models/MetaTable/MetaTable.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetaTableNameService } from '../../services/metaTableName.service';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-table-item-page',
  templateUrl: './dynamic-table-item-page.component.html',
  styleUrls: ['./dynamic-table-item-page.component.scss'],
})
export class DynamicTableItemPageComponent implements OnInit, OnDestroy {
  metaTableName: MetaTableName;
  metaTableNameId;
  subscriptions: Subscription[] = [];

  constructor(private activatedRoute: ActivatedRoute, private metaTableNameService: MetaTableNameService, private toastService: ToastrService) {
    this.activatedRoute.params.subscribe((params) => {
      this.metaTableNameId = params['id'];
    });
  }

  ngOnInit(): void {
    if (this.metaTableNameId) {
      this.getMetaTableName(this.metaTableNameId);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getMetaTableName(metaTableNameId) {
    const sub = this.metaTableNameService
      .getMetaTableNameById(metaTableNameId)
      .pipe(
        map((response: MetaTableName) => {
          this.metaTableName = response;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener la tabla. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
}
