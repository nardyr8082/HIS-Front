import { CountryPageComponent } from './pages/country-page/country-page.component';
import { CountryFormComponent } from './components/country-form/country-form.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryRoutingModule } from './country-routing.module';

@NgModule({
  declarations: [CountryFormComponent, CountryPageComponent],
  imports: [CommonModule, CountryRoutingModule, SharedModule],
  entryComponents: [CountryFormComponent],
})
export class CountryModule {}
