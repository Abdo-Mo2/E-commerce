import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);

  list(params: any) {
    return this.http.get<{ data: any[]; results: number }>(`${environment.apiUrl}/products`, { params });
  }

  categories() { return this.http.get<{ data: any[] }>(`${environment.apiUrl}/categories`); }
  brands() { return this.http.get<{ data: any[] }>(`${environment.apiUrl}/brands`); }

  getById(id: string) {
    return this.http.get<{ data: any }>(`${environment.apiUrl}/products/${id}`);
  }
}


