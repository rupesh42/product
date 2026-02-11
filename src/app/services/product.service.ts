import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, count, finalize, map, Observable, of, retry } from 'rxjs';
import { Product, ProductsResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiURI = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  private errorSubject = new BehaviorSubject<string | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  error$ = this.errorSubject.asObservable();

  loading$ = this.loadingSubject.asObservable();

  getProducts(): Observable<Product[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    return this.http.get<ProductsResponse>(this.apiURI).pipe(
      map((response) => response.products),
      catchError((eer) => {
        this.errorSubject.next('Issue in loading data');
        return of([]);
      }),
      finalize(() => this.loadingSubject.next(false)),
    );
  }

  findProduct(id: number): Observable<Product | null> {
    this.loadingSubject.next(true);

    this.errorSubject.next(null);

    return this.http.get<Product>(`${this.apiURI}/${id}`).pipe(
      retry({ count: 2 }),
      catchError((eer) => {
        this.errorSubject.next('Issue in loading data');
        return of(null);
      }),
      finalize(() => this.loadingSubject.next(false)),
    );
  }
}
