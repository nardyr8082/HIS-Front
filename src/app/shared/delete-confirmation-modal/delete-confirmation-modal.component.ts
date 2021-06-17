import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.css'],
})
export class DeleteConfirmationModalComponent implements OnInit {
  @Input() text = 'Eliminar';

  @Output() accept = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<boolean>();

  constructor(public dialogRef: MatDialogRef<DeleteConfirmationModalComponent>) {}
  isLoading = false;

  ngOnInit() {}

  onCancel() {
    this.cancel.emit(false);
    this.dialogRef.close();
  }

  onRemove() {
    this.isLoading = true;
    this.accept.emit(true);
    this.dialogRef.close();
  }
}
