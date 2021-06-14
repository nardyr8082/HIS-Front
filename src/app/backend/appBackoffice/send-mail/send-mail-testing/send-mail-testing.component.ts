import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  FormArray,
  FormBuilder, FormControl, FormGroup, Validators,
} from '@angular/forms';
import {
  Subject
} from 'rxjs';
import {
  ShowToastrService
} from 'src/app/core/services/show-toastr/show-toastr.service';
import {
  LoggedInUserService
} from 'src/app/core/services/loggedInUser/logged-in-user.service';
import {MailTemplateService} from "../../../services/mail-template/mail-template.service";
import {NgxSpinnerService} from "ngx-spinner";
import {SendMailService} from "../../../services/send-mail.service";
import {MailOriginService} from "../../../services/mail-origin/mail-origin.service";



@Component({
  selector: 'app-send-mail-testing',
  templateUrl: './send-mail-testing.component.html',
  styleUrls: ['./send-mail-testing.component.scss'],
})
export class SendMailTestingComponent implements OnInit, OnDestroy {
  _unsubscribeAll: Subject < any > ;
  form: FormGroup;
  contentType = 'application/pdf';
  showErrorFile = false;
  allMailTemplate: any[] = [];
  allMailOrigin: any[] = [];
  fileName = '';


  constructor(
    private fb: FormBuilder,
    private loggedInUserService: LoggedInUserService,
    private showToastr: ShowToastrService,
    private mailtemplateService: MailTemplateService,
    private mailOriginService: MailOriginService,
    public spinner: NgxSpinnerService,
    public sendMail: SendMailService,
  ) {
    this._unsubscribeAll = new Subject < any > ();
  }

  ngOnInit() {
    this.createForm();
    this.mailtemplateService.getAllMailTemplates().subscribe((data) => {
      this.allMailTemplate = data.data;
    }, e => {
      //catch error
    });
    this.mailOriginService.getAllMailOrigins().subscribe((data) => {
      this.allMailOrigin = data.data;
    }, e => {
      //catch error
    });
  }

  onSendMail(): void {
    this.spinner.show();
    const data = this.form.value;
    this.spinner.hide();
    this.sendMail.sendEmail(data).subscribe(
      (response) => {
        this.showToastr.showSucces('Email Enviado correctamente');
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.showToastr.showError('Error enviando el email');
        this.spinner.hide();
      },
    );
  }
  createForm(): void {
    this.form = this.fb.group({
      language: ['', [Validators.required]],
      MailTemplateCode: ['', [Validators.required]],
      MailOrigin: ['', [Validators.required]],
      emailDestinationList: this.fb.array([this.fb.control('')]),
      emailDestination: ['', []],
      data: this.fb.group({
        username: ['hectorarem', []],
        voucher: this.fb.group({
          filename: ['', []],
          content: ['', []],
          contentType: [this.contentType, []]
        })

      })
    });
  }

  addEmailDestination() {
    let itemArray = this.form.get('emailDestinationList') as FormArray;
    itemArray.push(this.fb.control(''));
  }
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // kike
  handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];
    if (files[0].size < 500000) {
      if (files && file) {
        let formData = this.form.controls['data'] as FormGroup;
        let formVoucher = formData.controls['voucher'] as FormGroup;
        formVoucher.controls['filename'].setValue(file.name);
        formVoucher.controls['contentType'].setValue(file.type);
        this.fileName = file.name;
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    } else {
      this.showErrorFile = true;
    }
  }

  handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    let formData = this.form.controls['data'] as FormGroup;
    let formVoucher = formData.controls['voucher'] as FormGroup;
    formVoucher.controls['content'].setValue(btoa(binaryString));
    this.contentType = 'application/pdf';
  }

  openFileBrowser(event) {
    event.preventDefault();
    const element: HTMLElement = document.getElementById('filePicker') as HTMLElement;
    element.click();
  }

  getFormArray(form, key): FormArray{
    return this.form.get(key) as FormArray;
  }
  //////////////////////////////////////////

}
