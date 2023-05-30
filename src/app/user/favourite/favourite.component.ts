import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/interfaces/interfaces';
import { ProductService } from '../shared/services/product.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss'],
})
export class FavouriteComponent implements OnInit {
  favouriteProducts: Observable<Product[]> = this.productServ.products.pipe(
    map((products) => products.filter((p) => p.isFav))
  );
  constructor(private productServ: ProductService) {}

  ngOnInit(): void {}

  /*  deleteAllFromFavourite(): void {
    this.favouriteProducts.pipe(
      map((value) => {
        value.map((p) => {
          if (p.isFav) {
            p.isFav = false;
          }
        });
      })
    );
  }*/
}
