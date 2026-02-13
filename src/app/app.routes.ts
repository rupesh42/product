import { Routes } from '@angular/router';
import { ProductList } from './pages/product-list/product-list';
import { FindProduct } from './pages/find-product/find-product';
import { SearchProduct } from './pages/search-product/search-product';
import { FormsComponent } from './pages/forms-component/forms-component';

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
  {
    path: 'search',
    component: SearchProduct,
  },
  {
    path: 'form',
    component: FormsComponent,
  },
];
