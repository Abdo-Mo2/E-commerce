import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
  <div class="px-4 py-8 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Settings</h1>
    <nav class="mb-6 flex gap-2">
      <a routerLink="/settings/account" routerLinkActive="bg-main text-white" class="px-3 py-2 rounded-md border">Account settings</a>
      <a routerLink="/settings/security" routerLinkActive="bg-main text-white" class="px-3 py-2 rounded-md border">Security settings</a>
      <a routerLink="/settings/addresses" routerLinkActive="bg-main text-white" class="px-3 py-2 rounded-md border">Addresses settings</a>
    </nav>
    <router-outlet></router-outlet>
  </div>
  `
})
export class SettingsShellPage {}


