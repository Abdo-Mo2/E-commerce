import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environments';

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
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories-page.html',
  // styleUrl intentionally omitted; using Tailwind utility classes
})
export class CategoriesPage implements OnInit {
  private readonly http = inject(HttpClient);

  categories: Category[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    console.log('Starting to load categories...');
    this.loading = true;
    console.log('API URL:', `${environment.apiUrl}/categories`);
    
    this.http.get<{ data: Category[] }>(`${environment.apiUrl}/categories`).subscribe({
      next: (res) => {
        console.log('API Response:', res);
        this.categories = res.data || [];
        console.log('Categories loaded:', this.categories);
        console.log('Categories length:', this.categories.length);
        this.loading = false;
        console.log('Loading set to false');
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.categories = [];
        this.loading = false;
        console.log('Loading set to false due to error');
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }

  getProductCount(categoryId: string): number {
    // For now, return a placeholder count since we're not loading products here
    return 0;
  }
}
