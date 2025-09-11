import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface CartItem {
  product: {
    _id: string;
    title: string;
    imageCover: string;
    price: number;
  };
  count: number;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly API = 'https://ecommerce.routemisr.com/api/v1/cart';

  private cartId: string | null = null;
  private items$ = new BehaviorSubject<CartItem[]>([]);

  /** expose observable for components */
  cartItems$ = this.items$.asObservable();

  /** fetch user cart from backend */
  getCart(): Observable<CartItem[]> {
    return this.http.get<any>(this.API).pipe(
      tap((res) => {
        if (res?.data?._id) {
          this.cartId = res.data._id;
          if (this.cartId) {
            localStorage.setItem('cartId', this.cartId);
          }
        }
        this.items$.next(res.data.products || []);
      }),
      map((res) => res.data.products || [])
    );
  }

  /** add product to cart */
  addToCart(productId: string): Observable<any> {
    return this.http.post<any>(this.API, { productId }).pipe(
      tap((res) => {
        if (res?.data?._id) {
          this.cartId = res.data._id;
          if (this.cartId) {
            localStorage.setItem('cartId', this.cartId);
          }
        }
        this.items$.next(res.data.products || []);
      })
    );
  }

  /** remove product from cart */
  removeFromCart(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.API}/${productId}`).pipe(
      tap((res) => {
        if (res?.data?._id) {
          this.cartId = res.data._id;
          if (this.cartId) {
            localStorage.setItem('cartId', this.cartId);
          }
        }
        this.items$.next(res.data.products || []);
      })
    );
  }

  /** clear all cart */
  clearCart(): Observable<any> {
    return this.http.delete<any>(this.API).pipe(
      tap(() => {
        this.cartId = null;
        localStorage.removeItem('cartId');
        this.items$.next([]);
      })
    );
  }

  /** return current cartId (always string) */
  getCartId(): string {
    return this.cartId || localStorage.getItem('cartId') || '';
  }
}
