import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FbOrdersResponse, FbResponse, Order } from '../interfaces/interfaces';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  create(order: Order): Observable<Order> {
    return this.http
      .post<FbResponse>(`${environment.fbDbUrl}/orders.json`, order)
      .pipe(
        map((res) => {
          return {
            ...order,
            id: res.name,
            date: new Date(order.date),
          };
        })
      );
  }

  getAll(): Observable<Order[]> {
    return this.http
      .get<FbOrdersResponse>(`${environment.fbDbUrl}/orders.json`)
      .pipe(
        map((res) => {
          return Object.keys(res).map(
            (key) =>
              ({
                ...res[key],
                id: key,
                date: new Date(res[key].date),
              } as Order)
          );
        })
      );
  }

  remove(id: string | number) {
    return this.http.delete(`${environment.fbDbUrl}/orders/${id}.json`);
  }

  updateOrderStatus(id: string, order: Order) {
    return this.http
      .patch(`${environment.fbDbUrl}/orders/${id}.json`, order)
      .subscribe(() => {});
  }

  generateUniqueId(): string {
    const date = new Date();
    const dateNow =
      date.getDate().toString() +
      (date.getMonth() + 1).toString() +
      date.getFullYear().toString();
    const randomInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    const timeNow = date.getHours().toString() + date.getMinutes().toString();
    return dateNow + '-' + timeNow + '-' + randomInt(100, 999);
  }

  sendEmailOrderNumber(orderNumber: string, email: string, total: number) {
    const templateParams = {
      orderNumber: orderNumber,
      email: email,
      total: total,
    };

    emailjs
      .send(
        'service_8wn8czk',
        'template_ucs0949',
        templateParams,
        'zuaJq-C8-C-Ui4fgj'
      )
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
        },
        (err) => {
          console.log('FAILED...', err);
        }
      );
  }
}
