import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/services/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  productName!: string;
  products = this.productServ.products;
  isLoaded: Observable<boolean> = this.productServ.isLoaded;
  constructor(private productServ: ProductService) {}

  ngOnInit(): void {
    this.productServ.getAll();
  }
}
