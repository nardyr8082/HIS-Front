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
  BusinessService
} from 'src/app/backend/services/business/business.service';
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
  selector: 'app-dialog-add-edit-business',
  templateUrl: './dialog-add-edit-business.component.html',
  styleUrls: ['./dialog-add-edit-business.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddEditBusinessComponent implements OnInit, OnDestroy {
  isSaving = false;
  isEditing = false;
  loggedInUser: any;
  form: FormGroup;
  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  language: any;
  _unsubscribeAll: Subject < any > ;
  selectedBusiness = null;
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
    public dialogRef: MatDialogRef < DialogAddEditBusinessComponent > ,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private businessService: BusinessService,

    private showToastr: ShowToastrService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject < any > ();

    this.isEditing = data.isEditing;
    this.selectedBusiness = data.selectedBusiness;
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
  }

  createForm(): void {
    this.form = this.fb.group({
      name: [this.selectedBusiness?.name, [Validators.required]],
      apiUrl: [this.selectedBusiness?.apiUrl, [Validators.required]],
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

    if (!this.isEditing) {
      this.businessService.createBusiness(data).subscribe(
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
        id: this.selectedBusiness.id
      };
      for (let key in data) {
        if (!this.utilsService.isObjectEquals(this.selectedBusiness[key], data[key])) {
          dataOutput[key] = data[key];
        }
      }
      this.businessService.editBusiness(dataOutput).subscribe(
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
