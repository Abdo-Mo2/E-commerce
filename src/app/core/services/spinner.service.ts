import { Injectable, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private readonly spinner = inject(NgxSpinnerService);

  private readonly defaultConfig = {
    type: 'ball-newton-cradle' as const,
    size: 'medium' as 'small' | 'medium' | 'large',
    bdColor: 'rgba(0,0,0,0.8)',
    color: '#fff',
    fullScreen: true
  };

  show(name: string = 'ball', message: string = 'Loading...'): void {
    this.spinner.show(name, {
      ...this.defaultConfig,
      template: `<p style="color:white">${message}</p>`
    });
  }

  hide(name: string = 'globalSpinner'): void {
    this.spinner.hide(name);
  }

  // Convenience wrappers
  showProducts() { this.show('ball', 'Loading products...'); }
  hideProducts() { this.hide('ball'); }

  showCategories() { this.show('categoriesSpinner', 'Loading categories...'); }
  hideCategories() { this.hide('categoriesSpinner'); }

  showBrands() { this.show('brandsSpinner', 'Loading brands...'); }
  hideBrands() { this.hide('brandsSpinner'); }

  showGlobal() { this.show('globalSpinner', 'Loading...'); }
  hideGlobal() { this.hide('globalSpinner'); }
}
