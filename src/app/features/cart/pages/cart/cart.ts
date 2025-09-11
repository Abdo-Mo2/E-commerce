import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../../../core/services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  items: CartItem[] = this.cartService.getItems();

  get subtotal(): number {
    return this.cartService.getSubtotal();
  }

  inc(item: CartItem): void {
    this.cartService.updateQuantity(item.productId, item.quantity + 1);
    this.items = this.cartService.getItems();
    this.toastr.success('Quantity increased');
  }

  dec(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.productId, item.quantity - 1);
      this.items = this.cartService.getItems();
      this.toastr.success('Quantity decreased');
    }
  }

  remove(item: CartItem): void {
    this.cartService.removeItem(item.productId);
    this.items = this.cartService.getItems();
    this.toastr.success('Removed from cart');
  }

  clear(): void {
    this.cartService.clear();
    this.items = [];
    this.toastr.success('Cart cleared');
  }

  checkout(): void {
    if (this.items.length === 0) {
      this.toastr.error('Your cart is empty');
      return;
    }
    this.router.navigate(['/payment']);
  }
}
