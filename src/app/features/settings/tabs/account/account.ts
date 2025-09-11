import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../../core/services/profile.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <div class="w-32 h-32 bg-slate-100 rounded-md overflow-hidden flex items-center justify-center">
        <img *ngIf="image as img" [src]="img" class="w-full h-full object-cover" />
        <span *ngIf="!image" class="text-xs text-slate-500">No image</span>
      </div>
      <label class="inline-flex mt-3 h-10 px-4 rounded-md bg-main text-white items-center cursor-pointer">
        Choose image
        <input type="file" accept="image/*" class="hidden" (change)="onFile($event)" />
      </label>
    </div>
    <div>
      <div class="grid gap-3">
        <label class="text-sm">Username
          <input [(ngModel)]="name" class="w-full h-10 border rounded-md px-3" />
        </label>
        <label class="text-sm">Email
          <input [(ngModel)]="email" class="w-full h-10 border rounded-md px-3" />
        </label>
        <label class="text-sm">Phone
          <input [(ngModel)]="phone" class="w-full h-10 border rounded-md px-3" />
        </label>
      </div>
      <button class="mt-4 h-10 px-4 rounded-md bg-main text-white disabled:opacity-50" [disabled]="!dirty" (click)="save()">Edit info</button>
    </div>
  </div>
  `
})
export class AccountSettingsPage {
  private readonly profile = inject(ProfileService);
  name = this.profile.getName();
  email = this.profile.getEmail();
  phone = this.profile.getPhone();
  image = this.profile.getImage();

  get dirty(): boolean {
    return this.name !== this.profile.getName() || this.email !== this.profile.getEmail() || this.phone !== this.profile.getPhone();
  }

  async onFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      await this.profile.setImageFromFile(input.files[0]);
      this.image = this.profile.getImage();
    }
  }

  save(): void {
    this.profile.setName(this.name);
    this.profile.setEmail(this.email);
    this.profile.setPhone(this.phone);
  }
}


