import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/main-layout/main-layout.component';
import { MainPageComponent } from './user/main-page/main-page.component';
import { CartPageComponent } from './user/cart-page/cart-page.component';
import { ProductPageComponent } from './user/product-page/product-page.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { ProductComponent } from './user/product/product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminModule } from './admin/admin.module';
import { MatInputModule } from '@angular/material/input';
import { DeliveryComponent } from './user/delivery/delivery.component';
import { FavouriteComponent } from './user/favourite/favourite.component';
import { DeleteDialogComponent } from './shared/dialogs/delete-dialog/delete-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CheckDialogComponent } from './shared/dialogs/check-dialog/check-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { SuccessOrderComponent } from './user/success-order/success-order.component';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';
import { CheckStatusComponent } from './user/check-status/check-status.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { firebaseConfig } from '../environments/environment';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    MainPageComponent,
    CartPageComponent,
    ProductPageComponent,
    ProductComponent,
    DeliveryComponent,
    FavouriteComponent,
    DeleteDialogComponent,
    CheckDialogComponent,
    SuccessOrderComponent,
    CheckStatusComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    FormsModule,
    AdminModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    NgxMaskDirective,
    NgxMaskPipe,
    CKEditorModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthInterceptor,
    },
    { provide: LOCALE_ID, useValue: 'ru' },
    [provideNgxMask()],
    { provide: FIREBASE_OPTIONS, useValue: firebaseConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
