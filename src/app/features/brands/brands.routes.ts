import { Routes } from '@angular/router';
import { BrandsPageComponent } from './pages/brands-page/brands-page';
import { BrandProductsPageComponent } from './pages/brand-products-page/brand-products-page';
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page';
export const BRANDS_ROUTES: Routes = [
  {
    path: '',
    component: BrandsPageComponent,
    title: 'Brands'
  },
  {
    path: 'product/:id',
    component: ProductDetailPageComponent,
    title: 'Product Details'
  },
  {
    path: ':id/:name',
    component: BrandProductsPageComponent,
    title: 'Brand Products'
  }
];