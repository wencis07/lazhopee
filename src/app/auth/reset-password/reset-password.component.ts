import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/account/account.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  resetToken = '';
  newPassword = '';
  confirmPassword = '';
  successMessage = '';
  errorMessage = '';

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  submit(): void {
    if (!this.resetToken.trim()) {
      this.errorMessage = 'Please enter your reset token';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }
    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters!';
      return;
    }

    this.accountService.resetPassword(this.resetToken, this.newPassword).subscribe({
      next: () => {
        this.successMessage = 'Password reset successfully!';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Reset failed. Token may be invalid or expired.';
      }
    });
  }
}