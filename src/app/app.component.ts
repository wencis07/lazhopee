import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'online-selling-app';

  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isCustomer(): boolean {
    return this.authService.getRole() === 'customer';
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'admin';
  }

  isStoreOwner(): boolean {
    return this.authService.getRole() === 'store_owner';
  }

  isAuthPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }
  isCourier(): boolean {
  return this.authService.getRole() === 'courier';
}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}