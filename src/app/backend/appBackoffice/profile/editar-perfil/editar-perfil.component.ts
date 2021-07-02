import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';
import { User } from 'src/app/security-module/user/models/user.model';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss'],
})
export class EditarPerfilComponent implements OnInit {
  @Input() user: User;
  @Output() save: EventEmitter<any> = new EventEmitter();
  innerWidth: any;
  applyStyle = false;
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

  imageAvatarFile;

  constructor(
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private authService: AuthenticationService,
    private showToastr: ShowToastrService,
  ) {
    this.urlImage = environment.apiUrl;
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
      first_name: [this.user && this.user.first_name ? this.user.first_name : null, [Validators.required]],
      last_name: [this.user && this.user.last_name ? this.user.last_name : null, [Validators.required]],
      username: [this.user && this.user.username ? { value: this.user.username, disabled: true } : { value: null, disabled: true }, [Validators.required]],
      direccion: [this.user && this.user?.persona?.direccion ? this.user.persona.direccion : null, []],
      telefono_movil: [this.user && this.user?.persona?.telefono_movil ? this.user.persona.telefono_movil : null, []],
      email: [this.user && this.user.email ? this.user.email : null, [Validators.required, Validators.email]],
    });

    if (this.user?.persona?.foto) {
      this.base64textString = this.user.persona.foto;
      this.imageAvatar = this.urlImage + this.base64textString;
      this.loadImage = false;
    }
  }

  ngOnDestroy(): void {}

  onUpdateProfile(): void {
    const values = this.form.value;
    this.save.emit({ ...values, foto: this.imageAvatarFile });
  }

  handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];
    if (files[0].size < 500000) {
      if (files && file) {
        this.imageAvatarFile = file;
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
