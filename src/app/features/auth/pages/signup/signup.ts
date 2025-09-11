import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';


@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rePassword: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
  }, { validators: [this.passwordsMatchValidator] });

  loading = false;
  errorMessage: string | null = null;

  passwordsMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    return password === rePassword ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.loading) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = null;

    const payload = this.registerForm.value as any;
    this.auth.signup(payload).subscribe({
      next: () => {
        // After signup, navigate to signin so user can log in
        this.router.navigate(['/signin']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Signup failed';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
