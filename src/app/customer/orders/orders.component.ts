import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/order.service';
import { MatDialog } from '@angular/material/dialog';
import { RatingComponent } from '../../rating/rating.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];

  constructor(
  private orderService: OrderService,
  private dialog: MatDialog
) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
  this.orderService.getMyOrders().subscribe({
    next: (data: any) => {

      data.forEach((o: any) => {
        console.log(
          o._id,
          o.status,
          o.courier
        );
      });

      this.orders = data;
    },

    error: (err: any) => console.error(err)
  });
}

cancelOrder(id: string): void {

  if (!confirm('Are you sure you want to cancel this order?')) {
    return;
  }

  this.orderService.cancelMyOrder(id).subscribe({

    next: () => {
      alert('Order cancelled successfully!');
      this.loadOrders(); // Refresh the list
    },

    error: (err) => {
      alert(err.error.message || 'Unable to cancel order.');
    }

  });

}

orderReceived(order: any): void {

  if (!confirm('Confirm that you have received your order?')) {
    return;
  }

  this.orderService.orderReceived(order._id).subscribe({

    next: () => {

      this.loadOrders();

      this.dialog.open(RatingComponent, {

        width: '500px',
        disableClose: true,

        data: {
          order: order
        }

      });

    },

    error: err => {

      alert(err.error.message || 'Unable to complete order.');

    }

  });

}

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Confirmed': return 'status-confirmed';
      case 'Shipped': return 'status-shipped';
      case 'Completed': return 'status-delivered';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusStep(status: string): number {
    switch (status) {
      case 'Pending': return 1;
      case 'Confirmed': return 2;
      case 'Shipped': return 3;
      case 'Completed': return 4;
      case 'Cancelled': return 0;
      default: return 0;
    }
  }
}