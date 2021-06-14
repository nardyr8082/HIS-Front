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
  MailOriginService
} from 'src/app/backend/services/mail-origin/mail-origin.service';
import {
  ImagePickerConf
} from 'ngp-image-picker';
import {
  LoggedInUserService
} from 'src/app/core/services/loggedInUser/logged-in-user.service';
import {
  ShowToastrService
} from 'src/app/core/services/show-toastr/show-toastr.service';




@Component({
  selector: 'app-dialog-add-edit-mail-origin',
  templateUrl: './dialog-add-edit-mail-origin.component.html',
  styleUrls: ['./dialog-add-edit-mail-origin.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddEditMailOriginComponent implements OnInit, OnDestroy {
  isSaving = false;
  isEditing = false;
  loggedInUser: any;
  form: FormGroup;
  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  language: any;
  _unsubscribeAll: Subject < any > ;
  selectedMailOrigin = null;
  imagePickerConf: ImagePickerConf = {
    borderRadius: '4px',
    language: 'es',
    height: '120px',
    width: '160px'
  };



  /////////////////////////////////////////////////
  languageData: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef < DialogAddEditMailOriginComponent > ,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private mailOriginService: MailOriginService,

    private showToastr: ShowToastrService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject < any > ();

    this.isEditing = data.isEditing;
    this.selectedMailOrigin = data.selectedMailOrigin;
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
      host: [this.selectedMailOrigin?.host, [Validators.required]],
      mailFrom: [this.selectedMailOrigin?.mailFrom, [Validators.required]],
      port: [this.selectedMailOrigin?.port, [Validators.required]],
      user: [this.selectedMailOrigin?.user, [Validators.required]],
      password: [this.selectedMailOrigin?.password, [Validators.required]],
      testTo: [this.selectedMailOrigin?.testTo, [Validators.required]],
      isOK: [this.selectedMailOrigin?.isOK, []],
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
  this.updateLanguageData();
  let data = {
    ...this.form.value,
    ...this.languageData
  };
  this.isSaving = true;
  console.log(data);

  if (!this.isEditing) {
    this.mailOriginService.createMailOrigin(data).subscribe(
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
      id: this.selectedMailOrigin.id
    };
    for (let key in data) {
      if (!this.utilsService.isObjectEquals(this.selectedMailOrigin[key], data[key])) {
        dataOutput[key] = data[key];
      }
    }
    this.mailOriginService.editMailOrigin(dataOutput).subscribe(
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
