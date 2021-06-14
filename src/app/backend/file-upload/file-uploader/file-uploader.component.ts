import { UploadFileService } from './../../../core/services/upload-file.service';
import { environment } from './../../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShowToastrService } from './../../../core/services/show-toastr/show-toastr.service';
import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit, OnDestroy {
  form: FormGroup;
  fileUploadedChange = false;
  fkModel = undefined;
  fkId = undefined;
  fileLoaded = undefined;
  showFileLoaded = false;
  showUploadingProgress = true;
  imageUrl = environment.imageUrl;
  metaDataUploading = { progress: 20.0, fileName: '', uuid: '', status: 'pending' };
  _unsub = new Subject<any>();
  allType: any[] = [
    {
      type: 'Video o Imagen local',
      id: 'localMedia',
    },
    {
      type: 'Video de alguna red social (youtube,facebook,instagram)',
      id: 'externalMedia',
    },
  ];
  @Input() set _fkModel(value) {
    if (value) {
      this.fkModel = value;
    }
  }
  @Input() set _fkId(value) {
    if (value) {
      this.fkId = value;
    }
  }

  @Input() set _file(value) {
    if (value) {
      this.fileLoaded = value;
    }
  }

  @Output() $fileUploaded: EventEmitter<any> = new EventEmitter();

  constructor(private showToastr: ShowToastrService, private uploadingService: UploadFileService, public spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      file: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      link: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
        ),
      ]),
    });
    console.log(this.form.get('file').value);
  }

  ngOnDestroy() {
    this._unsub.next(true);
    this._unsub.complete();
  }

  handleFileSelect(event) {
    const file = (event.target as HTMLInputElement).files[0];
    console.log('FileUploaderComponent -> handleFileSelect -> file', file);
    if (!file) {
      return;
    }

    if (file.type.split('/')[0] !== 'video' && file.type.split('/')[0] !== 'image') {
      this.showToastr.showError('El archivo seleccionado no está permitdo, solo se puede subir archivos de tipo video o imagen');
      return;
    }
    if (file.type.split('/')[0] == 'video' && file.type !== 'video/mp4') {
      this.showToastr.showError('El formato permitido para la subida de videos es mp4', '', 8000);
      return;
    }
    this.form.patchValue({
      file: file,
    });
    this.form.get('file').updateValueAndValidity();
    this.showFileLoaded = false;
    this.fileLoaded = undefined;
    this.fileUploadedChange = true;
  }

  computedSize() {
    let file: File = this.form.get('file').value;
    if (file) {
      let size = file.size;
      if (size < 1024) {
        return file.size + 'Bytes';
      }
      size = size / 1024;
      if (size < 1024) {
        return size.toFixed(2) + 'Kb';
      }
      size = size / 1024;
      if (size < 1024) {
        return size.toFixed(2) + 'Mb';
      }
      return (size / 1024).toFixed(2) + 'Gb';
    } else {
      return 0;
    }
  }

  async onUploadFile() {
    let data = this.form.get('file').value;
    const formData: any = new FormData();
    formData.append('file', data);
    this.metaDataUploading = { progress: 0.0, fileName: data.name, uuid: Date.now() + '', status: 'pending' };
    this.showUploadingProgress = true;
    this.fileUploadedChange = false;

    this.uploadingService
      .createFile(formData)
      .pipe(takeUntil(this._unsub))
      .subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              console.log('Request has been made!');
              this.metaDataUploading.status = 'start';
              break;
            case HttpEventType.ResponseHeader:
              console.log('Response header has been received!');
              this.metaDataUploading.status = 'uploading';
              break;
            case HttpEventType.UploadProgress:
              this.metaDataUploading.status = 'uploading';
              let progress = Math.round((event.loaded / event.total) * 100);
              this.metaDataUploading.progress = progress;
              break;
            case HttpEventType.Response:
              this.metaDataUploading.status = 'completed';
              this.fileLoaded = event.body.data;
              this.showFileLoaded = true;
              this.showUploadingProgress = false;
              this.spinner.show();
              let xInput = document.getElementById('file-uploader-input') as HTMLInputElement;
              xInput.value = '';
              this.uploadingService.editFile({ ...this.fileLoaded, fkModel: this.fkModel, fkId: this.fkId }).subscribe(
                (response: any) => {
                  this.fileLoaded = response.data;
                  this.$fileUploaded.next({ ...this.fileLoaded });
                  this.spinner.hide();
                },
                (e) => {
                  this.spinner.hide();
                },
              );
              break;
          }
        },
        (error) => {
          this.metaDataUploading.status = 'error';
        },
      );
  }

  wait(delay = 1000): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(true);
      }, delay);
    });
  }

  onUploadLink() {
    let data = { type: this.form.get('type').value, link: this.form.get('link').value };
    this.spinner.show();
    this.uploadingService.createFileLink(data).subscribe(
      (response1) => {
        this.fileLoaded = response1.data;
        this.uploadingService.editFile({ ...this.fileLoaded, fkModel: this.fkModel, fkId: this.fkId }).subscribe(
          (response: any) => {
            this.fileLoaded = response.data;
            this.$fileUploaded.next({ ...this.fileLoaded });
            this.spinner.hide();
          },
          (e) => {
            this.spinner.hide();
          },
        );
      },
      () => {
        this.spinner.hide();
      },
    );
  }
}
