import { ToastrService } from 'ngx-toastr';
import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import * as moment from 'moment';
import { Role } from 'src/app/security-module/role/models/role.model';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { ClinicHistoryStaticService } from '../../../services/clinic-history-static.service';
import { Router } from '@angular/router';
import { ConfirmationDialogFrontComponent } from 'src/app/shared/confirmation-dialog-front/confirmation-dialog-front.component';


@Component({
  selector: 'app-clinic-history-static-pin',
  templateUrl: './clinic-history-static-pin.component.html',
  styleUrls: ['./clinic-history-static-pin.component.scss']
})
export class ClinicHistoryStaticPinComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  clinicHistoryStaticPin: FormGroup;

  clinicHistoryStatic: any;

  clinicHistoryStaticId: number;
  subscriptions: Subscription[] = [];


  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastrService,
    private _location: Location,
    public dialogRef: MatDialogRef<ClinicHistoryStaticPinComponent>,
    private clinicHistoryStaticService: ClinicHistoryStaticService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {

  }

  ngOnInit(): void {

    this.buildForm();

  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  buildForm() {

    this.clinicHistoryStaticPin = new FormGroup({
      paciente_pin: new FormControl(this.data.clinicHistoryStaticPin ? this.data.clinicHistoryStaticPin.paciente_pin : null, Validators.required)
    });
  }




  get paciente_pinControl() {
    return this.clinicHistoryStaticPin?.get('paciente_pin') as FormControl;
  }

  onSubmit(data) {

    if (data.paciente_pin === this.data.dataclinicHistoryStaticPin.paciente_pin) {
      this.dialogRef.close();
      this.router.navigateByUrl(`/clinic-history-static/details/${this.data.dataclinicHistoryStaticPin.id}`);
    }
    else {
      const modalRef = this.dialog.open(ConfirmationDialogFrontComponent, {
        data: {
          question: 'Pin incorrecto',

        },
      });

      const modalComponentRef = modalRef.componentInstance as ConfirmationDialogFrontComponent;
    }


  }

  onCancel() {
    this.dialogRef.close();
  }




}
