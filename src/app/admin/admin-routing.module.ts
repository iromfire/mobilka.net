import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/admin-layout/admin-layout.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthService } from '../shared/services/auth.service';
import { AddPageComponent } from './add-page/add-page.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [AuthService],
      },
      {
        path: 'add',
        component: AddPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'dashboard',
        component: DashboardPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'orders',
        component: OrderPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product/:id/edit',
        component: EditPageComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
