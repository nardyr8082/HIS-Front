import {
  UtilsService
} from 'src/app/core/services/utils/utils.service';
import {
  environment
} from 'src/environments/environment';
import {
  Component,
  Inject,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  NgxSpinnerService
} from 'ngx-spinner';
import {
  Subject
} from 'rxjs';
import {
  takeUntil
} from 'rxjs/operators';
import {
  MailTemplateService
} from 'src/app/backend/services/mail-template/mail-template.service';
import {
  ImagePickerConf
} from 'ngp-image-picker';
import {
  LoggedInUserService
} from 'src/app/core/services/loggedInUser/logged-in-user.service';
import {
  ShowToastrService
} from 'src/app/core/services/show-toastr/show-toastr.service';


import * as Editor from 'src/assets/js/ckeditor/build/ckeditor';
import {
  cdkEditorBasicConfig
} from 'src/app/core/classes/cdkeditor-full-config';

@Component({
  selector: 'app-dialog-add-edit-mail-template',
  templateUrl: './dialog-add-edit-mail-template.component.html',
  styleUrls: ['./dialog-add-edit-mail-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddEditMailTemplateComponent implements OnInit, OnDestroy {
  isSaving = false;
  isEditing = false;
  loggedInUser: any;
  form: FormGroup;
  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  language: any;
  _unsubscribeAll: Subject<any>;
  selectedMailTemplate = null;
  imagePickerConf: ImagePickerConf = {
    borderRadius: '4px',
    language: 'es',
    height: '120px',
    width: '160px'
  };
  keyArrays: any[] = [];

  public Editor = Editor;
  config = cdkEditorBasicConfig;
  /////////////////////////////////////////////////
  languageData: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddEditMailTemplateComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private mailTemplateService: MailTemplateService,
    private showToastr: ShowToastrService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject<any>();

    this.isEditing = data.isEditing;
    this.selectedMailTemplate = data.selectedMailTemplate;
    this.imageUrl = environment.imageUrl;

    // ------------------LANGUAGE INITIALIZATION----------------
    this.languages = this.loggedInUserService.getlaguages();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.languageForm = new FormControl(this.language);
    // -------------------------------------------------------------------------------------------------
  }

  ngOnInit(): void {
    this.createForm();
    //////////////////EVENT ASSOCIATED WITH CHANGE LANGUAGE////////////////////////////
    this.languageForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.language = data;


    });
    //////////////////////////////////////////////
    this.fetchData();
  }

  createForm(): void {
    this.form = this.fb.group({
      keepXHours: [this.selectedMailTemplate?.keepXHours, []],
      emailTitle: [this.selectedMailTemplate?.emailTitle, [Validators.required]],
      emailBody: [this.selectedMailTemplate?.emailBody, []],
      keys: [this.selectedMailTemplate?.keys, []],
    });
  }

  fetchData() {
    /*Ponga aqui las peticiones para loas datos de Tipo REFERENCE*/

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


//////////////////////////////////////////
//////////////////////////////////////////

  onSave(): void {
    this.spinner.show();
    let data = {
      ...this.form.value,
      ...this.languageData
    };
    this.isSaving = true;
    console.log(data);

    if (!this.isEditing) {
      this.mailTemplateService.createMailTemplate(data).subscribe(
        () => {
          this.showToastr.showSucces('Elemento creado correctamente');
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          this.spinner.hide();
          this.isSaving = false;
          if (error.status == 404 || error.status == 403) {
            this.dialogRef.close();
          }
        },
      );
    } else {
      let dataOutput = {
        id: this.selectedMailTemplate.id
      };
      for (let key in data) {
        if (!this.utilsService.isObjectEquals(this.selectedMailTemplate[key], data[key])) {
          dataOutput[key] = data[key];
        }
      }
      this.mailTemplateService.editMailTemplate(dataOutput).subscribe(
        () => {
          this.showToastr.showSucces('Elemento editado correctanmete');
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          this.spinner.hide();
          this.isSaving = false;
          if (error.status == 404 || error.status == 403) {
            this.dialogRef.close();
          }
        },
      );
    }
  }

// actualizacion de los keys que se encuentran en el titulo y en el body
  updateKeys(): void {
    const title = this.form.controls['emailTitle']['value'] ? this.form.controls['emailTitle']['value'] : '';
    const emailBody = this.form.controls['emailBody']['value'] ? this.form.controls['emailBody']['value'] : '';
    let arrayTitle = title.split('<%=d.');
    let arrayBody = emailBody.split('&lt;%=d.');
    delete arrayTitle[0];
    delete arrayBody[0];
    let arrayTotal = arrayBody.concat(arrayTitle);
    let keys: any[] = [];
    arrayTotal.forEach(function (item) {
      if (item !== '') {
        let value = item.split('%')[0];
        keys.push(value);
      }
    });
    console.log(keys);
    this.keyArrays = keys;
  }
}
