import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environments';
import { CartService } from '../../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../../core/services/spinner.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly cart = inject(CartService);
  private readonly toastr = inject(ToastrService);
  private readonly spinner = inject(SpinnerService);

  product: any;
  images: string[] = [];
  currentIndex = 0;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.load(id);
    });
  }

  load(id: string): void {
    this.spinner.showGlobal();

    this.http.get<{ data: any }>(`${environment.apiUrl}/products/${id}`).subscribe({
      next: (res) => {
        this.product = res.data;
        this.images = [res.data.imageCover, ...(res.data.images || [])].filter(Boolean);
        this.currentIndex = 0;
      },
      error: (err) => {
        console.error('Error loading product:', err);
      },
      complete: () => this.spinner.hideGlobal()
    });
  }

  addToCart(): void {
    if (!this.product) return;
    this.cart.addItem({
      productId: this.product._id,
      title: this.product.title,
      image: this.product.imageCover,
      price: this.product.price,
      quantity: 1
    } as any);
    this.toastr.success('Added to cart');
  }

  prev(): void {
    this.navigateRelative(-1);
  }

  next(): void {
    this.navigateRelative(1);
  }

  private navigateRelative(offset: number): void {
    this.spinner.showGlobal();

    this.http.get<{ data: any[] }>(`${environment.apiUrl}/products`, { params: { limit: 40, sort: 'title' } })
      .subscribe({
        next: (res) => {
          const list = res.data || [];
          const idx = list.findIndex(p => p._id === this.product?._id);
          const target = list[idx + offset];
          if (target) this.router.navigate(['../', target._id], { relativeTo: this.route });
        },
        complete: () => this.spinner.hideGlobal()
      });
  }
}
