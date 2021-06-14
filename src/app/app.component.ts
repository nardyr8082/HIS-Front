import { Component, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'BACKEND-EMPRESAS';

  constructor(private spinner: NgxSpinnerService, private translate: TranslateService) {
    this.spinner.show();
    this.translate.setDefaultLang('es');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }
}
