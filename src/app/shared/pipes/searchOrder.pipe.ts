import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../interfaces/interfaces';

@Pipe({
  name: 'searchOrder',
})
export class SearchOrderPipe implements PipeTransform {
  transform(orders: Order[], searchValue: string = ''): Order[] {
    if (!searchValue.trim()) {
      return orders;
    }
    return orders.filter((order) => {
      const orderValues: string = Object.values(order).join(' ').toLowerCase();
      return orderValues.includes(searchValue.toLowerCase());
    });
  }
}
