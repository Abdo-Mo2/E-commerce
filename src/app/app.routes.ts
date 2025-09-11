import { Routes } from '@angular/router';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { NotFoundComponent } from './features/static-pages/not-found/not-found';
import { authGuard } from './core/guards/auth.guard';
import { PaymentPageComponent } from './features/payment/payment-page.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    title: 'Auth',
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
        title: 'Home',
        canActivate: [authGuard],
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./features/cart/cart.routes').then((m) => m.CART_ROUTES),
        title: 'Cart',
        canActivate: [authGuard],
      },
      {
        path: 'payment',
        component: PaymentPageComponent,
        title: 'Payment',
        canActivate: [authGuard],
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.routes').then(
            (m) => m.PRODUCTS_ROUTES
          ),
        title: 'Products',
        canActivate: [authGuard],
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./features/categories/categories.routes').then(
            (m) => m.CATEGORIES_ROUTES
          ),
        title: 'Categories',
        canActivate: [authGuard],
      },
      {
        path: 'brands',
        loadChildren: () =>
          import('./features/brands/brands.routes').then(
            (m) => m.BRANDS_ROUTES
          ),
        title: 'Brands',
        canActivate: [authGuard],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.routes').then(
            (m) => m.SETTINGS_ROUTES
          ),
        title: 'Settings',
        canActivate: [authGuard],
      },
      {
        path: 'allorders',
        redirectTo: 'orders'
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./features/orders/orders.routes').then(
            (m) => m.ORDERS_ROUTES
          ),
        title: 'Orders',
        canActivate: [authGuard],
      },
      {
        path: 'wishlist',
        loadChildren: () =>
          import('./features/wishlist/wishlist.routes').then(
            (m) => m.WISHLIST_ROUTES
          ),
        title: 'Wishlist',
        canActivate: [authGuard],
      },
    ],
  },

  { path: '**', component: NotFoundComponent },
];
