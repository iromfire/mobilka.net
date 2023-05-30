import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './shared/admin-layout/admin-layout.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AddPageComponent } from './add-page/add-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../user/shared/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchPipe } from '../user/shared/pipes/search.pipe';
import { MatInputModule } from '@angular/material/input';
import { AdminRoutingModule } from './admin-routing.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatOptionModule } from '@angular/material/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatInputModule,
    AdminRoutingModule,
    MatSelectModule,
    MatTableModule,
    MatOptionModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  exports: [SearchPipe],
  declarations: [
    AdminLayoutComponent,
    LoginPageComponent,
    AddPageComponent,
    DashboardPageComponent,
    EditPageComponent,
    OrderPageComponent,
    SearchPipe,
  ],
  providers: [AuthService, [provideNgxMask()]],
})
export class AdminModule {}
