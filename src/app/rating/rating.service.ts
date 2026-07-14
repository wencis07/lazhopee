import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private apiUrl = environment.apiUrl + '/ratings';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  submitRating(data: any): Observable<any> {
    return this.http.post(
      this.apiUrl,
      data,
      {
        headers: this.getHeaders()
      }
    );
  }
  getStoreRatings() {
  return this.http.get(
    `${environment.apiUrl}/ratings/store`,
    { headers: this.getHeaders() }
  );
}
  getCourierRatings() {
  return this.http.get(
    `${environment.apiUrl}/ratings/courier`,
    { headers: this.getHeaders() }
  );
}

}