import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environments';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { CartService } from '../../../../core/services/cart.service';
interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface Product {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  ratingsAverage: number;
  category: string;
}

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-detail.html',
  // styleUrl intentionally omitted; using Tailwind utility classes
})
export class CategoryDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
    private readonly cart = inject(CartService);
  protected readonly wishlist = inject(WishlistService);

  category: Category | null = null;
  products: Product[] = [];
  loading = false;
  categoryId: string = '';

  // Pagination state
  page = 1;
  limit = 12;
  total = 0;
  toastr: any;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.categoryId = id;
        this.page = 1; // reset when category changes
        this.loadCategory();
        this.loadProducts();
      }
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.limit));
  }

  loadCategory(): void {
    this.loading = true;
    this.http.get<{ data: Category }>(`${environment.apiUrl}/categories/${this.categoryId}`).subscribe({
      next: (res) => {
        this.category = res.data;
        console.log('Category loaded:', this.category);
      },
      error: (err) => {
        console.error('Error loading category:', err);
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.http.get<{ data: Product[]; results: number }>(`${environment.apiUrl}/products`, {
      params: { category: this.categoryId, limit: this.limit, page: this.page }
    }).subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.total = res.results || this.products.length;
        console.log(`Products for category ${this.categoryId} (page ${this.page}):`, this.products);
        this.loading = false;
      },
      error: (err) => {
        console.error(`Error loading products for category ${this.categoryId}:`, err);
        this.products = [];
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page += 1;
      this.loadProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page -= 1;
      this.loadProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.page) {
      this.page = page;
      this.loadProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.totalPages, this.page + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  toggleWishlist(productId: string): void {
    this.wishlist.toggle(productId);
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist.has(productId);
  }

  goBack(): void {
    this.router.navigate(['/categories']);
  }

    addToCart(product: any): void {
    this.cart.addItem({
      productId: product._id,
      title: product.title,
      image: product.imageCover,
      price: product.price,
      quantity: 1,
    });
    this.toastr.success('Added to cart');
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
