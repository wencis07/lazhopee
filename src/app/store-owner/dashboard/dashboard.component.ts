import { Component, OnInit } from '@angular/core';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  store: any = null;
  products: any[] = [];
  categories: any[] = [];

  storeName = '';

  showProductForm = false;
  editingProduct: any = null;
  productName = '';
  productPrice: number = 0;
  productImageUrl = '';
  productCategory = '';

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.loadStore();
    this.loadCategories();
  }

  loadStore(): void {
    this.storeService.getMyStore().subscribe({
      next: (data) => {
        this.store = data;
        if (this.store) {
          this.loadProducts();
        }
      },
      error: () => { this.store = null; }
    });
  }

  loadProducts(): void {
    this.storeService.getMyProducts().subscribe(data => {
      this.products = data;
    });
  }

  loadCategories(): void {
    this.storeService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  createStore(): void {
    if (!this.storeName.trim()) {
      alert('Please enter a store name');
      return;
    }
    this.storeService.createStore({ name: this.storeName }).subscribe({
      next: (res) => {
        alert('Store created! Waiting for admin approval.');
        this.loadStore();
      },
      error: (err) => alert(err.error.message || 'Error creating store')
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
      this.storeService.addProduct(data).subscribe(() => {
        this.loadProducts();
        this.showProductForm = false;
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
}