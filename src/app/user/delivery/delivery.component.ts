import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../shared/services/product.service';
import { OrderService } from '../../shared/services/order.service';
import { NotifierService } from '../../shared/services/notifier.service';
import { Product } from '../../shared/interfaces/interfaces';
import { Router } from '@angular/router';
import { OrderStatus } from '../../shared/enums/enums';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
})
export class DeliveryComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  totalPrice: number = this.productServ.totalPrice;
  cartItems: Product[];

  constructor(
    private productServ: ProductService,
    private orderServ: OrderService,
    private notifierService: NotifierService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2
  ) {
    this.cartItems = this.productServ.getCartItems();
  }

  ngOnInit(): void {
    const textScript = this.renderer2.createElement('script');
    textScript.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp';
    this.renderer2.appendChild(this.document.body, textScript);

    const srcScript = this.renderer2.createElement('script');
    srcScript.type = 'text/javascript';
    srcScript.text = `
    ymaps.ready(init);
    function init() {
    var suggestView1 = new ymaps.SuggestView('address');
    }
    `;
    this.renderer2.appendChild(this.document.body, srcScript);

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      phone: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
      ]),
      address: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
      ]),
      payment: new FormControl(null, Validators.required),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;
    const address = window.document.getElementById(
      'address'
    ) as any as HTMLInputElement;
    const order = {
      orderNumber: this.orderServ.generateUniqueId(),
      name: this.form.value.name,
      phone: this.form.value.phone,
      address: address.value,
      products: this.cartItems,
      payment: this.form.value.payment,
      price: this.productServ.totalPrice,
      date: new Date(),
      status: OrderStatus.inProcessing,
    };
    this.orderServ.create(order).subscribe(() => {
      this.cartItems.forEach((product) => {
        this.productServ
          .updateQuantityStock({
            ...product,
            quantityStock: product.quantityStock! - product.count!,
          })
          .subscribe(() => {
            this.router
              .navigateByUrl('/delivery/order', { state: order })
              .then(() => {
                this.productServ.clearCart();
              });
          });
      });
    });
  }
}
