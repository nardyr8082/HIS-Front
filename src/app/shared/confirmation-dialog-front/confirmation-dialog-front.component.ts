import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog-front',
  templateUrl: './confirmation-dialog-front.component.html',
  styleUrls: ['./confirmation-dialog-front.component.scss'],
})
export class ConfirmationDialogFrontComponent implements OnInit {
  @Output() accept = new EventEmitter<boolean>();
  question = '';
  isSaving = false;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogFrontComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.dialogRef.backdropClick().subscribe(() => {
      if (!this.isSaving) {
        this.dialogRef.close();
      }
    });
  }

  onSave() {
    this.isSaving = true;
    this.accept.emit(true);
    this.dialogRef.close(true);
  }
}
