import { Component, OnInit, HostListener } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss'],
})
export class EditarPerfilComponent implements OnInit {
  innerWidth: any;
  applyStyle = false;
  loggedInUser: any;
  passwordType = 'password';
  form: FormGroup;
  formPass: FormGroup;
  defaultImage: '../../../assets/images/avatars/profile2.png';
  isChangePass = false;

  loadImage = false;
  imageAvatarChange = false;
  showErrorImage = false;
  urlImage = 'data:image/jpeg;base64,';
  base64textString = null;
  imageAvatar = null;

  constructor(
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private authService: AuthenticationService,
    private showToastr: ShowToastrService,
  ) {
    this.urlImage = environment.apiUrl;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 600) {
      this.applyStyle = false;
    } else {
      this.applyStyle = true;
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      name: [this.loggedInUser && this.loggedInUser.name ? this.loggedInUser.name : null, [Validators.required]],
      username: [
        this.loggedInUser && this.loggedInUser.username ? this.loggedInUser.username : null,
        [Validators.required],
      ],
      lastName: [
        this.loggedInUser && this.loggedInUser.lastName ? this.loggedInUser.lastName : null,
        [Validators.required],
      ],
      address: [this.loggedInUser && this.loggedInUser.address ? this.loggedInUser.address : null, []],
      phone: [this.loggedInUser && this.loggedInUser.phone ? this.loggedInUser.phone : null, []],
      email: [
        this.loggedInUser && this.loggedInUser.email ? this.loggedInUser.email : null,
        [Validators.required, Validators.email],
      ],
    });

    if (this.loggedInUser.avatar) {
      this.base64textString = this.loggedInUser.avatar;
      this.imageAvatar = this.urlImage + this.base64textString;
      this.loadImage = true;
    }
  }

  ngOnDestroy(): void {}

  onUpdateProfile(): void {
    const data = this.form.value;
    if (this.imageAvatarChange) {
      data.avatar = this.imageAvatar;
    }
    if (this.isChangePass) {
      data.password = this.formPass.value.password;
    } else {
      delete data.password;
    }
    // data.id = this.loggedInUser.id;
    this.spinner.show();
    this.authService.editProfile(data).subscribe(
      (newProfile) => {
        this.loggedInUserService.setNewProfile(newProfile.data);
        this.showToastr.showSucces('Perfil cambiado correctamente');
        this.spinner.hide();
        window.location.reload();
      },
      (error) => {
        this.utilsService.errorHandle(error, 'User', 'Editing');
        this.spinner.hide();
      },
    );
  }

  /////////////////////////////////////

  // kike
  handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];
    if (files[0].size < 500000) {
      if (files && file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    } else {
      this.showErrorImage = true;
    }
  }

  handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.urlImage = 'data:image/jpeg;base64,';
    this.imageAvatar = this.urlImage + this.base64textString;
    this.loadImage = true;
    this.showErrorImage = false;
    this.imageAvatarChange = true;
  }

  openFileBrowser(event) {
    event.preventDefault();

    const element: HTMLElement = document.getElementById('filePicker') as HTMLElement;
    element.click();
  }

  //////////////////////////////////////////
}
