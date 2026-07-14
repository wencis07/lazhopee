import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../store-owner/store.service';
import * as L from 'leaflet';
import { Location } from '@angular/common';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png'
});

@Component({
  selector: 'app-store-profile',
  templateUrl: './store-profile.component.html',
  styleUrls: ['./store-profile.component.css']
})
export class StoreProfileComponent implements OnInit {

  store: any;
  owner: any;
  products: any[] = [];

  averageRating = 0;
  totalReviews = 0;

  private map!: L.Map;

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private location: Location
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.storeService.getStoreProfile(id).subscribe((data: any) => {
        this.store = data.store;
        this.owner = data.owner;
        this.products = data.products;
        this.averageRating = data.averageRating;
        this.totalReviews = data.totalReviews;

        setTimeout(() => {
        this.loadMap();
        }, 100);
      });
    }

  }
  private loadMap(): void {

  if (!this.store) return;

  this.map = L.map('storeMap').setView(
    [this.store.latitude, this.store.longitude],15
  );

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors'
    }
  ).addTo(this.map);

  L.marker([
    this.store.latitude,
    this.store.longitude
  ])
  .addTo(this.map)
  .bindPopup(this.store.name)
  .openPopup();
}
goBack(): void {
  this.location.back();
}

}