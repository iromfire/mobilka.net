import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/interfaces/interfaces';
import { NotifierService } from '../../shared/services/notifier.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit {
  cartItems: Product[] = [];
  totalPrice!: number;

  readonly MAX_COUNT = 5;
  readonly MIN_COUNT = 1;

  constructor(
    private productServ: ProductService,
    private notifierService: NotifierService
  ) {
    this.cartItems = this.productServ.getCartItems();
    this.getTotal();
  }

  getTotal() {
    let total = 0;
    for (let product of this.cartItems) {
      // @ts-ignore
      total += product.count! * product.price!;
    }
    this.totalPrice = total;
  }

  ngOnInit(): void {}

  submit() {
    this.productServ.totalPrice = this.totalPrice;
  }

  deleteFromCart(product: Product): void {
    this.productServ.deleteFromCart(product);
    this.getTotal();
    product.count = 0;
  }

  clearCart() {
    this.productServ.clearCart();
    this.cartItems = this.productServ.cartItems;
  }

  incrementProduct(product: Product): void {
    if (product.count! === product.quantityStock) {
      this.notifierService.showNotification('На складе больше нет', 'ОК');
      return;
    }
    if (product.count! === this.MAX_COUNT) {
      this.notifierService.showNotification(
        'Максимальное количество на одного клиента достигнуто',
        'ОК'
      );
      return;
    }
    this.productServ.incrementProduct(product);
    this.getTotal();
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
    this.getTotal();
  }
}
