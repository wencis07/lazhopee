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

  cartItems: Product[] = [];
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
    if (confirm('Are you sure you want to clear the cart?')) {
      this.cartService.clearCart().subscribe(() => {
        this.cartItems = [];
        this.totalPrice = 0;
        alert('Cart cleared!');
      });
    }
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    // 👇 Show address form instead of immediately checking out
    this.showAddressForm = true;
  }

  confirmCheckout(): void {
    if (!this.deliveryAddress.trim()) {
      alert('Please enter your delivery address!');
      return;
    }

    this.orderService.checkout(this.deliveryAddress).subscribe({
      next: () => {
        this.cartItems = [];
        this.totalPrice = 0;
        this.showAddressForm = false;
        this.deliveryAddress = '';
        alert('Order placed successfully! Thank you for shopping at LazShopee!');
        this.router.navigate(['/orders']); // 👈 redirect to orders page
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