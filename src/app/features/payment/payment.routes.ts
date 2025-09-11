import { Routes } from '@angular/router';
import { PaymentPageComponent } from './payment-page.component';

export const PAYMENT_ROUTES: Routes = [
  { path: '', component: PaymentPageComponent, title: 'Payment' }
];
