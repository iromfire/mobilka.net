import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/interfaces/interfaces';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss'],
})
export class FavouriteComponent implements OnInit {
  favouriteItems: Product[] = [];
  constructor(private productServ: ProductService) {
    this.favouriteItems = this.productServ.getFavouriteItems();
  }

  ngOnInit(): void {}

  clearFavourite() {
    this.productServ.clearFavourite();
    this.favouriteItems = this.productServ.favouriteItems;
  }
}
