import { Component, OnInit, inject } from '@angular/core';
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
export class LandingComponent implements OnInit {
  searchQuery = '';
  animatedTagline = '';
  private taglinePhrases = [
    'avec les Marocains',
    'avec des hôtes locaux',
    'pour des expériences authentiques',
    'pour des souvenirs inoubliables'
  ];
  private taglineIndex = 0;
  // Animated counters targets
  heroStats = [
    { label: 'Hosts actifs', end: 500, value: 0 },
    { label: 'DH projeté en 2030', end: 100, value: 0, suffix: 'M+' }
  ];
  private observer?: IntersectionObserver;
  router = inject(Router);

  ngOnInit(): void {
    this.initRevealObserver();
    this.animateCounters();
    this.startTaglineAnimation();
  }

  private startTaglineAnimation(): void {
    this.animatedTagline = this.taglinePhrases[0];
    setInterval(() => {
      this.taglineIndex = (this.taglineIndex + 1) % this.taglinePhrases.length;
      this.animatedTagline = this.taglinePhrases[this.taglineIndex];
    }, 2200);
  }

  navigateToMarketplace(): void {
  // Removed debug log
    this.router.navigate(['/home']);
  }

  navigateToInvestor(): void {
    this.router.navigate(['/investor']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
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

  private animateCounters(): void {
    const duration = 1200; // ms
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      this.heroStats.forEach(stat => {
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        stat.value = Math.floor(stat.end * eased);
      });
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  private initRevealObserver(): void {
    if (typeof IntersectionObserver === 'undefined') return;
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in');
          this.observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    // Defer querying DOM elements to next tick so template is rendered
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => this.observer?.observe(el));
    }, 0);
  }
}
