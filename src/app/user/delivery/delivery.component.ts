import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../shared/services/product.service';
import { OrderService } from '../../shared/services/order.service';
import { NotifierService } from '../../shared/services/notifier.service';
import { Product } from '../../shared/interfaces/interfaces';
import { Router } from '@angular/router';
import { OrderStatus } from '../../shared/enums/enums';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
})
export class DeliveryComponent implements OnInit {
  form!: FormGroup;
  submitted: boolean = false;
  totalPrice: number = this.productServ.totalPrice;
  cartItems!: Product[];

  constructor(
    private productServ: ProductService,
    private orderServ: OrderService,
    private notifierService: NotifierService,
    private router: Router,
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2
  ) {}

  ngOnInit(): void {
    this.cartItems = this.productServ.getCartItems();
    this.addMapApiToElement().onload = () => {
      this.addMapInitToElement();
    };
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
      ]),
      address: new FormControl(null, [Validators.required]),
      payment: new FormControl(null, Validators.required),
    });
  }

  addMapApiToElement(): HTMLScriptElement {
    const script = this.renderer2.createElement('script');
    script.src =
      'https://api-maps.yandex.ru/2.1/?apikey=d9372196-27a2-4ae5-a99b-d4cc91c95fd5&lang=ru_RU';
    this.renderer2.appendChild(this.document.body, script);
    return script;
  }

  addMapInitToElement(): void {
    const initScript = this.renderer2.createElement('script');
    initScript.type = 'text/javascript';
    initScript.text = `
      ymaps.ready(init);
      function init() {
      var suggestView1 = new ymaps.SuggestView('address');
      }
      `;
    this.renderer2.appendChild(this.document.body, initScript);
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
      email: this.form.value.email,
      phone: this.form.value.phone,
      address: address.value,
      products: this.cartItems,
      payment: this.form.value.payment,
      price: this.productServ.totalPrice,
      date: new Date(),
      status: OrderStatus.inProcessing,
    };
    this.orderServ.create(order).subscribe(() => {
      this.orderServ.sendEmailOrderNumber(
        order.orderNumber,
        order.email,
        order.price
      );
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
