import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/services/product.service';
import { Product } from '../shared/interfaces/interfaces';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NotifierService } from '../shared/services/notifier.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit {
  cartProducts: Observable<Product[]> = this.productServ.products.pipe(
    map((products) => products.filter((p) => p.isCart))
  );
  totalPrice: Observable<number> = this.productServ.totalPrice;
  storedCartItems!: any | Product[];

  readonly MAX_COUNT = 10;
  readonly MIN_COUNT = 1;

  constructor(
    private productServ: ProductService,
    private notifierService: NotifierService
  ) {
    this.totalPrice = this.cartProducts.pipe(
      map((cart) =>
        cart.reduce(
          (total, product) => total + +product.price * product.count!,
          0
        )
      )
    );
  }
  ngOnInit(): void {
    this.storedCartItems = localStorage.getItem('cartItems');
    if (this.storedCartItems) {
      this.productServ.cartItems = JSON.parse(this.storedCartItems);
    }
  }

  submit() {
    this.productServ.totalPrice = this.totalPrice;
  }

  deleteFromCart(product: Product): void {
    this.productServ.deleteFromCart(product);
    product.count = 0;
  }

  incrementProduct(product: Product): void {
    if (product.count! === this.MAX_COUNT) {
      this.notifierService.showNotification(
        'Максимальное количество достигнуто',
        'ОК'
      );
      return;
    }
    this.productServ.incrementProduct(product);
  }

  decrementProduct(product: Product): void {
    if (product.count! === this.MIN_COUNT) {
      this.notifierService.showNotification(
        'Количество менее одного не допустимо',
        'ОК'
      );
      return;
    }
    this.productServ.decrementProduct(product);
  }
}
