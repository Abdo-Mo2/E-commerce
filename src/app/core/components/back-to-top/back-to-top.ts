import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      *ngIf="isVisible"
      type="button"
      aria-label="Back to top"
      (click)="scrollToTop()"
      class="fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full bg-main text-white shadow-lg flex items-center justify-center hover:opacity-90 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 arrow-bounce">
        <path d="M12 4l-7 7h4v9h6v-9h4z"/>
      </svg>
    </button>
  `,
  styles: [
    `
    .arrow-bounce {
      animation: arrowUpDown 1.2s ease-in-out infinite;
      transform-origin: center;
    }
    @keyframes arrowUpDown {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    `
  ]
})
export class BackToTopComponent {
  isVisible = false;
  private threshold = 300;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (typeof window === 'undefined') return;
    this.isVisible = window.scrollY > this.threshold;
  }

  scrollToTop(): void {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
