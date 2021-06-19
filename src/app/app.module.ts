import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptorService } from './core/services/interceptors/loader-interceptor.service';
import { HttpErrorInterceptorService } from './core/services/interceptors/http-error-interceptor.service';
import { TokenInterceptorService } from './core/services/interceptors/token-interceptor.service';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from './core/services/translate-factory/translate-loader';
import { WorkstComponentComponent } from './structure-modules/work-station/components/workst-component/workst-component.component';
import { WorkStationFormComponent } from './structure-modules/work-station/components/work-station-form/work-station-form.component';
import { WorkStationPageComponent } from './structure-modules/work-station/pages/work-station-page/work-station-page.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgxSpinnerModule,
  ],
  declarations: [AppComponent, WorkstComponentComponent, WorkStationFormComponent, WorkStationPageComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
