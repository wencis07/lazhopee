import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { filter } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {


  loggedIn = false;
  role = '';
  subscription!: Subscription;

  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

 ngOnInit(): void {

  this.refreshUserState();

  this.subscription = this.authService.loggedIn$
    .subscribe(() => {
      this.refreshUserState();
    });

}

  refreshUserState(): void {
    this.loggedIn = this.authService.isLoggedIn();
    this.role = this.authService.getRole() ?? '';
  }

  isAuthPage(): boolean {
    return [
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password'
    ].includes(this.router.url);
  }

  logout(): void {
    this.authService.logout();
    this.refreshUserState();
    this.router.navigate(['/login']);
  }
  ngOnDestroy(): void {
  this.subscription.unsubscribe();
}

}