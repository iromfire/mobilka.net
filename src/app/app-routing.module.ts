import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/main-layout/main-layout.component';
import { MainPageComponent } from './user/main-page/main-page.component';
import { ProductPageComponent } from './user/product-page/product-page.component';
import { CartPageComponent } from './user/cart-page/cart-page.component';
import { DeliveryComponent } from './user/delivery/delivery.component';
import { FavouriteComponent } from './user/favourite/favourite.component';
import { SuccessOrderComponent } from './user/success-order/success-order.component';
import { CheckStatusComponent } from './user/check-status/check-status.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/', pathMatch: 'full' },
      { path: '', component: MainPageComponent },
      { path: 'product/:id', component: ProductPageComponent },
      { path: 'cart', component: CartPageComponent },
      { path: 'delivery', component: DeliveryComponent },
      { path: 'favourite', component: FavouriteComponent },
      { path: 'delivery/order', component: SuccessOrderComponent },
      { path: 'status', component: CheckStatusComponent },
    ],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin-routing.module').then((m) => m.AdminRoutingModule),
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
