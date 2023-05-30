import { OrderStatus } from '../enums/enums';

export interface FbResponse {
  name: string;
}

export interface FbProductsResponse {
  [key: string]: Product;
}

export interface FbOrdersResponse {
  [key: string]: Order;
}

export interface Product {
  id?: string | number;
  date: string | Date;
  info: string;
  price: string;
  title: string;
  type?: string;
  photo: string;
  count?: number;
  isFav?: boolean;
  isCart?: boolean;
}

export interface Order {
  id?: string;
  orders?: Array<Product>;
  name: string;
  phone: string;
  adress: string;
  payment: string;
  price: number;
  date: string | Date;
  status?: OrderStatus;
}
