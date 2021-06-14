import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';
import { NavigationService } from 'src/app/core/services/navigation/navigation.service';

@Component({
  selector: 'app-email-forgot-pass',
  templateUrl: './email-forgot-pass.component.html',
  styleUrls: ['./email-forgot-pass.component.scss'],
})
export class EmailForgotComponent implements OnInit {
  message: string;
  emailForm: FormGroup;
  inLoading = false;
  passwordType = 'password';
  valueSpiner = 50;
  bufferValue = 75;

  constructor(
    public authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    private showToastr: ShowToastrService,
    private fb: FormBuilder,
    private utilsService: UtilsService,
    private loggedInUserService: LoggedInUserService,
    private navigationService: NavigationService,
  ) {
    this.message = '';
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.emailForm = this.fb.group({
      email: [{ value: null, disabled: false }, [Validators.required, Validators.email]],
    });
  }

  sendForm(): boolean {
    this.inLoading = true;
    let data = { ...this.emailForm.value };
    this.authService.passForgot(data).subscribe(
      (result: any) => {
        this.showToastr.showSucces(
          'Consulte un correo enviado a la cuenta dada para cambiar el password',
          'Felicidades!',
          5500,
        );
        this.inLoading = false;
        this.router.navigate(['change-pass'], { queryParams: { email: data.email } });
      },
      () => {
        this.inLoading = false;
      },
    );

    return false;
  }
}
