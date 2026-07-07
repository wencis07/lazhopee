import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { CartService } from 'src/app/cart/cart.service';
import { Product } from 'src/app/models/product';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.allProducts = data;
      this.products = data;
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
    this.cartService.addToCart(product).subscribe(() => {
      alert(`${product.name} added to cart!`);
    });
  }

  messageStore(product: any): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to message the store owner!');
      this.router.navigate(['/login']);
      return;
    }
    this.selectedProduct = product;
  }

  closeMessageDialog(): void {
    this.selectedProduct = null;
  }
}