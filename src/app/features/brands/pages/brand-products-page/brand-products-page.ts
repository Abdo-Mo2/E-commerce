import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environments';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { CartService } from '../../../../core/services/cart.service';
interface Product {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
}

@Component({
  selector: 'app-brand-products-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './brand-products-page.html'
})
export class BrandProductsPageComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  protected readonly wishlist = inject(WishlistService);
  private readonly cart = inject(CartService);

  products: Product[] = [];
  brandId!: string;
  toastr: any;
product: any;

  ngOnInit(): void {
    // Get brandId from route param
    this.route.paramMap.subscribe(params => {
      this.brandId = params.get('id') || '';
      if (this.brandId) {
        this.fetch();
      }
    });
  }

  fetch(): void {
    this.http
      .get<{ data: Product[] }>(
        `${environment.apiUrl}/products`,
        { params: { brand: this.brandId } }  // 👈 filter by brandId
      )
      .subscribe(res => this.products = res.data || []);
  }

  toggleWishlist(productId: string): void {
    this.wishlist.toggle(productId);
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist.has(productId);
  }

  addToCart(product: any): void {
    this.cart.addItem({
      productId: product._id,
      title: product.title,
      image: product.imageCover,
      price: product.price,
      quantity: 1,
    });
    this.toastr?.success?.('Added to cart');
  }

    onAddToCartHover(event: Event, isHover: boolean): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      if (isHover) {
        target.style.transform = 'translateY(-2px)';
        target.style.boxShadow = '0 4px 16px rgba(5,150,105,0.4)';
      } else {
        target.style.transform = 'translateY(0)';
        target.style.boxShadow = '0 2px 8px rgba(5,150,105,0.3)';
      }
    }
  }

}
