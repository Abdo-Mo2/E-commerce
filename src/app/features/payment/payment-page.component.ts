import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from '../cart/services/cart.service';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.page.html',
})
export class PaymentPageComponent {
  phone = '';
  city = '';
  address = '';

  private baseUrl = 'https://ecommerce.routemisr.com/api/v1/orders';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cartService: CartService
  ) {}

  private getCartId(): string | null {
    return this.cartService.getCartId();
  }

  // ✅ Cash on delivery
  payCash() {
    const cartId = this.getCartId();
    if (!cartId) {
      alert('Cart ID missing. Please add items to your cart first.');
      return;
    }

    const body = {
      shippingAddress: {
        details: this.address,
        phone: this.phone,
        city: this.city,
      },
    };

    this.http.post(`${this.baseUrl}/${cartId}`, body).subscribe({
      next: (res: any) => {
        console.log('Cash order success:', res);
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        console.error('Cash order error:', err);
      },
    });
  }

  // ✅ Card payment
  payCard() {
    const cartId = this.getCartId();
    if (!cartId) {
      alert('Cart ID missing. Please add items to your cart first.');
      return;
    }

    const body = {
      shippingAddress: {
        details: this.address,
        phone: this.phone,
        city: this.city,
      },
    };

    this.http.post(`${this.baseUrl}/checkout-session/${cartId}?url=http://localhost:4200`, body)
      .subscribe({
        next: (res: any) => {
          console.log('Card session created:', res);
          if (res.session?.url) {
            window.location.href = res.session.url;
          }
        },
        error: (err) => {
          console.error('Card order error:', err);
        },
      });
  }
}
