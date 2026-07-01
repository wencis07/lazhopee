import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {

  private apiUrl = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, { headers: this.getHeaders() });
  }

  activateUser(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}/activate`, {}, { headers: this.getHeaders() });
  }

  deactivateUser(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}/deactivate`, {}, { headers: this.getHeaders() });
  }

  getStores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stores`, { headers: this.getHeaders() });
  }

  approveStore(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/stores/${id}/approve`, {}, { headers: this.getHeaders() });
  }

  activateStore(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/stores/${id}/activate`, {}, { headers: this.getHeaders() });
  }

  deactivateStore(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/stores/${id}/deactivate`, {}, { headers: this.getHeaders() });
  }

  assignCategories(id: string, allowedCategories: string[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/stores/${id}/categories`, { allowedCategories }, { headers: this.getHeaders() });
  }

  getCategories(): Observable<any> {
    return this.http.get(environment.apiUrl + '/categories');
  }

  addCategory(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories`, { name }, { headers: this.getHeaders() });
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`, { headers: this.getHeaders() });
  }
}