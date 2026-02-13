import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Observable, shareReplay } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);

  product$ = this.productService.getProducts().pipe(shareReplay(1));
  error = this.productService.error;
  isLoading = this.productService.loading;

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.product$ = this.productService.getProducts();
  }
}
