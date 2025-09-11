import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../../core/services/profile.service';

@Component({
  selector: 'app-addresses-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="max-w-lg">
    <div class="grid gap-3">
      <label class="text-sm">City
        <input [(ngModel)]="city" class="w-full h-10 border rounded-md px-3" />
      </label>
      <label class="text-sm">Address details
        <textarea [(ngModel)]="details" class="w-full min-h-24 border rounded-md px-3 py-2"></textarea>
      </label>
    </div>
    <button class="mt-4 h-10 px-4 rounded-md bg-main text-white disabled:opacity-50" [disabled]="!dirty" (click)="save()">Edit info</button>
  </div>
  `
})
export class AddressesSettingsPage {
  private readonly profile = inject(ProfileService);
  city = this.profile.getCity();
  details = this.profile.getAddressDetails();

  get dirty(): boolean {
    return this.city !== this.profile.getCity() || this.details !== this.profile.getAddressDetails();
  }

  save(): void {
    this.profile.setCity(this.city);
    this.profile.setAddressDetails(this.details);
  }
}


