import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class StoreService {

  private apiUrl = environment.apiUrl + '/store';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  createStore(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, { headers: this.getHeaders() });
  }

  getMyStore(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-store`, { headers: this.getHeaders() });
  }

  getMyProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`, { headers: this.getHeaders() });
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product, { headers: this.getHeaders() });
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, product, { headers: this.getHeaders() });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`, { headers: this.getHeaders() });
  }
  getCategories(): Observable<any>{
    return this.http.get(environment.apiUrl + '/categories')
  }
}