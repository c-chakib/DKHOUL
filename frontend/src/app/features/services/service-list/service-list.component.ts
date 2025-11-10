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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
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
    MatPaginatorModule,
    MatButtonToggleModule
  ],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss'
})
export class ServiceListComponent implements OnInit {
  services: any[] = [];
  filteredServices: any[] = [];
  loading = false;
  
  // View Mode - Figma Feature
  viewMode: 'grid' | 'list' = 'grid';
  
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

  loadServices(): void {
    this.loading = true;
    
    // Request all services by setting a high limit
    const filters = { limit: 100, page: 1 };
    
    this.serviceService.getServices(filters).subscribe({
      next: (response: any) => {
        console.log('📊 API Response:', response);
        // Extract services from the correct path: response.data.services
        const servicesData = response.data?.services || response.services || response;
        this.services = Array.isArray(servicesData) ? servicesData : [];
        this.totalServices = response.data?.pagination?.total || this.services.length;
        console.log('✅ Loaded services:', this.services.length);
        
        // Fix image URLs - replace broken placeholders with default image
        this.services = this.services.map(service => ({
          ...service,
          photos: (service.photos && service.photos.length > 0) 
            ? service.photos.map((photo: string) => {
                // Fix broken placeholder URLs
                if (!photo || photo.includes('800x600/?morocco') || photo.includes('placeholder.com')) {
                  return 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&h=600&fit=crop'; // Morocco default
                }
                return photo;
              })
            : ['https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&h=600&fit=crop']
        }));
        
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading services:', error);
        this.services = []; // Initialize as empty array on error
        this.filteredServices = [];
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    // Safety check
    if (!Array.isArray(this.services)) {
      this.services = [];
    }
    
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

  onViewModeChange(): void {
    // Save to localStorage for persistence
    localStorage.setItem('serviceViewMode', this.viewMode);
    console.log('View mode changed to:', this.viewMode);
  }

  ngOnInit(): void {
    // Load saved view mode from localStorage
    const savedViewMode = localStorage.getItem('serviceViewMode') as 'grid' | 'list';
    if (savedViewMode) {
      this.viewMode = savedViewMode;
    }
    this.loadServices();
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
