import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product/product-list/product-list.component';
import { CartListComponent } from './cart/cart-list/cart-list.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent as AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { DashboardComponent as StoreOwnerDashboardComponent } from './store-owner/dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';
import { InboxComponent } from './message/inbox/inbox.component';
import { ProfileComponent } from './customer/profile/profile.component';
import { OrdersComponent } from './customer/orders/orders.component';
import { DashboardComponent as CourierDashboardComponent } from './courier/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'cart', component: CartListComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'store-owner', component: StoreOwnerDashboardComponent },
  { path: 'about', component: AboutComponent },
  { path: 'inbox', component: InboxComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'courier', component: CourierDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }