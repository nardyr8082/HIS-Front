import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';

@Component({
  selector: 'app-change-pass-auth',
  templateUrl: './change-pass-auth.component.html',
  styleUrls: ['./change-pass-auth.component.scss'],
})
export class ChangePassAuthComponent implements OnInit {
  innerWidth: any;
  passType = 'password';
  passType2 = 'password';
  applyStyle = false;
  configuration: any = {};
  message: string;
  inLoading = false;
  form: FormGroup;
  fromPass: FormGroup;
  language = null;

  valueSpiner = 50;
  bufferValue = 75;
  queryParams = null;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 600) {
      this.applyStyle = false;
    } else {
      this.applyStyle = true;
    }
  }

  constructor(
    public authService: AuthenticationService,
    private showToastr: ShowToastrService,
    private fb: FormBuilder,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    private loggedInUserService: LoggedInUserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.queryParams = route.snapshot.queryParams;
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.fromPass = this.fb.group(
      {
        password: [null, [Validators.required, Validators.minLength(6)]],
        repeat: [null, [Validators.required, Validators.minLength(6)]],
      },
      { validator: this.matchValidator.bind(this) },
    );

    this.form = this.fb.group({
      pin: [this.queryParams.pin, [Validators.required]],
      email: [this.queryParams.email],
      passwords: this.fromPass,
    });
  }

  onSubmit() {
    this.inLoading = true;
    this.spinner.show();
    let data = { ...this.form.value };
    data.password = data.passwords.password + '';
    data.repeatPassword = data.passwords.repeat + '';
    delete data.passwords;
    this.authService.changePass(data).subscribe(
      () => {
        this.inLoading = false;
        this.spinner.hide();
        this.showToastr.showSucces('Password changed correctly', 'OK');
        this.router.navigate(['']);
      },
      (error) => {
        this.inLoading = false;
        this.spinner.hide();
      },
    );
  }

  matchValidator(group: FormGroup) {
    const pass = group.controls['password'].value;
    const repeat = group.controls['repeat'].value;
    if (pass === repeat) {
      return null;
    }
    return {
      mismatch: true,
    };
  }

  showPass() {
    if (this.passType === 'password') {
      this.passType = 'text';
    } else {
      this.passType = 'password';
    }
  }

  showPass2() {
    if (this.passType2 === 'password') {
      this.passType2 = 'text';
    } else {
      this.passType2 = 'password';
    }
  }
}
