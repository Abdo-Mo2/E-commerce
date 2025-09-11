import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environments';
import { CartService } from '../../../../core/services/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user-home-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-home-page.html',
  styleUrl: './user-home-page.css'
})
export class UserHomePage implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly cart = inject(CartService);
  protected readonly wishlist = inject(WishlistService);
  private readonly toastr = inject(ToastrService);

  products: any[] = [];
  categories: any[] = [];
  currentSlide = 1; // Start at 1 because we have duplicate slides
  categorySlide = 0; // Category carousel slide position
  private slideTimer: any;
  private categoryTimer: any;
  private isDragging = false;
  isDraggingCategory = false;
  private startX = 0;
  private scrollStartLeft = 0;
  private categoryStartX = 0;
  private categoryStartSlide = 0;
  private isAutoSlidePaused = false;
  private isCategoryAutoSlidePaused = false;
  private readonly totalSlides = 4; // Original slides count
p: any;

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchCategories();
    this.startAutoSlide();
    this.startCategoryAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.slideTimer) clearInterval(this.slideTimer);
    if (this.categoryTimer) clearInterval(this.categoryTimer);
  }

  fetchProducts(): void {
    this.http
      .get<{ data: any[] }>(`${environment.apiUrl}/products`)
      .subscribe((res) => {
        this.products = res.data?.slice(0, 12) ?? [];
      });
  }

  fetchCategories(): void {
    this.http
      .get<{ data: any[] }>(`${environment.apiUrl}/categories`)
      .subscribe((res) => {
        this.categories = res.data ?? [];
      });
  }

  next(): void {
    this.currentSlide++;
    if (this.currentSlide >= this.totalSlides + 1) {
      // When we reach the last duplicate slide, instantly jump to the first real slide
      setTimeout(() => {
        this.currentSlide = 1;
      }, 500); // Wait for transition to complete
    }
  }

  prev(): void {
    this.currentSlide--;
    if (this.currentSlide < 0) {
      // When we go before the first slide, instantly jump to the last real slide
      setTimeout(() => {
        this.currentSlide = this.totalSlides;
      }, 500); // Wait for transition to complete
    }
  }

  goToSlide(slideIndex: number): void {
    this.currentSlide = slideIndex + 1; // +1 because we start from index 1
  }

  startAutoSlide(): void {
    this.slideTimer = setInterval(() => {
      if (!this.isAutoSlidePaused) {
        this.next();
      }
    }, 4000);
  }

  pauseAutoSlide(): void {
    this.isAutoSlidePaused = true;
  }

  resumeAutoSlide(): void {
    this.isAutoSlidePaused = false;
  }

  getCurrentSlideIndex(): number {
    // Return the actual slide index for indicators (0-3)
    if (this.currentSlide === 0) return 3; // Last slide
    if (this.currentSlide === this.totalSlides + 1) return 0; // First slide
    return this.currentSlide - 1; // Normal slides
  }

  // Category carousel methods
  nextCategory(): void {
    this.categorySlide++;
    // Reset to beginning when we reach the end (infinite loop)
    if (this.categorySlide >= this.categories.length) {
      setTimeout(() => {
        this.categorySlide = 0;
      }, 500);
    }
  }

  prevCategory(): void {
    this.categorySlide--;
    // Jump to end when we go before the beginning
    if (this.categorySlide < 0) {
      setTimeout(() => {
        this.categorySlide = this.categories.length - 1;
      }, 500);
    }
  }

  startCategoryAutoSlide(): void {
    this.categoryTimer = setInterval(() => {
      if (!this.isCategoryAutoSlidePaused) {
        this.nextCategory();
      }
    }, 4000); // Move every 4 seconds
  }

  pauseCategoryAutoSlide(): void {
    this.isCategoryAutoSlidePaused = true;
  }

  resumeCategoryAutoSlide(): void {
    this.isCategoryAutoSlidePaused = false;
  }

  onCategoryHover(event: Event, isHover: boolean): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      if (isHover) {
        target.style.transform = 'translateY(-8px) scale(1.08)';
        target.style.filter = 'brightness(1.1)';
      } else {
        target.style.transform = 'translateY(0) scale(1)';
        target.style.filter = 'brightness(1)';
      }
    }
  }

  getTripleCategories(): any[] {
    return [...this.categories, ...this.categories, ...this.categories];
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

  onProductHover(event: Event, isHover: boolean): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      if (isHover) {
        target.style.transform = 'translateY(-8px)';
        target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
      } else {
        target.style.transform = 'translateY(0)';
        target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
      }
    }
  }

  onOverlayHover(event: Event, isHover: boolean): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.opacity = isHover ? '1' : '0';
    }
  }

  onButtonHover(event: Event, isHover: boolean): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      // Check if it's a category carousel button or product button
      if (target.style.background.includes('rgba(255,255,255')) {
        // Category carousel button
        target.style.background = isHover ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)';
      } else {
        // Product button
        target.style.background = isHover ? '#15803d' : '#16a34a';
      }
    }
  }

  onWishlistHover(event: Event, isHover: boolean): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      if (isHover) {
        target.style.background = 'white';
        target.style.transform = 'scale(1.1)';
      } else {
        target.style.background = 'rgba(255,255,255,0.9)';
        target.style.transform = 'scale(1)';
      }
    }
  }

  onQuickViewHover(event: Event, isHover: boolean): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.transform = isHover ? 'translateY(-2px)' : 'translateY(0)';
    }
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

    toggleWishlist(productId: string): void {
    if (!productId) return;
    const exists = this.wishlist.has(productId);
    this.wishlist.toggle(productId);
    this.toastr.success(exists ? 'Removed from wishlist' : 'Added to wishlist');
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist.has(productId);
  }
}
