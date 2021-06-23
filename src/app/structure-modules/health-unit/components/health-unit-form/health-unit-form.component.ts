import { Component, OnInit, EventEmitter, Inject, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { Nivel } from '../../models/health-unit.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { LevelService } from '../../services/level.service';

@Component({
  selector: 'app-health-unit-form',
  templateUrl: './health-unit-form.component.html',
  styleUrls: ['./health-unit-form.component.scss'],
})
export class HealthUnitFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  healthUnitForm: FormGroup;
  subscriptions: Subscription[] = [];
  levels: Nivel[];

  constructor(private levelService: LevelService, public dialogRef: MatDialogRef<HealthUnitFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.getLevels();
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getLevels() {
    const sub = this.levelService
      .getAllLevels()
      .pipe(
        map((response: ApiResponse<Nivel>) => {
          this.levels = response.results;
        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  buildForm() {
    const levelsId = this.data.healthUnit ? this.data.healthUnit.levels_string : null;
    this.healthUnitForm = new FormGroup({
      nombre: new FormControl(this.data.healthUnit ? this.data.healthUnit.nombre : '', Validators.required),
      nivel: new FormControl(levelsId, Validators.required),
      direccion: new FormControl(this.data.healthUnit ? this.data.healthUnit.direccion : false),
    });
  }

  onSubmit(data) {
    this.data.healthUnit ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
