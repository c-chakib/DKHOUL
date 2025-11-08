import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface SeoConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  keywords?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private defaultConfig: SeoConfig = {
    title: 'DKHOUL - Discover Authentic Moroccan Experiences',
    description: 'Connect with local hosts in Morocco. Find unique spaces, learn traditional skills, and experience authentic Moroccan culture.',
    image: 'https://dkhoul.ma/assets/og-image.jpg',
    url: 'https://dkhoul.ma',
    keywords: 'Morocco tourism, Moroccan experiences, local hosts, authentic travel, Marrakech, Casablanca',
    type: 'website'
  };

  constructor(
    private meta: Meta,
    private titleService: Title
  ) { }

  updateMetaTags(config?: Partial<SeoConfig>): void {
    const seoConfig = { ...this.defaultConfig, ...config };

    // Update title
    this.titleService.setTitle(seoConfig.title);

    // Update meta tags
    this.meta.updateTag({ name: 'description', content: seoConfig.description });
    this.meta.updateTag({ name: 'keywords', content: seoConfig.keywords || '' });

    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: seoConfig.title });
    this.meta.updateTag({ property: 'og:description', content: seoConfig.description });
    this.meta.updateTag({ property: 'og:image', content: seoConfig.image || this.defaultConfig.image || '' });
    this.meta.updateTag({ property: 'og:url', content: seoConfig.url || this.defaultConfig.url || '' });
    this.meta.updateTag({ property: 'og:type', content: seoConfig.type || 'website' });

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: seoConfig.title });
    this.meta.updateTag({ name: 'twitter:description', content: seoConfig.description });
    this.meta.updateTag({ name: 'twitter:image', content: seoConfig.image || this.defaultConfig.image || '' });
  }

  updateServiceSeo(service: any): void {
    this.updateMetaTags({
      title: `${service.title} - DKHOUL`,
      description: service.description.substring(0, 155),
      image: service.images[0],
      url: `https://dkhoul.ma/services/${service._id}`,
      type: 'product'
    });
  }

  resetToDefaults(): void {
    this.updateMetaTags(this.defaultConfig);
  }
}

