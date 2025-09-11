import { Routes } from '@angular/router';
export const PRODUCTS_ROUTES: Routes =[

    {
     path: '',
     loadComponent:()=> import('./pages/products-home/products-home').then(m => m.ProductsHome)
    },
    {
     path: ':id',
     loadComponent:()=> import('./pages/product-detail/product-detail').then(m => m.ProductDetail)
    },
   

]