import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../shared/interfaces/interfaces';
import { ProductService } from '../../shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NotifierService } from '../../shared/services/notifier.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent implements OnInit, OnDestroy {
  // product$!: Observable<Product>;
  sub!: Subscription;
  product!: Product;

  constructor(
    private productServ: ProductService,
    private route: ActivatedRoute,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params
      .pipe(
        switchMap((params) => {
          return this.productServ.getById(params['id']);
        })
      )
      .subscribe((product: Product) => {
        this.product = product;
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addToCart(product: Product): void {
    this.productServ.addToCart(product);
    this.notifierService.showNotification(
      `${product.title} добавлен в корзину`,
      'OK'
    );
  }

  addToFavourite(product: Product): void {
    this.productServ.addToFavourite(product);
    this.notifierService.showNotification(
      `${product.title} добавлен в избранное`,
      'OK'
    );
  }
}
