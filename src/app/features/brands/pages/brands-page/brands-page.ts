import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- Add this import
import { BrandsService } from '../../services/brands.service';

@Component({
  selector: 'app-brands-page',
  templateUrl: './brands-page.html',
  imports: [CommonModule, RouterModule], // <-- Add RouterModule here
  standalone: true
})
export class BrandsPageComponent implements OnInit {
  brands: any[] = [];
  selectedBrand: any = null;
  products: any[] = [];

  constructor(private brandsService: BrandsService) {}

  ngOnInit() {
    this.brandsService.getBrands().subscribe(res => {
      this.brands = res.data;
    });
  }
}