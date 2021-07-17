import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-systemmanager-form',
  templateUrl: './systemmanager-form.component.html',
  styleUrls: ['./systemmanager-form.component.scss'],
})
export class SystemmanagerFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  subscriptions: Subscription[] = [];

  systemmanagerForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SystemmanagerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  buildForm() {
    this.systemmanagerForm = new FormGroup({
      id: new FormControl(this.data?.systemmanager?.id ? this.data?.systemmanager.id : null),
      descripcion: new FormControl(this.data?.systemmanager?.descripcion ? this.data?.systemmanager.descripcion : null, [Validators.required]),
    });
  }

  get idControl() {
    return this.systemmanagerForm.get('id') as FormControl;
  }

  get descriptionControl() {
    return this.systemmanagerForm.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.systemmanager? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
