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
  photo: string;
  count?: number;
  isFav?: boolean;
  isCart?: boolean;
  quantityStock?: number;
}

export interface Order {
  id?: string;
  orderNumber: string;
  products?: Product[];
  name: string;
  email: string;
  phone: string;
  address: string;
  payment: string;
  price: number;
  date: string | Date;
  status?: OrderStatus;
}

export interface User {
  email: string;
  password: string;
  returnSecureToken: boolean;
}
