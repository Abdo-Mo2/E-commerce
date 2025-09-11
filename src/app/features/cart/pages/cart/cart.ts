import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem, PaymentMethod } from '../../../../core/services/cart.service';
import { OrdersService } from '../../../../core/services/orders.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  imports: [CommonModule,RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  private readonly cartService = inject(CartService);
  private readonly orders = inject(OrdersService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  items: CartItem[] = this.cartService.getItems();
  paymentMethod: PaymentMethod = this.cartService.getPaymentMethod();

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

  setPayment(method: PaymentMethod): void {
    this.paymentMethod = method;
    this.cartService.setPaymentMethod(method);
    this.toastr.success('Payment method updated');
  }

  checkout(): void {
    const order = this.orders.createOrderFromCart();
    this.items = this.cartService.getItems();
    if (order) {
      this.router.navigate(['/orders/delivery']);
      this.toastr.success('Order created');
    }
  }
}
