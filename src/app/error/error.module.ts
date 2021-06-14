import { ForbiddenAccessComponent } from './forbidden-access/forbidden-access.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorRoutingModule } from './error-routing.module';
import { ErrorLayoutComponent } from './error-layout/error-layout.component';
import { NotFoundErrorComponent } from './404/not-found-error.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LostConnectionComponent } from './lost-connection/lost-connection.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, ErrorRoutingModule, MatIconModule, MatButtonModule, MatCardModule],
  declarations: [ErrorLayoutComponent, NotFoundErrorComponent, LostConnectionComponent, ForbiddenAccessComponent],
})
export class ErrorModule {}
