import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { NotifierService } from '../../shared/services/notifier.service';

@Component({
  selector: 'app-check-status',
  templateUrl: './check-status.component.html',
  styleUrls: ['./check-status.component.scss'],
})
export class CheckStatusComponent {
  formGroup: FormGroup;
  checkSubmit: boolean = false;
  id: string = '';
  status!: any;

  constructor(
    private db: AngularFireDatabase,
    private notifierService: NotifierService
  ) {
    this.formGroup = new FormGroup({
      orderNumber: new FormControl(''),
    });
  }

  showNotification(): void {
    this.notifierService.showNotification(
      'К сожалению ваш заказ не найден',
      'OK'
    );
  }

  check(): void {
    this.checkSubmit = true;
    const orderNumber = this.formGroup.get('orderNumber')!.value;
    this.db
      .list('orders', (ref: any) =>
        ref.orderByChild('orderNumber').equalTo(orderNumber)
      )
      .valueChanges()
      .subscribe((orders: any[]) => {
        if (orders.length > 0) {
          const orderId = Object.keys(orders[0])[9];
          this.status = orders[0][orderId];
        } else {
          this.showNotification();
          this.status = '';
        }
      });
  }
}
