import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService, CartItem, PaymentMethod } from './cart.service';

export interface OrderItem extends CartItem {}

export interface OrderSummary {
  id: string;
  items: OrderItem[];
  paymentType: PaymentMethod;
  shippingPrice: number;
  taxPrice: number;
  totalOrderPrice: number;
  createdAt: string;
  updatedAt: string;
  isDelivered: boolean;
  isPaid: boolean;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly router = inject(Router);
  private readonly cart = inject(CartService);
  private readonly http = inject(HttpClient);

  private readonly STORAGE_KEY = 'orders_history';
  private readonly CURRENT_KEY = 'current_order';

  private readonly baseUrl = 'https://ecommerce.routemisr.com/api/v1/orders';

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private readOrders(): OrderSummary[] {
    if (!this.isBrowser()) return [];
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  private writeOrders(list: OrderSummary[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }

  private writeCurrent(order: OrderSummary): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(this.CURRENT_KEY, JSON.stringify(order));
    } catch {}
  }

  getCurrentOrder(): OrderSummary | null {
    if (!this.isBrowser()) return null;
    try {
      const raw = localStorage.getItem(this.CURRENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  getOrders(): OrderSummary[] {
    return this.readOrders();
  }

  getOrdersCount(): number {
    return this.readOrders().length;
  }

  setCurrentById(id: string): void {
    const found = this.readOrders().find((o) => o.id === id) || null;
    if (found) this.writeCurrent(found);
  }

  // 🚨 Local order fallback
  createOrderFromCart(): OrderSummary | null {
    const items = this.cart.getItems();
    if (!items.length) return null;
    const paymentType = this.cart.getPaymentMethod();
    const shippingPrice = items.length ? 30 : 0;
    const taxPrice = Math.round(this.cart.getSubtotal() * 0.14 * 100) / 100;
    const totalOrderPrice =
      this.cart.getSubtotal() + shippingPrice + taxPrice;
    const now = new Date().toISOString();
    const id = `ORD-${Date.now()}`;
    const order: OrderSummary = {
      id,
      items,
      paymentType,
      shippingPrice,
      taxPrice,
      totalOrderPrice,
      createdAt: now,
      updatedAt: now,
      isDelivered: false,
      isPaid: paymentType === 'card',
    };
    const all = this.readOrders();
    all.unshift(order);
    this.writeOrders(all);
    this.writeCurrent(order);
    this.cart.clear();
    return order;
  }

  // ✅ Real API calls

  // Cash on Delivery
  createCashOrder(cartId: string, shippingAddress: any) {
    return this.http.post(`${this.baseUrl}/${cartId}`, {
      shippingAddress,
    });
  }

  // Stripe Card Payment
  createCardOrder(cartId: string, shippingAddress: any) {
    return this.http.post(
      `${this.baseUrl}/checkout-session/${cartId}?url=http://localhost:4200`,
      {
        shippingAddress,
      }
    );
  }
}
