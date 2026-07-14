import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { CartService } from '../cart.service';
import { OrderService } from 'src/app/order/order.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartListComponent implements OnInit {

  selectedStore: any = null;
  selectedStoreItems: any[] = [];

  cartItems: Product[] = [];
  groupedCart: any [] = [];

  totalPrice: number = 0;
  showAddressForm = false;
  deliveryAddress = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
  this.cartService.getCartItems().subscribe(data => {

    this.cartItems = data;

    const groups: any = {};

    data.forEach((item: any) => {

      const storeId = item.store._id;

      if (!groups[storeId]) {
        groups[storeId] = {
          store: item.store,
          items: [],
          total: 0
        };
      }

      groups[storeId].items.push(item);
      groups[storeId].total += item.price;
    });

    this.groupedCart = Object.values(groups);

    this.totalPrice = this.getTotalPrice();
  });
}
  getTotalPrice(): number {
    let total = 0;
    for (let item of this.cartItems) {
      total += item.price;
    }
    return total;
  }

  clearCart(): void {

  this.cartService.clearCart().subscribe({
    next: () => {

      this.cartItems = [];
      this.groupedCart = [];
      this.totalPrice = 0;
    },
    error: (err) => {
      alert(err.error?.message || 'Unable to clear cart.');
    }
  });

}

  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    this.showAddressForm = true;
  }
  checkoutStore(store: any): void {
    this.selectedStore = store;
    this.showAddressForm = true;
}

  confirmCheckout(): void {
    if (!this.deliveryAddress.trim()) {
      alert('Please enter your delivery address!');
      return;
    }
  

  this.orderService.checkout(this.deliveryAddress,this.selectedStore.store._id).subscribe({
      next: () => {
        this.loadCart();
        this.showAddressForm = false;
        this.deliveryAddress = '';
        alert('Order placed successfully! Thank you for shopping at LazShopee!');
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        alert(err.error.message || 'Checkout failed. Please try again.');
      }
    });
  }

  cancelCheckout(): void {
    this.showAddressForm = false;
    this.deliveryAddress = '';
  }
}