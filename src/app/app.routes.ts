import { Routes } from '@angular/router';
import { ProductList } from './pages/product-list/product-list';
import { FindProduct } from './pages/find-product/find-product';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'product-list',
  },
  {
    path: 'product-list',
    component: ProductList,
  },
  {
    path: 'find-product',
    component: FindProduct,
  },
];
