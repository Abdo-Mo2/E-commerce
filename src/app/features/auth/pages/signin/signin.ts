import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, SigninResponse } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signin.html',
  styleUrl: './signin.css'
})
export class Signin {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true]
  });

  loading = false;
  errorMessage: string | null = null;

  submit(): void {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    this.errorMessage = null;

    const { email, password, remember } = this.form.value;

    this.authService.signin({ email, password }).subscribe({
      next: (res: SigninResponse) => {
        this.authService.saveToken(res.token, !!remember);
        this.toastr.success('Signed in successfully');
        this.router.navigate(['/home']);
      },
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'error' in err) {
          const e = err as { error?: { message?: string } };
          this.errorMessage = e.error?.message || 'Login failed';
        } else {
          this.errorMessage = 'Login failed';
        }
        this.loading = false;
        this.toastr.error(this.errorMessage || 'Login failed');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
