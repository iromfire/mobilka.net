import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import {
  FbProductsResponse,
  FbResponse,
  Product,
} from '../interfaces/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly _products: BehaviorSubject<Product[]> = new BehaviorSubject<
    Product[]
  >([]);
  public get productsState(): Product[] {
    return this._products.value;
  }
  public products: Observable<Product[]> = this._products.asObservable();
  private _isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public isLoaded: Observable<boolean> = this._isLoaded.asObservable();
  cartItems: Product[] = [];
  totalPrice: number = 0;
  favouriteItems: Product[] = [];

  constructor(private http: HttpClient) {
    const itemsCart = localStorage.getItem('cartItems');
    if (itemsCart) {
      this.cartItems = JSON.parse(itemsCart);
    }
    const itemsFavourite = localStorage.getItem('favouriteItems');
    if (itemsFavourite) {
      this.favouriteItems = JSON.parse(itemsFavourite);
    }
  }

  create(product: Product) {
    return this.http
      .post<FbResponse>(`${environment.fbDbUrl}/products.json`, product)
      .pipe(
        map((res) => {
          return {
            ...product,
            id: res.name,
            date: new Date(product.date),
          };
        })
      );
  }

  getAll(): void {
    this._isLoaded.next(false);
    this.http
      .get<FbProductsResponse>(`${environment.fbDbUrl}/products.json`)
      .pipe(
        map((res) => {
          return Object.keys(res).map(
            (key) =>
              ({
                ...res[key],
                id: key,
                date: new Date(res[key].date),
              } as Product)
          );
        })
      )
      .subscribe((products) => {
        this._products.next(
          products.map((p) => {
            const findable = this.productsState.find((p2) => p2.id === p.id);
            if (!findable) {
              p.isFav = false;
              p.isCart = false;
              p.count = 0;
            } else {
              p.isFav = findable.isFav;
              p.isCart = findable.isCart;
              p.count = findable.count;
            }
            return p;
          })
        );
        if (this._products.value.length) this._isLoaded.next(true);
      });
  }

  getById(id: string | number): Observable<Product> {
    return this.http
      .get<Product>(`${environment.fbDbUrl}/products/${id}.json`)
      .pipe(
        map((res) => {
          return {
            ...res,
            id,
            date: new Date(res.date),
          };
        })
      );
  }

  remove(id: string | number) {
    this.http
      .delete<Product>(`${environment.fbDbUrl}/products/${id}.json`)
      .subscribe(() => {
        this.getAll();
      });
  }

  update(product: Product) {
    return this.http.patch<Product>(
      `${environment.fbDbUrl}/products/${product.id}.json`,
      product
    );
  }

  addToCart(product: Product): void {
    let item = this.cartItems.find((item) => item.id === product.id);
    if (item) {
      if (item.count! >= 10) {
        return;
      }
      item.count!++;
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    } else {
      this.cartItems.push({ ...product, count: 1 });
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }
  }

  deleteFromCart(product: Product): void {
    product.count = 0;
    const index = this.cartItems.indexOf(product);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }
  }

  getCartItems() {
    return this.cartItems;
  }

  clearCart() {
    this.cartItems = [];
    localStorage.removeItem('cartItems');
  }

  incrementProduct(product: Product): void {
    let item = this.cartItems.find((item) => item.id === product.id);
    if (item) {
      item.count!++;
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }
  }

  decrementProduct(product: Product): void {
    let item = this.cartItems.find((item) => item.id === product.id);
    if (item && item.count! > 1) {
      item.count!--;
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }
  }

  addToFavourite(product: Product): void {
    let item = this.favouriteItems.find((item) => item.id === product.id);
    if (!item) {
      product.isFav = true;
      this.favouriteItems.push(product);
      localStorage.setItem(
        'favouriteItems',
        JSON.stringify(this.favouriteItems)
      );
    }
  }

  deleteFromFavourite(product: Product): void {
    product.isFav = false;
    const index = this.favouriteItems.indexOf(product);
    if (index > -1) {
      this.favouriteItems.splice(index, 1);
      localStorage.setItem(
        'favouriteItems',
        JSON.stringify(this.favouriteItems)
      );
    }
  }

  getFavouriteItems() {
    return this.favouriteItems;
  }

  clearFavourite() {
    this.favouriteItems = [];
    localStorage.removeItem('favouriteItems');
  }
}
