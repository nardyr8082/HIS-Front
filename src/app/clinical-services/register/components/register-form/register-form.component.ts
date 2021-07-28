import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { RegisterService } from '../../services/register.service';


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  registerForm: FormGroup;
  sesion_clinica: any = [];
  subscriptions: Subscription[] = [];

  constructor(public registerService: RegisterService, public dialogRef: MatDialogRef<RegisterFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getClinicSession();

  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getClinicSession() {
    const sub = this.registerService
      .getClinicSession()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.sesion_clinica = response.results;
          console.log(this.sesion_clinica);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }


  buildForm() {
    this.registerForm = new FormGroup({
      sesion_clinica: new FormControl(this.data.register ? this.data.register.sesion_clinica_id : '', Validators.required),
    });
    console.log('mensaje form:', this.registerForm);
  }
  get sessionControl() {
    return this.registerForm?.get('sesion_clinica') as FormControl;
  }

  onSubmit(data) {
    this.data.register ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
