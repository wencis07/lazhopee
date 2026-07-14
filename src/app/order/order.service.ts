import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private apiUrl = environment.apiUrl + '/orders';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // Customer
  checkout(address: string, storeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`,{address,storeId},{headers: this.getHeaders()});
}

  getMyOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-orders`, { headers: this.getHeaders() });
  }

  orderReceived(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/received`,{},{ headers: this.getHeaders() });
}

  // Store Owner
  getStoreOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/store-orders`, { headers: this.getHeaders() });
  }

  getPendingOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pending`, { headers: this.getHeaders() });
  }

  confirmOrder(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/confirm`, {}, { headers: this.getHeaders() });
  }

  cancelOrder(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/cancel`, {}, { headers: this.getHeaders() });
  }
  cancelMyOrder(id: string) 
  {return this.http.patch( `${this.apiUrl}/${id}/customer-cancel`,{}, {headers: this.getHeaders() });
}

  // Courier
  getAvailableOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/available`, { headers: this.getHeaders() });
  }

  pickupOrder(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/pickup`, {}, { headers: this.getHeaders() });
  }

  deliverOrder(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/deliver`, {}, { headers: this.getHeaders() });
  }

  getMyDeliveries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-deliveries`, { headers: this.getHeaders() });
  }
}