import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  productName!: string;

  products = this.productServ.products.pipe(
    map((products) => products.filter((p) => p.quantityStock! > 0))
  );

  isLoaded: Observable<boolean> = this.productServ.isLoaded;
  favouriteItems: Product[] = [];
  constructor(private productServ: ProductService) {}

  ngOnInit(): void {
    this.productServ.getAll();
    this.favouriteItems = this.productServ.getFavouriteItems();
  }
}
