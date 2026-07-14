import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/account/account.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  activeTab: 'profile' | 'password' = 'profile';

  // Profile
  name = '';
  email = '';
  role = '';
  successMessage = '';
  errorMessage = '';

  // Password
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordSuccess = '';
  passwordError = '';

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.accountService.getProfile().subscribe({
      next: (data) => {
        this.name = data.name;
        this.email = data.email;
        this.role = data.role;
      },
      error: (err) => console.error(err)
    });
  }

  updateProfile(): void {
    this.accountService.updateProfile({ name: this.name, email: this.email }).subscribe({
      next: (res) => {
        this.successMessage = 'Profile updated successfully!';
        this.errorMessage = '';
        // Update name in localStorage
        localStorage.setItem('name', this.name);
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Update failed';
        this.successMessage = '';
      }
    });
  }

  changePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Passwords do not match!';
      return;
    }
    if (this.newPassword.length < 6) {
      this.passwordError = 'Password must be at least 6 characters!';
      return;
    }

    this.accountService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.passwordSuccess = 'Password changed successfully!';
        this.passwordError = '';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        setTimeout(() => this.passwordSuccess = '', 3000);
      },
      error: (err) => {
        this.passwordError = err.error.message || 'Password change failed';
        this.passwordSuccess = '';
      }
    });
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This cannot be undone!')) {
      if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
        this.accountService.deleteAccount().subscribe({
          next: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
            alert('Your account has been deleted.');
          },
          error: (err) => alert(err.error.message || 'Delete failed')
        });
      }
    }
  }

  switchTab(tab: 'profile' | 'password'): void {
    this.activeTab = tab;
    this.successMessage = '';
    this.errorMessage = '';
    this.passwordSuccess = '';
    this.passwordError = '';
  }
}