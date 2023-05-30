import { Component, Input, OnInit } from '@angular/core';
import { NotifierService } from '../shared/services/notifier.service';
import { Product } from '../shared/interfaces/interfaces';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  @Input() product!: Product;

  constructor(
    private notifierService: NotifierService,
    private productServ: ProductService
  ) {}

  ngOnInit(): void {}

  addToCart(product: Product): void {
    this.productServ.addToCart(product);
    this.notifierService.showNotification(
      `${product.title} добавлен в корзину`,
      'OK'
    );
  }

  addToFavourite(product: Product): void {
    if (product.isFav) {
      return;
    }
    this.productServ.addToFavourite(product);
    this.notifierService.showNotification(
      `${product.title} добавлен в избранное`,
      'OK'
    );
  }

  deleteFromFavourite(product: Product): void {
    if (!product.isFav) {
      return;
    }
    this.productServ.deleteFromFavourite(product);
    this.notifierService.showNotification(
      `${product.title} удален из избранного`,
      'OK'
    );
  }
}
