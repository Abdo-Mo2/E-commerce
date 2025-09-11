import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail-page.html',
  imports: [CommonModule],
  standalone: true
})
export class ProductDetailPageComponent implements OnInit {
  product: any = null;
  productId: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Product ID:', this.productId);
    
    if (this.productId) {
      this.loading = true;
      this.http.get(`https://ecommerce.routemisr.com/api/v1/products/${this.productId}`)
        .subscribe({
          next: (res: any) => {
            this.product = res.data;
            this.loading = false;
            console.log('Product loaded:', this.product);
          },
          error: (error) => {
            this.error = 'Failed to load product details';
            this.loading = false;
            console.error('Error loading product:', error);
          }
        });
    } else {
      this.error = 'No product ID provided';
      this.loading = false;
    }
  }
}