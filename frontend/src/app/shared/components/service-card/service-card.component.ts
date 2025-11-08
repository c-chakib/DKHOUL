import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {
  @Input() service: any;
  isFavorite = false; // TODO: Connect to favorites service

  constructor(private router: Router) {}

  viewService(): void {
    this.router.navigate(['/services', this.service._id]);
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.isFavorite = !this.isFavorite;
    // TODO: Implement favorites API call
    console.log('Favorite toggled:', this.isFavorite, 'for service:', this.service._id);
  }

  getRatingStars(rating: number): number[] {
    return Array(Math.round(rating || 0)).fill(0);
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'space': '#3f51b5',
      'skills': '#0277bd',
      'connect': '#c2185b'
    };
    return colors[category.toLowerCase()] || '#3f51b5';
  }
}
