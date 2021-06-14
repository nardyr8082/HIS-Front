import { NgxSpinnerService } from 'ngx-spinner';
import { Component, Input, OnInit } from '@angular/core';
import { UploadFileService } from 'src/app/core/services/upload-file.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-layout-files',
  templateUrl: './layout-files.component.html',
  styleUrls: ['./layout-files.component.scss'],
})
export class LayoutFilesComponent implements OnInit {
  fkModel = undefined;
  selectedData = undefined;
  imageUrl = environment.imageUrl;

  @Input() set _fkModel(value) {
    if (value) {
      this.fkModel = value;
    }
  }
  @Input() set newFileLoaded(file) {
    if (file) {
      this.allFileUploaded.push(file);
    }
  }
  @Input() set _selectedData(value) {
    if (value) {
      this.selectedData = value;
      this.getAllFiles();
    }
  }

  allFileUploaded: any[] = [];

  constructor(private spinner: NgxSpinnerService, private uploadService: UploadFileService) {}

  ngOnInit(): void {}

  onDeleteMedia(id) {
    this.spinner.show();
    this.uploadService.removeFile(id).subscribe(
      () => {
        this.getAllFiles();
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      },
    );
  }

  markAsMain(file) {
    this.uploadService.editFile({ id: file.id, isMain: !file.isMain }).subscribe(
      () => {
        this.getAllFiles();
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      },
    );
  }

  getAllFiles() {
    this.uploadService.getAllFiles({ limit: 10000, offset: 0 }, { fkModel: this.fkModel, fkId: this.selectedData.id }).subscribe((data) => {
      this.allFileUploaded = data.data;
    });
  }
}
