import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  addProduct(product: any) {
    return this.http.post(`${this.apiUrl}/products`, product);
  }

  getCart() {
    return this.http.get<any[]>(`${this.apiUrl}/cart`);
  }

  addToCart(item: any) {
    return this.http.post(`${this.apiUrl}/cart`, item);
  }

  clearCart() {
    return this.http.delete(`${this.apiUrl}/cart`);
  }
}