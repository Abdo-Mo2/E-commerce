import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface WishlistItem {
  productId: string;
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly STORAGE_KEY = 'wishlist_items';

  private readonly itemsSubject = new BehaviorSubject<Set<string>>(new Set());
  readonly count$ = new BehaviorSubject<number>(0);

  constructor() {
    const initial = this.readFromStorage();
    this.itemsSubject.next(initial);
    this.count$.next(initial.size);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private readFromStorage(): Set<string> {
    if (!this.isBrowser()) return new Set();
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      return new Set(arr);
    } catch {
      return new Set();
    }
  }

  private writeToStorage(items: Set<string>): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(items)));
    } catch {
      // no-op
    }
  }

  getAll(): string[] {
    return Array.from(this.itemsSubject.value);
  }

  has(productId: string): boolean {
    return this.itemsSubject.value.has(productId);
  }

  add(productId: string): void {
    const next = new Set(this.itemsSubject.value);
    next.add(productId);
    this.itemsSubject.next(next);
    this.count$.next(next.size);
    this.writeToStorage(next);
  }

  remove(productId: string): void {
    const next = new Set(this.itemsSubject.value);
    next.delete(productId);
    this.itemsSubject.next(next);
    this.count$.next(next.size);
    this.writeToStorage(next);
  }

  toggle(productId: string): void {
    if (this.has(productId)) {
      this.remove(productId);
    } else {
      this.add(productId);
    }
  }

  clear(): void {
    const empty = new Set<string>();
    this.itemsSubject.next(empty);
    this.count$.next(0);
    this.writeToStorage(empty);
  }
}
