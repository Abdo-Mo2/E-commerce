import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-products-home',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './products-home.html',
  styleUrl: './products-home.css'
})
export class ProductsHome implements OnInit {
  private readonly ps = inject(ProductsService);
  private readonly fb = inject(FormBuilder);
    private readonly cart = inject(CartService);
  private readonly spinner = inject(SpinnerService);
  protected readonly wishlist = inject(WishlistService);

  products: any[] = [];
  total = 0;

  // Pagination state
  page = 1;
  limit = 12;

  filters: FormGroup = this.fb.group({
    q: [''],
    category: [''],
    brand: [''],
    priceMin: [''],
    priceMax: [''],
    sort: ['name'] // name | nameDesc | price | priceDesc
  });

  categories: any[] = [];
  brands: any[] = [];
  toastr: any;
product: any;

  ngOnInit(): void {
    this.fetchMeta();
    this.load();
    this.filters.valueChanges.subscribe(() => {
      this.page = 1; // reset page when filters change
      this.load();
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.limit));
  }

  fetchMeta(): void {
    this.ps.categories().subscribe(r => this.categories = r.data || []);
    this.ps.brands().subscribe(r => this.brands = r.data || []);
  }

  load(): void {
    this.spinner.showProducts(); // only one spinner now

    const { q, category, brand, priceMin, priceMax, sort } = this.filters.value as any;
    const params: any = { limit: this.limit, page: this.page };
    if (q) params.keyword = q;
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (priceMin) params['price[gte]'] = priceMin;
    if (priceMax) params['price[lte]'] = priceMax;
    if (sort === 'name') params.sort = 'title';
    if (sort === 'nameDesc') params.sort = '-title';
    if (sort === 'price') params.sort = 'price';
    if (sort === 'priceDesc') params.sort = '-price';

    this.ps.list(params).subscribe({
      next: (res) => { 
        this.products = res.data || []; 
        this.total = res.results || this.products.length; 
      },
      complete: () => { 
        this.spinner.hideProducts(); // hide it when done
      }
    });
  }

  toggleWishlist(productId: string): void {
    this.wishlist.toggle(productId);
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist.has(productId);
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page += 1;
      this.load();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page -= 1;
      this.load();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.page) {
      this.page = page;
      this.load();
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

  addToCart(product: any): void {
    this.cart.addItem({
      productId: product._id,
      title: product.title,
      image: product.imageCover,
      price: product.price,
      quantity: 1
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
