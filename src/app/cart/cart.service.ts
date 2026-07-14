import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiCartUrl = environment.apiUrl + '/cart';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  addToCart(product: Product): Observable<Product> {

  const cartItem = {
    product: product._id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    store: product.store?._id
  };

  console.log('Sending:', cartItem);

  return this.http.post<Product>(
    this.apiCartUrl,
    cartItem,
    { headers: this.getHeaders() }
  );
}

  getCartItems(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiCartUrl, { headers: this.getHeaders() });
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.apiCartUrl, { headers: this.getHeaders() });
  }

  checkout(products: Product[]): Observable<void> {
    return this.http.post<void>(this.apiCartUrl + '/checkout', products, { headers: this.getHeaders() });
  }
}