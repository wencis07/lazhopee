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
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { StoreSettingsComponent } from './store-owner/store-settings/store-settings.component';
import { ReviewsComponent } from './store-owner/reviews/reviews.component';
import { StoreProfileComponent } from './store/store-profile/store-profile.component';


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
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'store-settings', component: StoreSettingsComponent},
  { path: 'store-reviews', component: ReviewsComponent},
  { path: 'store/:id', component: StoreProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }