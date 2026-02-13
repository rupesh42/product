import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-product',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './search-product.html',
  styleUrl: './search-product.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchProduct {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder); // Reactive Forms builder

  loading = this.productService.loading;
  error = this.productService.error;
  searchQuery$ = new BehaviorSubject<string>('');
  searchQuery: string = '';
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  selectedProduct: Product | null = null;
  currentPage = signal(0); // Pehla Signal
  pageSize = 5;

  productForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(1)]],
  });

  products$ = combineLatest([this.searchQuery$, this.refreshTrigger$]).pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap(([name, _]) => {
      if (!name.trim()) return of([]);
      return this.productService.searchByName(name).pipe(catchError(() => of([])));
    }),
    shareReplay(1),
  );

  onInputChange(): void {
    if (this.searchQuery.trim().length >= 3) {
      this.searchByName();
    } else if (this.searchQuery.trim().length == 0) {
      this.searchQuery$.next('');
    }
  }

  searchByName(): void {
    if (this.searchQuery.trim()) {
      this.searchQuery$.next(this.searchQuery);
    }
  }

  openEdit(product: Product) {
    this.selectedProduct = product;
    this.productForm.patchValue(product); // Master patchValue logic
  }

  onUpdate() {
    if (this.loading()) return;
    if (this.productForm.invalid || !this.selectedProduct) return;
    const id = this.selectedProduct.id;
    const updates = this.productForm.value as Partial<Product>;

    this.productService.updateProduct(id, updates).subscribe((res) => {
      if (res) {
        alert('Update success!');
        this.selectedProduct = null;
        this.refreshTrigger$.next();
      }
    });
  }

  onDelete(product: Product) {
    // 1. Safety Check: User se poocho "Pakka?"
    if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
      // 2. Call Service
      this.productService.deleteProduct(product.id).subscribe((isDeleted) => {
        if (isDeleted) {
          alert('Product Deleted!');

          // 3. Refresh the List (Senior Trick: Re-trigger search)
          // Agar local filtering karte toh code complex hota,
          // searchByName() call karna sabse clean hai.
          this.refreshTrigger$.next();
        }
      });
    }
  }
}
