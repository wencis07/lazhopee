import { Component } from '@angular/core';
import { AccountService } from '../../account/account.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  email = '';
  resetToken = '';
  successMessage = '';
  errorMessage = '';
  submitted = false;

  constructor(private accountService: AccountService) {}

  submit(): void {
    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email';
      return;
    }

    this.accountService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.resetToken = res.resetToken;
        this.successMessage = 'Reset token generated! Copy the token below and use it to reset your password.';
        this.errorMessage = '';
        this.submitted = true;
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Failed to process request';
        this.successMessage = '';
      }
    });
  }
}