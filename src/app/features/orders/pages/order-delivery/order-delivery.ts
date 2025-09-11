import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrdersService, OrderSummary } from '../../../../core/services/orders.service';
import { ProductsService } from '../../../products/services/products.service';
import { forkJoin, map } from 'rxjs';

interface OrderItemRow {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  brand?: string;
  category?: string;
}

@Component({
  selector: 'app-order-delivery',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-delivery.html'
})
export class OrderDeliveryPage implements OnInit {
  private readonly orders = inject(OrdersService);
  private readonly products = inject(ProductsService);
  order: OrderSummary | null = this.orders.getCurrentOrder();
  rows: OrderItemRow[] = [];

  ngOnInit(): void {
    this.buildRows();
  }

  private buildRows(): void {
    if (!this.order || !this.order.items.length) { this.rows = []; return; }
    const baseRows: OrderItemRow[] = this.order.items.map(i => ({
      productId: i.productId,
      title: i.title,
      image: i.image,
      price: i.price,
      quantity: i.quantity
    }));

    forkJoin(
      baseRows.map(r => this.products.getById(r.productId).pipe(map(res => ({ row: r, prod: res.data }))))
    ).subscribe(list => {
      this.rows = list.map(({ row, prod }) => ({
        ...row,
        brand: prod?.brand?.name ?? 'N/A',
        category: prod?.category?.name ?? 'N/A'
      }));
    });
  }
}


