import { Component, OnDestroy, OnInit } from '@angular/core';
import { Order } from '../../shared/interfaces/interfaces';
import { Subscription } from 'rxjs';
import { OrderService } from '../../shared/services/order.service';
import { CheckDialogComponent } from '../../shared/dialogs/check-dialog/check-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OrderStatus } from '../../shared/enums/enums';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
})
export class OrderPageComponent implements OnInit, OnDestroy {
  pSub?: Subscription;
  rSub?: Subscription;

  orderStatuses = Object.values(OrderStatus);

  order!: Order;
  orders: Array<Order> = [];

  selectedStatus!: OrderStatus | string;

  constructor(private orderServ: OrderService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.pSub = this.orderServ.getAll().subscribe((orders) => {
      this.orders = orders;
    });
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }

    if (this.rSub) {
      this.rSub.unsubscribe();
    }
  }

  onSelected(status: string, id: any): void {
    this.selectedStatus = status;
    this.orderServ.updateOrderStatus(id, {
      ...this.order,
      status: this.selectedStatus as OrderStatus,
    });
  }

  remove(id: any): void {
    let dialog = this.dialog.open(CheckDialogComponent);
    dialog.afterClosed().subscribe((result) => {
      if (result == 'Да') {
        this.rSub = this.orderServ.remove(id).subscribe(() => {
          this.orders = this.orders.filter((orders) => orders.id != id);
        });
      }
    });
  }
}
