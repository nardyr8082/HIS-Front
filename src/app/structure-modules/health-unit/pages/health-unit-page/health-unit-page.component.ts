import { Component, OnInit } from '@angular/core';
import { HealthUnitService } from '../../services/health-unit.service';
import { ROLE_TABLE_CONFIGURATION } from './../../models/role-table-configuration';
import { Permission, Role } from './../../models/role.model';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-health-unit-page',
  templateUrl: './health-unit-page.component.html',
  styleUrls: ['./health-unit-page.component.scss']
})
export class HealthUnitPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
