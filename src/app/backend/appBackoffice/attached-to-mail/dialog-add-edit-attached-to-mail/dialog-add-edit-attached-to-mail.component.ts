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
  AttachedToMailService
} from 'src/app/backend/services/attached-to-mail/attached-to-mail.service';
import {
  ImagePickerConf
} from 'ngp-image-picker';
import {
  LoggedInUserService
} from 'src/app/core/services/loggedInUser/logged-in-user.service';
import {
  ShowToastrService
} from 'src/app/core/services/show-toastr/show-toastr.service';
import {
  MailTemplateService
} from '../../../services/mail-template/mail-template.service';




@Component({
  selector: 'app-dialog-add-edit-attached-to-mail',
  templateUrl: './dialog-add-edit-attached-to-mail.component.html',
  styleUrls: ['./dialog-add-edit-attached-to-mail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddEditAttachedToMailComponent implements OnInit, OnDestroy {
  isSaving = false;
  isEditing = false;
  loggedInUser: any;
  form: FormGroup;
  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  language: any;
  _unsubscribeAll: Subject < any > ;
  selectedAttachedToMail = null;
  imagePickerConf: ImagePickerConf = {
    borderRadius: '4px',
    language: 'es',
    height: '120px',
    width: '160px'
  };

  allMailTemplate: any[] = [];
  allStatus: any[] = ["pending", "enabled", "disabled", "expired"];

  /////////////////////////////////////////////////
  languageData: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef < DialogAddEditAttachedToMailComponent > ,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private attachedToMailService: AttachedToMailService,
    private mailtemplateService: MailTemplateService,

    private showToastr: ShowToastrService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject < any > ();

    this.isEditing = data.isEditing;
    this.selectedAttachedToMail = data.selectedAttachedToMail;
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
      this.updateLanguageData();
      this.language = data;


    });
    //////////////////////////////////////////////
    this.fetchData();
  }

  createForm(): void {
    this.form = this.fb.group({
      MailTemplateId: [this.selectedAttachedToMail?.MailTemplate?.id, []],
      file: [this.selectedAttachedToMail?.file, []],
      startDate: [this.selectedAttachedToMail?.startDate, []],
      endDate: [this.selectedAttachedToMail?.endDate, []],
      status: [this.selectedAttachedToMail?.status, []],
  });



}

fetchData() {
  /*Ponga aqui las peticiones para loas datos de Tipo REFERENCE*/
  this.mailtemplateService.getAllMailTemplates().subscribe((data) => {
    this.allMailTemplate = data.data;
  }, e => {
    //catch error
  });

}

ngOnDestroy(): void {
  this._unsubscribeAll.next();
  this._unsubscribeAll.complete();
}




//////////////////////////////////////////
//////////////////////////////////////////

onSave(): void {
  this.spinner.show();
  this.updateLanguageData();
  let data = {
    ...this.form.value,
    ...this.languageData
  };
  this.isSaving = true;
  console.log(data);

  if (!this.isEditing) {
    this.attachedToMailService.createAttachedToMail(data).subscribe(
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
      id: this.selectedAttachedToMail.id
    };
    for (let key in data) {
      if (!this.utilsService.isObjectEquals(this.selectedAttachedToMail[key], data[key])) {
        dataOutput[key] = data[key];
      }
    }
    this.attachedToMailService.editAttachedToMail(dataOutput).subscribe(
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

//////////////////////////// UTILS FOR LANGUAGE HANDLE ///////////////////////////////////////
updateLanguageData() {

}
///////////////////////////////////////////////////////////////////////////////////////////
}
