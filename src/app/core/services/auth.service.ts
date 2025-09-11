import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Base URL for your API
const BASE_URL = 'https://ecommerce.routemisr.com/api/v1/auth';

export interface SigninRequest {
  email: string;
  password: string;
}

export interface SigninResponse {
  message: string;
  token: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface SignupResponse {
  message: string;
  user: {
    name: string;
    email: string;
    phone: string;
    role: string;
    _id: string;
  };
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = 'auth_token';
  private readonly TOKEN_SESSION_KEY = 'auth_token_session';

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  // -----------------------
  // 🔹 Auth API calls
  // -----------------------

  signin(payload: SigninRequest) {
    return this.http.post<SigninResponse>(`${BASE_URL}/signin`, payload);
  }

  signup(payload: SignupRequest) {
    return this.http.post<SignupResponse>(`${BASE_URL}/signup`, payload);
  }

  requestPasswordReset(email: string) {
    return this.http.post<{ message: string }>(`${BASE_URL}/forgotPasswords`, { email });
  }

  verifyResetCode(resetCode: string) {
    return this.http.post<{ status: string }>(`${BASE_URL}/verifyResetCode`, { resetCode });
  }

  resetPassword(email: string, newPassword: string) {
    return this.http.put<{ token: string }>(`${BASE_URL}/resetPassword`, { email, newPassword });
  }

  // -----------------------
  // 🔹 Token management
  // -----------------------

  saveToken(token: string, remember: boolean = true): void {
    if (!this.isBrowser()) return;
    try {
      if (remember) {
        localStorage.setItem(this.TOKEN_KEY, token);
        sessionStorage.removeItem(this.TOKEN_SESSION_KEY);
      } else {
        sessionStorage.setItem(this.TOKEN_SESSION_KEY, token);
        localStorage.removeItem(this.TOKEN_KEY);
      }
    } catch {
      // no-op
    }
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    try {
      const localToken = localStorage.getItem(this.TOKEN_KEY);
      const sessionToken = sessionStorage.getItem(this.TOKEN_SESSION_KEY);
      return localToken ?? sessionToken;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (this.isBrowser()) {
      try {
        localStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.TOKEN_SESSION_KEY);
      } catch {}
    }
    this.router.navigate(['/signin']);
  }
}
