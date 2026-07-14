import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.logout(); // 👈 clear any existing session
  }

  login(): void {
    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {

  console.log('LOGIN RESPONSE:', res);

  this.authService.saveToken(
    res.token,
    res.role,
    res.name,
    res.id
  );

  console.log('TOKEN SAVED:', localStorage.getItem('token'));

  if (res.role === 'admin') {
    this.router.navigate(['/admin']);
  } else if (res.role === 'store_owner') {
    this.router.navigate(['/store-owner']);
  } else if (res.role === 'courier') {
    this.router.navigate(['/courier']);
  } else {
    this.router.navigate(['/products']);
  }

},
        error: (err) => {
          this.errorMessage = err.error.message || 'Login failed';
        }
      });
  }
}