import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ServiceService } from '../../../core/services/service.service';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss'
})
export class ServiceListComponent implements OnInit {
  services: any[] = [];
  filteredServices: any[] = [];
  loading = false;
  
  // Filters
  searchQuery = '';
  selectedCategory = '';
  selectedPriceRange = '';
  selectedLanguages: string[] = [];
  minRating = 0;
  
  // Categories
  categories = [
    { value: '', label: 'All Categories' },
    { value: 'Space', label: 'Space (Accommodations)' },
    { value: 'Skills', label: 'Skills (Workshops)' },
    { value: 'Connect', label: 'Connect (Experiences)' }
  ];
  
  // Price ranges
  priceRanges = [
    { value: '', label: 'All Prices' },
    { value: '0-100', label: 'Under 100 MAD' },
    { value: '100-300', label: '100-300 MAD' },
    { value: '300-500', label: '300-500 MAD' },
    { value: '500+', label: '500+ MAD' }
  ];
  
  // Languages
  availableLanguages = ['English', 'French', 'Arabic', 'Spanish', 'German'];
  
  // Pagination
  pageSize = 12;
  pageIndex = 0;
  totalServices = 0;

  constructor(
    private serviceService: ServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    
    this.serviceService.getServices().subscribe({
      next: (response: any) => {
        this.services = response.services || response;
        this.totalServices = this.services.length;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.services];
    
    // Search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.location?.city?.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(service => service.category === this.selectedCategory);
    }
    
    // Price range filter
    if (this.selectedPriceRange) {
      filtered = this.filterByPriceRange(filtered);
    }
    
    // Language filter
    if (this.selectedLanguages.length > 0) {
      filtered = filtered.filter(service =>
        service.languages?.some((lang: string) => this.selectedLanguages.includes(lang))
      );
    }
    
    // Rating filter
    if (this.minRating > 0) {
      filtered = filtered.filter(service => 
        (service.rating?.average || 0) >= this.minRating
      );
    }
    
    this.filteredServices = filtered;
    this.totalServices = filtered.length;
  }

  filterByPriceRange(services: any[]): any[] {
    if (!this.selectedPriceRange) return services;
    
    if (this.selectedPriceRange === '500+') {
      return services.filter(s => s.pricing?.amount >= 500);
    }
    
    const [min, max] = this.selectedPriceRange.split('-').map(Number);
    return services.filter(s => 
      s.pricing?.amount >= min && s.pricing?.amount <= max
    );
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onPriceRangeChange(): void {
    this.applyFilters();
  }

  onLanguageToggle(language: string): void {
    const index = this.selectedLanguages.indexOf(language);
    if (index > -1) {
      this.selectedLanguages.splice(index, 1);
    } else {
      this.selectedLanguages.push(language);
    }
    this.applyFilters();
  }

  onRatingChange(rating: number): void {
    this.minRating = rating;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedPriceRange = '';
    this.selectedLanguages = [];
    this.minRating = 0;
    this.applyFilters();
  }

  getPaginatedServices(): any[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredServices.slice(start, end);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewService(serviceId: string): void {
    this.router.navigate(['/services', serviceId]);
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Space': return 'home';
      case 'Skills': return 'school';
      case 'Connect': return 'explore';
      default: return 'category';
    }
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }
    if (hasHalfStar) {
      stars.push('star_half');
    }
    while (stars.length < 5) {
      stars.push('star_border');
    }
    
    return stars;
  }
}
