import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrdersService, OrderSummary } from '../../../../core/services/orders.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders-list.html'
})
export class OrdersListPage {
  private readonly orders = inject(OrdersService);
  private readonly router = inject(Router);
  list: OrderSummary[] = this.orders.getOrders();

  view(order: OrderSummary): void {
    this.orders.setCurrentById(order.id);
    this.router.navigate(['/orders/delivery']);
  }
}


