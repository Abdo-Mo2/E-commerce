import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  // styleUrl intentionally omitted; using Tailwind utility classes
})
export class ForgotPassword {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  step: 'request' | 'verify' | 'reset' = 'request';
  loading = false;
  errorMessage: string | null = null;

  requestForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  verifyForm: FormGroup = this.fb.group({
    resetCode: ['', [Validators.required, Validators.minLength(6)]]
  });

  resetForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  request(): void {
    if (this.requestForm.invalid || this.loading) { this.requestForm.markAllAsTouched(); return; }
    this.loading = true; this.errorMessage = null;
    const { email } = this.requestForm.value;
    this.auth.requestPasswordReset(email).subscribe({
      next: () => { this.step = 'verify'; },
      error: (err) => { this.errorMessage = err?.error?.message || 'Failed to send code'; this.loading = false; },
      complete: () => { this.loading = false; }
    });
  }

  verify(): void {
    if (this.verifyForm.invalid || this.loading) { this.verifyForm.markAllAsTouched(); return; }
    this.loading = true; this.errorMessage = null;
    const { resetCode } = this.verifyForm.value;
    this.auth.verifyResetCode(resetCode).subscribe({
      next: () => { this.step = 'reset'; },
      error: (err) => { this.errorMessage = err?.error?.message || 'Invalid code'; this.loading = false; },
      complete: () => { this.loading = false; }
    });
  }

  reset(): void {
    if (this.resetForm.invalid || this.loading) { this.resetForm.markAllAsTouched(); return; }
    this.loading = true; this.errorMessage = null;
    const { email } = this.requestForm.value;
    const { newPassword } = this.resetForm.value;
    this.auth.resetPassword(email, newPassword).subscribe({
      next: (res) => {
        // Optionally auto-login with returned token
        if (res?.token) this.auth.saveToken(res.token, true);
        this.router.navigate(['/signin']);
      },
      error: (err) => { this.errorMessage = err?.error?.message || 'Failed to reset password'; this.loading = false; },
      complete: () => { this.loading = false; }
    });
  }
}


