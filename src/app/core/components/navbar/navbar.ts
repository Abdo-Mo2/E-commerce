import { Component, HostListener, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProfileService } from '../../services/profile.service';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly wishlist = inject(WishlistService);
  protected readonly profile = inject(ProfileService);
  protected readonly cart = inject(CartService);
  protected readonly orders = inject(OrdersService);

  // 👇 This must exist, otherwise `[isLoggedIn]` binding crashes
  @Input() isLoggedIn: boolean = this.auth.isLoggedIn();

  dropdownOpen = false;
  isMenuOpen = false;
  scrolled = false;

  get profileName(): string { return this.profile.getName(); }
  get profileImage(): string | null { return this.profile.getImage(); }

  onLogoClick(event: Event) {
    event.preventDefault();
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/signin']);
    }
  }

  toggleDropdown(): void { this.dropdownOpen = !this.dropdownOpen; }
  closeDropdown(): void { this.dropdownOpen = false; }

  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu(): void { this.isMenuOpen = false; }

  async onProfileFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      await this.profile.setImageFromFile(input.files[0]);
    }
  }

  signout(): void { this.auth.logout(); }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled = window.scrollY > 0;
  }
}
