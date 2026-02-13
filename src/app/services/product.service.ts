import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, of, retry } from 'rxjs';
import { Product, ProductsResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiURI = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  error = signal<string | null>(null);

  loading = signal<boolean>(false);

  getProducts(): Observable<Product[]> {
    this.error.set(null);
    this.loading.set(false);
    return this.http.get<ProductsResponse>(this.apiURI).pipe(
      map((response) => response.products),
      catchError((eer) => {
        this.error.set('Issue in loading data');
        return of([]);
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  findProduct(id: number): Observable<Product | null> {
    this.loading.set(true);

    this.error.set(null);

    return this.http.get<Product>(`${this.apiURI}/${id}`).pipe(
      retry({ count: 2, delay: 1000 }),
      catchError((eer) => {
        this.error.set('Issue in loading data');
        return of(null);
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  searchByName(name: string): Observable<Product[]> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<{ products: Product[] }>(`${this.apiURI}/search?q=${name}`).pipe(
      retry({ count: 2, delay: 1000 }),
      map((response) => response.products),
      catchError((err) => {
        this.error.set('Issue in loading data');
        return of([]);
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  updateProduct(id: number, productData: Partial<Product>): Observable<Product | null> {
    this.loading.set(true); // Wahi purana logic
    this.error.set(null);

    return this.http.put<Product>(`${this.apiURI}/${id}`, productData).pipe(
      retry({ count: 1, delay: 1000 }),
      catchError((err) => {
        this.error.set('Issue in updating data'); // Uniform error message
        return of(null);
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  deleteProduct(id: number): Observable<boolean> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete(`${this.apiURI}/${id}`).pipe(
      map(() => true), // Agar delete ho gaya toh return TRUE
      catchError((err) => {
        this.error.set('Delete failed');
        return of(false); // Agar fail hua toh return FALSE
      }),
      finalize(() => this.loading.set(false)),
    );
  }
}
