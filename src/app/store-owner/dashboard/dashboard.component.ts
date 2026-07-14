import { Component, OnInit } from '@angular/core';
import { StoreService } from '../store.service';
import { OrderService } from 'src/app/order/order.service';
import { RatingService } from 'src/app/rating/rating.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  activeTab: 'products' | 'orders' | 'reviews' = 'products';
  orderTab: 'active' | 'completed' = 'active';
  
  store: any = null;
  products: any[] = [];
  categories: any[] = [];
  orders: any[] = [];
  pendingOrders: any[] = [];
  ratings: any[] = [];
  

get activeOrders() {
  console.log(this.orders);
  return this.orders.filter(order => order.status !== 'Completed');
}

get completedOrders() {
  return this.orders.filter(order => order.status === 'Completed');
}

  storeName = '';
  storeAddress = '';
  storeLatitude = 13.1391;
  storeLongitude = 123.7438;
  showProductForm = false;
  editingProduct: any = null;
  productName = '';
  productPrice: number = 0;
  productImageUrl = '';
  productCategory = '';

  constructor(
    private storeService: StoreService,
    private orderService: OrderService,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    this.loadStore();
    this.loadCategories();
  }

 switchTab(tab: 'products' | 'orders' | 'reviews'): void {

  console.log('Tab clicked:', tab);

  this.activeTab = tab;

  if (tab === 'orders') {
    this.loadOrders();
  }

  if (tab === 'reviews') {
    this.loadRatings();
  }

}


  loadStore(): void {
    this.storeService.getMyStore().subscribe({
      next: (data: any) => {
        this.store = data;
        this.storeName = data.name;
        this.storeAddress = data.address;
        this.storeLatitude = data.latitude;
        this.storeLongitude = data.longitude;

        if (this.store) {
          this.loadProducts();
        }
      },
      error: () => { this.store = null; }
    });
  }

  loadProducts(): void {
    this.storeService.getMyProducts().subscribe((data: any) => {
      this.products = data;
    });
  }

  loadCategories(): void {
    this.storeService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

  loadOrders(): void {
    this.orderService.getStoreOrders().subscribe({
      next: (data: any) => 
      { console.log(data),
        this.orders = data;
      },
      error: (err: any) => console.error(err)
    });
  }

  confirmOrder(id: string): void {
    this.orderService.confirmOrder(id).subscribe({
      next: () => {
        alert('Order confirmed!');
        this.loadOrders();
      },
      error: (err: any) => alert(err.error.message || 'Failed to confirm order')
    });
  }

  cancelOrder(id: string): void {
    if (confirm('Cancel this order?')) {
      this.orderService.cancelOrder(id).subscribe({
        next: () => {
          alert('Order cancelled!');
          this.loadOrders();
        },
        error: (err: any) => alert(err.error.message || 'Failed to cancel order')
      });
    }
  }

  createStore(): void {
    if (!this.storeName.trim()) {
      alert('Please enter a store name');
      return;
    }
    this.storeService.createStore
    ({
    name: this.storeName,
    address: this.storeAddress,
    latitude: this.storeLatitude,
    longitude: this.storeLongitude
    }).subscribe({
      next: () => {
        alert('Store created! Waiting for admin approval.');
        this.loadStore();
      },
      error: (err: any) => alert(err.error.message || 'Error creating store')
    });
  }

  openAddProduct(): void {
    this.editingProduct = null;
    this.productName = '';
    this.productPrice = 0;
    this.productImageUrl = '';
    this.productCategory = '';
    this.showProductForm = true;
  }

  openEditProduct(product: any): void {
    this.editingProduct = product;
    this.productName = product.name;
    this.productPrice = product.price;
    this.productImageUrl = product.imageUrl;
    this.productCategory = product.category;
    this.showProductForm = true;
  }

  saveProduct(): void {
    if (!this.productName.trim()) { alert('Please enter a product name!'); return; }
    if (!this.productPrice || this.productPrice <= 0) { alert('Please enter a valid price!'); return; }
    if (!this.productImageUrl.trim()) { alert('Please enter an image URL or filename!'); return; }
    if (!this.productCategory) { alert('Please select a category!'); return; }

    const data = {
      name: this.productName,
      price: this.productPrice,
      imageUrl: this.productImageUrl,
      category: this.productCategory
    };

    if (this.editingProduct) {
      this.storeService.updateProduct(this.editingProduct._id, data).subscribe(() => {
        this.loadProducts();
        this.showProductForm = false;
      });
    } else {
      this.storeService.addProduct(data).subscribe({
        next: () => {
          this.loadProducts();
          this.showProductForm = false;
        },
        error: (err: any) => alert(err.error.message || 'Error adding product')
      });
    }
  }

  deleteProduct(id: string): void {
    if (confirm('Delete this product?')) {
      this.storeService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  cancelForm(): void {
    this.showProductForm = false;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Confirmed': return 'status-confirmed';
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }
 
 loadRatings(): void {

  console.log('Loading store ratings...');

  this.ratingService.getStoreRatings().subscribe({

    next: (data: any) => {

      console.log('Ratings received:', data);

      this.ratings = data;

    },

    error: (err) => {

      console.error('Rating error:', err);

    }

  });

}
}