import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class MessageService {

  private apiUrl = environment.apiUrl + '/messages';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  sendMessage(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, { headers: this.getHeaders() });
  }

  getConversations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/conversations`, { headers: this.getHeaders() });
  }

  getThread(userId: string, productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/thread/${userId}/${productId}`, { headers: this.getHeaders() });
  }

  markAsRead(userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/read/${userId}`, {}, { headers: this.getHeaders() });
  }

  getUnreadCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/unread`, { headers: this.getHeaders() });
  }
}