import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem as LocalCartItem, CartService as LocalCartService } from '../../core/services/cart.service';
import { CartService as ApiCartService, CartItem } from '../cart/services/cart.service';
import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.page.html',
})
export class PaymentPageComponent implements OnInit {
  phone = '';
  city = '';
  address = '';

  cartLoaded = false;
  loading = true;
  cartItems: CartItem[] = [];

  private readonly SNAPSHOT_KEY = 'paid_cart_snapshot';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localCart: LocalCartService,
    private apiCart: ApiCartService,
    private orders: OrdersService
  ) {}

  ngOnInit() {
    // Detect successful return from provider via common flags
    const qp = this.route.snapshot.queryParamMap;
    const rawSuccess = qp.get('success') ?? '';
    const successValue = decodeURIComponent(rawSuccess);
    const redirectStatus = qp.get('redirect_status');
    const paidParam = qp.get('paid');
    const statusParam = qp.get('status');
    const hasSessionId = qp.has('session_id');
    const isSuccess = (
      successValue.startsWith('true') ||
      redirectStatus === 'succeeded' ||
      paidParam === 'true' ||
      statusParam === 'completed' ||
      hasSessionId
    );

    if (isSuccess) {
      // Prefer snapshot (what user paid for)
      const snapshotRaw = localStorage.getItem(this.SNAPSHOT_KEY);
      if (snapshotRaw) {
        try {
          const items = JSON.parse(snapshotRaw) as any[];
          if (Array.isArray(items) && items.length > 0) {
            this.orders.recordLocalOrderFromApiItems(items, 'card');
          }
        } catch {}
        localStorage.removeItem(this.SNAPSHOT_KEY);
      } else {
        // Fallback to current API cart
        this.apiCart.getCart().subscribe({
          next: (products) => {
            const items = products || [];
            if (items.length > 0) this.orders.recordLocalOrderFromApiItems(items as any[], 'card');
          },
          complete: () => {}
        });
      }

      // Clear API and local cart and go to orders
      this.apiCart.clearCart().subscribe({
        complete: () => {
          this.localCart.clear();
          this.router.navigate(['/orders']);
        }
      });
      return;
    }

    // Normal load
    this.loadApiCartOrMigrate();
  }

  private loadApiCartOrMigrate(): void {
    this.loading = true;
    this.apiCart.getCart().subscribe({
      next: (products) => {
        const apiItems = products || [];
        if (apiItems.length > 0) {
          this.cartItems = apiItems;
          this.cartLoaded = true;
          this.loading = false;
          return;
        }
        // API cart empty; check local cart and migrate if needed
        const localItems: LocalCartItem[] = this.localCart.getItems();
        if (!localItems || localItems.length === 0) {
          alert('Your cart is empty. Please add items first.');
          this.router.navigate(['/cart']);
          this.loading = false;
          return;
        }
        this.migrateLocalCartToApi(localItems);
      },
      error: (err) => {
        console.error('Error loading cart', err);
        alert('Please sign in again to proceed to payment.');
        this.router.navigate(['/signin']);
        this.loading = false;
      },
    });
  }

  private migrateLocalCartToApi(localItems: LocalCartItem[]): void {
    const ops: Promise<any>[] = [];
    for (const item of localItems) {
      for (let i = 0; i < item.quantity; i++) {
        ops.push(this.apiCart.addToCart(item.productId).toPromise());
      }
    }
    Promise.allSettled(ops)
      .then(() => {
        this.apiCart.getCart().subscribe({
          next: (products) => {
            this.cartItems = products || [];
            this.cartLoaded = this.cartItems.length > 0;
            if (!this.cartLoaded) {
              alert('Could not prepare your cart for checkout. Please try again.');
              this.router.navigate(['/cart']);
              return;
            }
            this.loading = false;
          },
          error: (err) => {
            console.error('Error reloading API cart after migration', err);
            alert('Please sign in again to proceed to payment.');
            this.router.navigate(['/signin']);
            this.loading = false;
          }
        });
      })
      .catch(err => {
        console.error('Error migrating local cart to API cart', err);
        alert('Please sign in again to proceed to payment.');
        this.router.navigate(['/signin']);
        this.loading = false;
      });
  }

  private getCartId(): string | null {
    return this.apiCart.getCartId();
  }

  private recordLocalOrderAndGo(paymentType: 'cod' | 'card'): void {
    this.orders.recordLocalOrderFromApiItems(this.cartItems as any[], paymentType);
    this.router.navigate(['/orders']);
  }

  payCash() {
    const cartId = this.getCartId();
    if (!cartId || this.cartItems.length === 0) {
      alert('Your cart is empty. Please add items first.');
      return;
    }

    const shippingAddress = { details: this.address, phone: this.phone, city: this.city };
    this.orders.createCashOrder(cartId, shippingAddress).subscribe({
      next: (res: any) => {
        console.log('Cash order success:', res);
        this.apiCart.clearCart().subscribe();
        this.localCart.clear();
        this.recordLocalOrderAndGo('cod');
      },
      error: (err) => {
        console.error('Cash order error:', err);
        if (err?.status === 401) alert('Please sign in again to complete your order.');
      },
    });
  }

  payCard() {
    const cartId = this.getCartId();
    if (!cartId || this.cartItems.length === 0) {
      alert('Your cart is empty. Please add items first.');
      return;
    }

    const shippingAddress = { details: this.address, phone: this.phone, city: this.city };
    const origin = (typeof window !== 'undefined' && window.location && window.location.origin)
      ? window.location.origin
      : 'http://localhost:4200';
    const returnUrl = `${origin}/payment?success=true`;

    try { localStorage.setItem(this.SNAPSHOT_KEY, JSON.stringify(this.cartItems)); } catch {}

    this.orders
      .createCardOrder(cartId, shippingAddress, returnUrl)
      .subscribe({
        next: (res: any) => {
          console.log('Card session created:', res);
          if (res.session?.url) {
            window.location.href = res.session.url;
          } else {
            alert('Payment session could not be created. Please try again.');
            localStorage.removeItem(this.SNAPSHOT_KEY);
          }
        },
        error: (err) => {
          console.error('Card order error:', err);
          localStorage.removeItem(this.SNAPSHOT_KEY);
          if (err?.status === 401) alert('Please sign in again to complete your order.');
        },
      });
  }
}
