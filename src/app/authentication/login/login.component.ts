import { Component, OnInit, HostListener, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  message: string;
  loginForm: FormGroup;
  inLoading = false;
  passwordType = 'password';
  valueSpiner = 50;
  bufferValue = 75;
  @ViewChild('username', { static: true }) username: ElementRef;
  @ViewChild('pass', { static: true }) pass: ElementRef;

  constructor(
    public authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    private showToastr: ShowToastrService,
    private fb: FormBuilder,
    private utilsService: UtilsService,
    private loggedInUserService: LoggedInUserService,
  ) {
    this.message = '';
  }

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    if (event.code === 'Enter') {
      this.passwordType = 'password';
      if (this.loginForm.controls['username'].valid) {
        this.pass.nativeElement.focus();
      }
    }
  }

  ngOnInit() {
    this.createForm();
    this.username.nativeElement.focus();
  }

  ngAfterViewInit() {}

  createForm() {
    this.loginForm = this.fb.group({
      username: [{ value: null, disabled: false }, [Validators.required]],
      password: [{ value: null, disabled: false }, [Validators.required]],
    });
  }

  login(username: string, password: string): boolean {
    this.inLoading = true;
    localStorage.removeItem('token');
    localStorage.removeItem('access-token');
    this.authService.login(username, password).subscribe(
      (result: any) => {
        this.loggedInUserService.updateUserToken(result);
        this.showToastr.showSucces('Usted est?? logeado en nuestro sistema.', 'Felicidades!', 5500);
        this.inLoading = false;
        this.router.navigate(['backend/dashboard']);
      },
      () => {
        this.inLoading = false;
        this.showToastr.showError('Su usuario y contrase??a son incorrectos.', 'Error!!');
      },
    );

    return false;
  }
}
