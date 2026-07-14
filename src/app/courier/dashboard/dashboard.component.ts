import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/order.service';
import { RatingComponent } from 'src/app/rating/rating.component';
import { RatingService } from 'src/app/rating/rating.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  activeTab: 'available' | 'myDeliveries' | 'ratings' = 'available';
  availableOrders: any[] = [];
  myDeliveries: any[] = [];
  ratings: any [] = [];

  constructor(
    private orderService: OrderService, 
    private ratingService: RatingService) {}

  ngOnInit(): void {
    this.loadAvailableOrders();
    this.loadMyDeliveries();
  }

  switchTab(tab: 'available' | 'myDeliveries'| 'ratings'): void {
    this.activeTab = tab;

    if (tab === 'ratings'){
      this.loadRatings();
    }
  }

  loadAvailableOrders(): void {
    this.orderService.getAvailableOrders().subscribe({
      next: (data: any) => this.availableOrders = data,
      error: (err: any) => console.error(err)
    });
  }

  loadMyDeliveries(): void {
    this.orderService.getMyDeliveries().subscribe({
      next: (data: any) => this.myDeliveries = data,
      error: (err: any) => console.error(err)
    });
  }

  pickupOrder(id: string): void {
    if (confirm('Pick up this order for delivery?')) {
      this.orderService.pickupOrder(id).subscribe({
        next: () => {
          this.loadAvailableOrders();
          this.loadMyDeliveries();
          alert('Order picked up! Safe delivery!');
        },
        error: (err: any) => alert(err.error.message || 'Failed to pick up order')
      });
    }
  }

  deliverOrder(id: string): void {
    if (confirm('Mark this order as delivered?')) {
      this.orderService.deliverOrder(id).subscribe({
        next: () => {
          this.loadMyDeliveries();
          alert('Order marked as delivered!');
        },
        error: (err: any) => alert(err.error.message || 'Failed to mark as delivered')
      });
    }
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'Confirmed': return 'status-confirmed';
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      default: return '';
    }
  }
  loadRatings(): void {

  this.ratingService.getStoreRatings().subscribe({

    next: (data: any) => {

      this.ratings = data.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    },

    error: err => console.error(err)

  });

}
}