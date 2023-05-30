import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
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
  _totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPrice: Observable<number> = this._totalPrice.asObservable();

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
  cartItems: any[] = [];

  constructor(private http: HttpClient) {}

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
    this.cartItems.push(product);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    product.isCart = true;
    product.count!++;
    const i = this._products.value.findIndex((p) => p.id === product.id);
    if (i > -1) {
      this.productsState[i] = product;
    }
  }

  addToFavourite(product: Product): void {
    product.isFav = true;
    const i = this.productsState.findIndex((p) => p.id === product.id);
    if (i > -1) {
      this.productsState[i] = product;
    }
  }

  deleteFromCart(product: Product): void {
    this._products.next(
      this.productsState.map((p) => {
        if (p.id === product.id) {
          p.isCart = false;
        }
        return p;
      })
    );
  }

  deleteFromFavourite(product: Product): void {
    this._products.next(
      this.productsState.map((p) => {
        if (p.id === product.id) {
          p.isFav = false;
        }
        return p;
      })
    );
  }

  incrementProduct(product: Product): void {
    this._products.next(
      this.productsState.map((p) => {
        if (p.id === product.id) {
          p.count!++;
        }
        return p;
      })
    );
  }

  decrementProduct(product: Product): void {
    this._products.next(
      this.productsState.map((p) => {
        if (p.id === product.id) {
          p.count!--;
        }
        return p;
      })
    );
  }
}
