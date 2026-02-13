import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-find-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './find-product.html',
  styleUrl: './find-product.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindProduct {
  private productService = inject(ProductService);
  searchInput$ = new BehaviorSubject<string>('');
  productId: any = '';
  loading = this.productService.loading;
  error = this.productService.error;

  product$ = this.searchInput$.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap((id) => {
      if (!id || +id <= 0) return of(null);
      return this.productService.findProduct(Number(id)).pipe(catchError(() => of(null)));
    }),
    shareReplay(1),
  );

  getProductbyId(): void {
    this.onInputChange();
  }

  onInputChange(): void {
    this.searchInput$.next(this.productId);
  }
}
