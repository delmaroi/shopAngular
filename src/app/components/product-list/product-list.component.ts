import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import {
  DxDataGridModule,
  DxTextBoxModule,
  DxSelectBoxModule,
  DxButtonModule,
  DxLoadIndicatorModule,
} from 'devextreme-angular';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxButtonModule,
    DxLoadIndicatorModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading: boolean = true;
  searchQuery: string = '';
  selectedCategory: string = '';
  sortBy: string = '';
  categories: string[] = ['Sport', 'Kuchnia', 'IT'];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.searchQuery = params['search'] || '';
      this.selectedCategory = params['category'] || '';
      this.sortBy = params['sortBy'] || '';

      this.fetchProducts();
    });
  }

  fetchProducts() {
    this.productService
      .getProducts(this.searchQuery, this.selectedCategory, this.sortBy)
      .subscribe(
        (data) => {
          this.products = data;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading products:', error);
          this.isLoading = false;
        }
      );
  }

  onSearchChange(search: string) {
    this.updateQueryParams({ search });
  }

  onCategoryChange(category: string) {
    this.updateQueryParams({ category });
  }

  onSortChange(sortBy: string) {
    this.updateQueryParams({ sortBy });
  }

  updateQueryParams(params: Partial<Params>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.sortBy = '';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: 'merge',
    });

    this.fetchProducts(); // ✅ Fetch data without filters
  }

  onRowClick(event: any) {
    const productId = event.data.id;
    this.router.navigate(['/product', productId]);
  }

  customActionTemplate = (cellElement: any, cellInfo: any) => {
    const button = document.createElement('a');
    button.textContent = 'Details';
    button.classList.add('dx-button', 'dx-button-success');
    button.href = `/product/${cellInfo.data.id}`;
    cellElement.appendChild(button);
  };
}
