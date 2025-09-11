import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <img src="/imges/Logos/error.svg" alt="Logo" class="h-60 w-auto mb-6" />
      <h1 class="text-3xl font-bold text-slate-700 mb-2">Page not found</h1>
      <p class="text-slate-500 mb-6">Sorry, the page you’re looking for doesn’t exist.</p>
      <a routerLink="/home"
         class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition">
        Go Home
      </a>
    </div>
  `
})
export class NotFoundComponent {}
