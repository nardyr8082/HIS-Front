import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CountryService } from '../../../country/services/country.service';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-state-form',
  templateUrl: './state-form.component.html',
  styleUrls: ['./state-form.component.scss'],
})
export class StateFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  subscriptions: Subscription[] = [];
  stateForm: FormGroup;
  country: any[] = [];
  filteredOptions: Array<any>;

  constructor(private countryService: CountryService, public dialogRef: MatDialogRef<StateFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getCountry();
  }

  buildForm() {
    this.stateForm = new FormGroup({
      nombre: new FormControl(this.data.state ? this.data.state.nombre : '', Validators.required),
      pais: new FormControl(this.data.state ? this.data.state.pais_id : '', Validators.required),
    });
  }
  getCountry() {
    const sub = this.countryService
      .getCountries(null, 'id', 'desc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.country = response.results;
          this.filteredOptions = this.country;
        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }
  onSubmit(data) {
    this.data.state ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscriptions;
  }
}
