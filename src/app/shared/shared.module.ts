import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { GaleryFilesComponent } from './galery-files/galery-files.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { ConfirmationDialogFrontComponent } from './confirmation-dialog-front/confirmation-dialog-front.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgpImageLazyLoadModule } from 'ngp-lazy-image';
import { LayoutFilesComponent } from './layout-files/layout-files.component';
@NgModule({
  declarations: [EditProfileComponent, ConfirmationDialogFrontComponent, GaleryFilesComponent, LayoutFilesComponent],
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
    SwiperModule,
    NgpImageLazyLoadModule,
    PipesModule,
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
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    MatSidenavModule,
    MatSelectModule,
    MatTabsModule,
    MatDividerModule,
    MatCardModule,
    FlexLayoutModule,
    MatRippleModule,
    EditProfileComponent,
    ConfirmationDialogFrontComponent,
    GaleryFilesComponent,
    LayoutFilesComponent,
  ],
  // entryComponents: [EditProfileComponent, ConfirmationDialogFrontComponent]
})
export class SharedModule {}
