import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

export interface CartItem {
  // Optional fields for API parity
  count?: number;
  product?: any;
  // Required fields used by local cart logic
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export type PaymentMethod = 'cod' | 'card';

@Injectable({ providedIn: 'root' })
export class CartService {
  clearCart() {
    throw new Error('Method not implemented.');
  }
  getCart() {
    throw new Error('Method not implemented.');
  }
  private readonly http = inject(HttpClient);

  private readonly STORAGE_KEY = 'cart_items';
  private readonly PAYMENT_METHOD_KEY = 'cart_payment_method';
  cartItems$: any;

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  getItems(): CartItem[] {
    if (!this.isBrowser()) return [];
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  saveItems(items: CartItem[]): void {
    if (!this.isBrowser()) return;
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items)); } catch {}
  }

  addItem(item: CartItem): void {
    const items = this.getItems();
    const existing = items.find(i => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push(item);
    }
    this.saveItems(items);
  }

  updateQuantity(productId: string, quantity: number): void {
    const items = this.getItems().map(i => i.productId === productId ? { ...i, quantity } : i);
    this.saveItems(items);
  }

  removeItem(productId: string): void {
    const items = this.getItems().filter(i => i.productId !== productId);
    this.saveItems(items);
  }

  clear(): void {
    this.saveItems([]);
  }

  getSubtotal(): number {
    return this.getItems().reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  getItemCount(): number {
    return this.getItems().reduce((sum, i) => sum + i.quantity, 0);
  }

  getPaymentMethod(): PaymentMethod {
    if (!this.isBrowser()) return 'cod';
    const raw = localStorage.getItem(this.PAYMENT_METHOD_KEY);
    return (raw === 'card' || raw === 'cod') ? raw : 'cod';
  }

  setPaymentMethod(method: PaymentMethod): void {
    if (!this.isBrowser()) return;
    try { localStorage.setItem(this.PAYMENT_METHOD_KEY, method); } catch {}
  }
}


