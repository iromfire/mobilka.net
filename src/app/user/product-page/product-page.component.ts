import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/interfaces/interfaces';
import { ProductService } from '../../shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NotifierService } from '../../shared/services/notifier.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent implements OnInit {
  product$!: Observable<Product>;

  constructor(
    private productServ: ProductService,
    private route: ActivatedRoute,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.product$ = this.route.params.pipe(
      switchMap((params) => {
        return this.productServ.products.pipe(
          map(
            (products) => products.find((product) => product.id === params.id)!
          )
        );
      })
    );
    this.product$.subscribe((product) => console.log(product));
  }

  addToCart(product: Product): void {
    this.productServ.addToCart(product);
    this.notifierService.showNotification(
      `${product.title} добавлен в корзину`,
      'OK'
    );
  }
}
