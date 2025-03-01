import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  DxButtonModule,
  DxTextBoxModule,
  DxLoadIndicatorModule,
} from 'devextreme-angular';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    DxButtonModule,
    DxTextBoxModule,
    DxLoadIndicatorModule,
    RouterModule,
  ],
  templateUrl: './product-details.component.html',
  // styleUrls: ['./product-details.component.scss'],
  styles: [
    `
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100px;
        font-size: 16px;
      }
    `,
  ],
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProduct(productId).subscribe(
      (data) => {
        this.product = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading product:', error);
        this.isLoading = false;
      }
    );
  }
}
