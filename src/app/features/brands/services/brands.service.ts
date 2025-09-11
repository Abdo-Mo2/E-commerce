import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BrandsService {
  private baseUrl = 'https://ecommerce.routemisr.com/api/v1';

  constructor(private http: HttpClient) {}

  getBrands(): Observable<any> {
    return this.http.get(`${this.baseUrl}/brands`);
  }

  getProductsByBrand(brandId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/products?brand=${brandId}`);
  }
  getBrandById(brandId: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/brands/${brandId}`);
}
}