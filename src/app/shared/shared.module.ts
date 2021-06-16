import { MatPaginatorModule } from '@angular/material/paginator';
import { MenuListItemComponent } from './common-layout-components/menu-list-item/menu-list-item.component';
import { BreadcrumdComponent } from './common-layout-components/breadcrumd/breadcrumd.component';
import { PanelNotificationsComponent } from './common-layout-components/panel-notifications/panel-notifications.component';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { GaleryFilesComponent } from './galery-files/galery-files.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { ConfirmationDialogFrontComponent } from './confirmation-dialog-front/confirmation-dialog-front.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgpImageLazyLoadModule } from 'ngp-lazy-image';
import { LayoutFilesComponent } from './layout-files/layout-files.component';
import { LayoutComponent } from './layout/layout.component';
import { BreadcrumbService } from './common-layout-components/breadcrumd/service/breadcrumb.service';
import { NavService } from './common-layout-components/menu-list-item/nav.service';

////////// --------MATERIAL MODULES------- /////////////////////////
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PreviousRouteService } from 'src/app/core/services/previous-route/previous-route.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { CustomTableComponent } from './table/custom-table/custom-table.component';

///////////////////////////////////////////////////////////////////

const components = [CustomTableComponent];
@NgModule({
  declarations: [
    EditProfileComponent,
    ConfirmationDialogFrontComponent,
    GaleryFilesComponent,
    LayoutFilesComponent,
    LayoutComponent,
    BreadcrumdComponent,
    MenuListItemComponent,
    PanelNotificationsComponent,
    ...components,
  ],
  entryComponents: [PanelNotificationsComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatListModule,
    MatSliderModule,
    MatExpansionModule,
    MatMenuModule,
    MatTableModule,
    MatRadioModule,
    MatDialogModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    MatSidenavModule,
    MatSelectModule,
    MatTabsModule,
    MatDividerModule,
    MatCardModule,
    MatSlideToggleModule,
    MatRippleModule,
    MatPaginatorModule,
    SwiperModule,
    NgpImageLazyLoadModule,
    PipesModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  exports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatListModule,
    MatExpansionModule,
    MatMenuModule,
    MatTableModule,
    MatSliderModule,
    MatRadioModule,
    MatDialogModule,
    MatBadgeModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    MatSidenavModule,
    MatSelectModule,
    MatTabsModule,
    MatDividerModule,
    MatCardModule,
    MatPaginatorModule,
    FlexLayoutModule,
    MatRippleModule,
    EditProfileComponent,
    ConfirmationDialogFrontComponent,
    GaleryFilesComponent,
    LayoutFilesComponent,
    LayoutComponent,
    BreadcrumdComponent,
    MenuListItemComponent,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatProgressBarModule,
    PanelNotificationsComponent,
    ...components,
  ],
  providers: [BreadcrumbService, NavService, PreviousRouteService],
})
export class SharedModule {}
