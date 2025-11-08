import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  searchQuery = '';

  constructor(private router: Router) {}

  navigateToDemo(): void {
    this.router.navigate(['/home']);
  }

  navigateToInvestor(): void {
    this.router.navigate(['/investor']);
  }

  scrollToFeatures(): void {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/services'], { queryParams: { search: this.searchQuery.trim() } });
    } else {
      this.router.navigate(['/services']);
    }
  }

  searchByCategory(category: string): void {
    this.router.navigate(['/services'], { queryParams: { category } });
  }
}
