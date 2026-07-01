import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { CartService } from 'src/app/cart/cart.service';
import { Product } from 'src/app/models/product';

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

  constructor(
    private productService: ProductService,
    private cartService: CartService
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
}