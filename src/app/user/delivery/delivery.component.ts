import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../shared/services/product.service';
import { OrderService } from '../shared/services/order.service';
import { NotifierService } from '../shared/services/notifier.service';
import { Product } from '../shared/interfaces/interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OrderStatus } from '../shared/enums/enums';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
})
export class DeliveryComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  totalPrice: Observable<number> = this.productServ.totalPrice;
  cartProducts: Observable<Product[]> = this.productServ.products.pipe(
    map((products) => products.filter((p) => p.isCart))
  );

  constructor(
    private productServ: ProductService,
    private orderServ: OrderService,
    private notifierService: NotifierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      phone: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
      ]),
      address: new FormControl(null, Validators.required),
      payment: new FormControl('Наличные'),
    });
  }

  generateUniqueId() {
    const date = new Date();
    const dateNow =
      date.getDate().toString() +
      '0' +
      (date.getMonth() + 1).toString() +
      date.getFullYear().toString();
    const randomInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    const timeNow = date.getHours().toString() + date.getMinutes().toString();
    return dateNow + '-' + timeNow + '-' + randomInt(100, 999);
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;
    const sub = this.totalPrice.subscribe((price) => {
      const order = {
        orderNumber: this.generateUniqueId(),
        name: this.form.value.name,
        phone: this.form.value.phone,
        address: this.form.value.adress,
        orders: this.productServ.productsState.filter((p) => p.isCart),
        payment: this.form.value.payment,
        price,
        date: new Date(),
        status: OrderStatus.inProcessing,
      };
      this.orderServ.create(order).subscribe(() => {
        this.router.navigateByUrl('/delivery/order', { state: order }).then();
      });
      sub.unsubscribe();
    });
  }
}
