import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { CartService } from 'src/app/cart/cart.service';
import { Product } from 'src/app/models/product';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import * as ProductActions from 'src/app/store/products/product.actions';
import * as ProductSelectors from 'src/app/store/products/product.selectors';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  allProducts: Product[] = [];
  categories: any[] = [];
  selectedCategory: string = 'all';
  selectedProduct: any = null; // 👈 for message dialog

 constructor(
  private productService: ProductService,
  private cartService: CartService,
  private router: Router,
  private store: Store
) {}

  ngOnInit(): void {
    this.store.dispatch(ProductActions.loadProducts());
    this.store.select(ProductSelectors.selectProducts)
    .subscribe(products => {
    this.products = products;
    this.allProducts = products;
});

    this.productService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'all') {
      this.products = this.allProducts;
    } else {
      this.products = this.allProducts.filter(p => (p as any).category === category);
    }
  }

  addToCart(product: Product): void {

  console.log(JSON.stringify(product, null, 2));

  this.cartService.addToCart(product).subscribe({
    next: () => {
      alert(`${product.name} added to cart!`);
    },
    error: err => {
      console.log('Backend error:');
      console.log(err.error);
      console.log(err);
    }
  });
}
  messageStore(product: any): void {

  console.log('========== MESSAGE BUTTON CLICKED ==========');
  console.log(product);

  const token = localStorage.getItem('token');

  if (!token) {
    alert('Please login to message the store owner!');
    this.router.navigate(['/login']);
    return;
  }

  this.selectedProduct = product;

  console.log('Selected Product:', this.selectedProduct);
}

  closeMessageDialog(): void {
    this.selectedProduct = null;
  }
  viewStore(product: any): void {

  console.log('VIEW STORE CLICKED');
  console.log(product);

  if (!product.store || !product.store._id) {
    alert('Store not found.');
    return;
  }
  console.log('Navigating to:', product.store._id);
  this.router.navigate(['/store', product.store._id]);

}
}