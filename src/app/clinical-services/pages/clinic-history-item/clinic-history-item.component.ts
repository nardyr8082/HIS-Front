import { ToastrService } from 'ngx-toastr';
import { ClinicHistoryService } from './../../services/clinic-history.service';
import { MetaTableNameService } from './../../services/metaTableName.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MetaTableName } from '../../models/MetaTable/MetaTable.model';
import { of, Subscription, Observable, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ClinicHistory } from '../../models/CLinicHistory/clinicHistory.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clinic-history-item',
  templateUrl: './clinic-history-item.component.html',
  styleUrls: ['./clinic-history-item.component.scss'],
})
export class ClinicHistoryItemComponent implements OnInit, OnDestroy {
  metaTableNames: MetaTableName[];
  subscriptions: Subscription[] = [];

  tableNameId;

  constructor(
    private metaTableNameService: MetaTableNameService,
    private clinicHistoryService: ClinicHistoryService,
    private toastrService: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getMetaTableNames();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getMetaTableNames() {
    const sub = this.metaTableNameService
      .getMetaTableNames({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.metaTableNames = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onCreate(data: ClinicHistory[]) {
    const sub = this.clinicHistoryService
      .createMultipleClicnicHistory(data)
      .pipe(
        map(() => {
          this.toastrService.success('La Historia Clínica ha sido creada satisfactoriamente.', 'Felicidades');
          this.router.navigateByUrl('/clinical-services/clinic-history');
        }),
        catchError((err) => {
          this.toastrService.error(err.msg, 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onEdit(data: ClinicHistory[]) {
    const observables: Observable<any>[] = [];
    data.forEach((hcr) => {
      const obs = this.clinicHistoryService.editClicnicHistory(hcr);
      observables.push(obs);
    });

    forkJoin(observables)
      .pipe(
        map(() => {
          this.toastrService.success('La Historia Clínica ha sido modificada satisfactoriamente.', 'Felicidades');
          this.router.navigateByUrl('/clinical-services/clinic-history');
        }),
        catchError((err) => {
          this.toastrService.error(err.msg, 'Error');
          return of(null);
        }),
      )
      .subscribe();
  }
}
