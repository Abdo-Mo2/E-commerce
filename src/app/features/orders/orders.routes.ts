import { Routes } from '@angular/router';
import { OrderDeliveryPage } from './pages/order-delivery/order-delivery';
import { OrdersListPage } from './pages/orders-list/orders-list';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    component: OrdersListPage,
    title: 'Orders'
  },
  {
    path: 'delivery',
    component: OrderDeliveryPage,
    title: 'Order Delivery'
  }
];


