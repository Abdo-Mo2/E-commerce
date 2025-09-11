import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductsService } from '../products/services/products.service';
import { forkJoin, map } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="px-4 py-10 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Your Wishlist</h1>

    <div *ngIf="productList.length === 0" class="text-center py-16">
      <img src="/imges/Logos/download.svg" alt="Empty wishlist" class="w-40 h-40 mx-auto mb-6" />
      <p class="text-gray-600 mb-6">We're sorry, but the product you're looking for is currently unavailable</p>
      <a routerLink="/products" class="inline-flex items-center h-11 px-6 rounded-xl bg-main text-white font-semibold">Back to shopping</a>
    </div>

    <div *ngIf="productList.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <a *ngFor="let p of productList" [routerLink]="['/products', p._id]" class="border rounded-xl p-4 block">
        <img [src]="p.imageCover" [alt]="p.title" class="w-full h-48 object-contain rounded" />
        <div class="mt-2 font-medium line-clamp-1">{{ p.title }}</div>
        <div class="text-sm flex justify-between items-center mb-3"><span>{{ p.price | currency }}</span><span>⭐ {{ p.ratingsAverage }}</span></div>
        <button
          class="h-10 px-4 rounded-xl bg-main text-white font-semibold"
          (click)="$event.preventDefault(); $event.stopPropagation(); addToCart(p)"
        >
          Add to cart
        </button>
      </a>
    </div>
  </div>
  `
})
export class WishlistPage implements OnInit {
  protected readonly wishlist = inject(WishlistService);
  private readonly products = inject(ProductsService);
  private readonly cart = inject(CartService);
  private readonly toastr = inject(ToastrService);

  productList: any[] = [];

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    const ids = this.wishlist.getAll();
    if (!ids.length) {
      this.productList = [];
      return;
    }
    forkJoin(ids.map(id => this.products.getById(id).pipe(map(res => res.data))))
      .subscribe(items => this.productList = items.filter(Boolean));
  }

  remove(id: string): void {
    this.wishlist.remove(id);
    this.loadProducts();
    this.toastr.success('Removed from wishlist');
  }

  addToCart(p: any): void {
    this.cart.addItem({
      productId: p._id,
      title: p.title,
      image: p.imageCover,
      price: p.price,
      quantity: 1
    });
    this.toastr.success('Added to cart');
  }
}


