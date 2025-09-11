import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly NAME_KEY = 'profile_name';
  private readonly EMAIL_KEY = 'profile_email';
  private readonly PHONE_KEY = 'profile_phone';
  private readonly PASSWORD_KEY = 'profile_password';
  private readonly CITY_KEY = 'profile_city';
  private readonly ADDRESS_DETAILS_KEY = 'profile_address_details';
  private readonly IMAGE_KEY = 'profile_image_dataurl';

  private isBrowser(): boolean { return typeof window !== 'undefined'; }

  getName(): string {
    if (!this.isBrowser()) return 'User';
    return localStorage.getItem(this.NAME_KEY) || 'User';
  }

  setName(name: string): void {
    if (!this.isBrowser()) return;
    try { localStorage.setItem(this.NAME_KEY, name); } catch {}
  }

  getEmail(): string {
    if (!this.isBrowser()) return '';
    return localStorage.getItem(this.EMAIL_KEY) || '';
  }

  setEmail(email: string): void {
    if (!this.isBrowser()) return;
    try { localStorage.setItem(this.EMAIL_KEY, email); } catch {}
  }

  getPhone(): string {
    if (!this.isBrowser()) return '';
    return localStorage.getItem(this.PHONE_KEY) || '';
  }

  setPhone(phone: string): void {
    if (!this.isBrowser()) return;
    try { localStorage.setItem(this.PHONE_KEY, phone); } catch {}
  }

  getImage(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.IMAGE_KEY);
  }

  async setImageFromFile(file: File): Promise<void> {
    if (!this.isBrowser()) return;
    const dataUrl = await this.readFileAsDataUrl(file);
    try { localStorage.setItem(this.IMAGE_KEY, dataUrl); } catch {}
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  getPassword(): string {
    if (!this.isBrowser()) return '';
    return localStorage.getItem(this.PASSWORD_KEY) || '';
  }

  setPassword(newPassword: string): void {
    if (!this.isBrowser()) return;
    try { localStorage.setItem(this.PASSWORD_KEY, newPassword); } catch {}
  }

  getCity(): string {
    if (!this.isBrowser()) return '';
    return localStorage.getItem(this.CITY_KEY) || '';
  }

  setCity(city: string): void {
    if (!this.isBrowser()) return;
    try { localStorage.setItem(this.CITY_KEY, city); } catch {}
  }

  getAddressDetails(): string {
    if (!this.isBrowser()) return '';
    return localStorage.getItem(this.ADDRESS_DETAILS_KEY) || '';
  }

  setAddressDetails(details: string): void {
    if (!this.isBrowser()) return;
    try { localStorage.setItem(this.ADDRESS_DETAILS_KEY, details); } catch {}
  }
}
