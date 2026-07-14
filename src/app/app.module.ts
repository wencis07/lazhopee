import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { productReducer } from './store/products/product.reducer';
import { ProductEffects } from './store/products/product.effects';
import { environment } from '../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module'; 
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent as AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { DashboardComponent as StoreOwnerDashboardComponent } from './store-owner/dashboard/dashboard.component';
import { DashboardComponent as CourierDashboardComponent } from './courier/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule} from '@angular/common';
import { AboutComponent } from './about/about.component';
import { InboxComponent } from './message/inbox/inbox.component';
import { ThreadComponent } from './message/thread/thread.component';
import { OrdersComponent } from './customer/orders/orders.component';
import { ProfileComponent } from './customer/profile/profile.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { MessageDialogComponent } from './message/message-dialog/message-dialog.component';
import { StoreSettingsComponent } from './store-owner/store-settings/store-settings.component';
import { RatingComponent } from './rating/rating.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReviewsComponent } from './store-owner/reviews/reviews.component';
import { StoreProfileComponent } from './store/store-profile/store-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AdminDashboardComponent,
    StoreOwnerDashboardComponent,
    CourierDashboardComponent,
    AboutComponent,
    InboxComponent,
    ThreadComponent,
    OrdersComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    StoreSettingsComponent,
    RatingComponent,
    ReviewsComponent,
    StoreProfileComponent,
  ],
  imports: [

    CommonModule,
    FormsModule,    
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    ProductModule,
    CartModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    StoreModule.forRoot({
  products: productReducer
}),

EffectsModule.forRoot([
  ProductEffects
]),

StoreDevtoolsModule.instrument({
  maxAge: 25,
  logOnly: environment.production
})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }