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

  constructor() {
    // Load cartId from localStorage on service init
    const storedCartId = localStorage.getItem('cartId');
    if (storedCartId) this.cartId = storedCartId;
  }

  /** fetch user cart from backend */
  getCart(): Observable<CartItem[]> {
    return this.http.get<any>(this.API).pipe(
      tap((res) => {
        if (res?.data?._id) this.setCartId(res.data._id);
        this.items$.next(res.data.products || []);
      }),
      map((res) => res.data.products || [])
    );
  }

  /** add product to cart */
  addToCart(productId: string): Observable<any> {
    return this.http.post<any>(this.API, { productId }).pipe(
      tap((res) => {
        if (res?.data?._id) this.setCartId(res.data._id);
        this.items$.next(res.data.products || []);
      })
    );
  }

  /** remove product from cart */
  removeFromCart(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.API}/${productId}`).pipe(
      tap((res) => {
        if (res?.data?._id) this.setCartId(res.data._id);
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

  /** helper to safely set cartId and save to localStorage */
  private setCartId(id: string) {
    this.cartId = id;
    localStorage.setItem('cartId', id);
  }

  /** return current cartId (string or null) */
  getCartId(): string | null {
    return this.cartId;
  }
}
