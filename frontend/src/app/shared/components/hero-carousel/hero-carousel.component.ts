import { Component, Input, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.scss']
})
export class HeroCarouselComponent implements AfterViewInit, OnDestroy {
  @Input() images: { src: string; alt: string; title?: string; subtitle?: string }[] = [];
  @ViewChild('splideContainer', { static: true }) splideContainer!: ElementRef;

  private splide: any;

  async ngAfterViewInit() {
    try {
      // Dynamically import Splide
      const Splide = (await import('@splidejs/splide')).default;

      // Initialize Splide
      this.splide = new Splide(this.splideContainer.nativeElement, {
        type: 'fade',
        rewind: true,
        autoplay: true,
        interval: 5000,
        pauseOnHover: true,
        pauseOnFocus: true,
        speed: 800,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        arrows: true,
        pagination: true,
        drag: true,
        keyboard: true,
        wheel: false,
        waitForTransition: true,
        breakpoints: {
          768: {
            arrows: false,
            pagination: true,
          },
          480: {
            arrows: false,
            pagination: true,
          }
        }
      });

      // Mount the carousel
      this.splide.mount();
    } catch (error) {
      console.error('Failed to load Splide:', error);
      // Fallback to basic carousel if Splide fails
    }
  }

  ngOnDestroy() {
    if (this.splide) {
      this.splide.destroy();
    }
  }
}
