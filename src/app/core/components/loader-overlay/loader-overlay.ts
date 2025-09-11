import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div *ngIf="loader.isLoading$ | async" class="fixed inset-0 z-50 grid place-items-center bg-black/20">
    <div class="h-10 w-10 border-4 border-white/50 border-t-white rounded-full animate-spin"></div>
  </div>
  `
})
export class LoaderOverlay {
  readonly loader = inject(LoaderService);
}


