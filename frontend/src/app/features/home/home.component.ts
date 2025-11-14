import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { StatsCounterComponent } from '../../shared/components/stats-counter/stats-counter.component';
import { TypedTextComponent } from '../../shared/components/typed-text/typed-text.component';
import { MapSectionComponent } from '../../shared/components/map-section/map-section.component';
import { FeaturedService } from '../../shared/components/featured-services-carousel/featured-services-carousel.component';
import { HeroCarouselComponent } from '../../shared/components/hero-carousel/hero-carousel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  HeroCarouselComponent,
  StatsCounterComponent,
  TypedTextComponent
    ,MapSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private scrollListener?: () => void;
  mapLocations = [
    { lat: 33.5731, lng: -7.5898, label: 'Casablanca' },
    { lat: 31.6295, lng: -7.9811, label: 'Marrakech' },
    { lat: 35.7595, lng: -5.8339, label: 'Tanger' },
    { lat: 34.0209, lng: -6.8416, label: 'Rabat' }
  ];
  featuredServices: FeaturedService[] = [
    { name: 'Stockage bagages', badge: 'Host', rating: 4.9, price: '20 DH', image: '/picture/overall/Gemini_Generated_Image_lhrdlmlhrdlmlhrd.png' },
    { name: 'Douche express', badge: 'Host', rating: 4.8, price: '30 DH', image: '/picture/overall/Gemini_Generated_Image_4si8lw4si8lw4si8.png' },
    { name: 'Wifi/Coworking', badge: 'Host', rating: 4.7, price: '50 DH', image: '/picture/overall/Gemini_Generated_Image_xbd1rrxbd1rrxbd1.png' },
    { name: 'Cours cuisine', badge: 'Top Rated', rating: 5.0, price: '200 DH', image: '/picture/overall/Gemini_Generated_Image_ssvgmpssvgmpssvg.png' }
  ];
  currentYear = new Date().getFullYear();
  
  // DKHOUL's 3 Main Categories
  mainCategories = [
    { 
      icon: 'home', 
      name: 'DKHOUL Space', 
      tagline: 'Monétise ton espace',
      count: 250,
      priceRange: '20-150 DH',
      description: 'Micro-services pratiques : stockage bagages, douche express, wifi, stationnement, coworking à domicile',
      subcategories: ['Stockage bagages (20 DH)', 'Douche express (30 DH)', 'Wifi/Coworking (50 DH)', 'Stationnement (50 DH)'],
      examples: ['Stockage sécurisé de bagages', 'Accès wifi + café', 'Garage privé', 'Salon coworking'],
      image: '/picture/overall/Gemini_Generated_Image_lhrdlmlhrdlmlhrd.png'
    },
    { 
      icon: 'school', 
      name: 'DKHOUL Skills', 
      tagline: 'Vends ton savoir-faire',
      count: 180,
      priceRange: '150-400 DH',
      description: 'Apprentissages authentiques : cuisine marocaine, artisanat, langues, musique traditionnelle',
      subcategories: ['Cours cuisine (200 DH)', 'Darija (150 DH)', 'Artisanat (200 DH)', 'Musique (250 DH)'],
      examples: ['Tajine/Couscous chez l\'habitant', 'Initiation darija conversationnelle', 'Poterie berbère', 'Rythmes gnaoua'],
      image: '/picture/overall/Gemini_Generated_Image_ssvgmpssvgmpssvg.png'
    },
    { 
      icon: 'groups', 
      name: 'DKHOUL Connect', 
      tagline: 'Loue ton temps',
      count: 150,
      priceRange: '50-300 DH',
      description: 'Expériences humaines : accompagnement souk, conseils locaux, transport personnalisé, baby-sitting',
      subcategories: ['Shopping souk (100 DH/h)', 'Conseils locaux (50 DH)', 'Transport aéroport', 'Baby-sitting (80 DH/h)'],
      examples: ['Guide shopping médina', 'Bons plans restos', 'Trajet privé aéroport', 'Garde enfants bilingue'],
      image: '/picture/overall/Gemini_Generated_Image_bbfwmdbbfwmdbbfw.png'
    }
  ];

  // Featured service subcategories
  featuredCategories = [
    { icon: 'luggage', name: 'Stockage bagages', count: 85, category: 'Space', price: '20-30 DH/bagage', description: 'Garde sécurisée de vos valises', image: '/picture/overall/Gemini_Generated_Image_lhrdlmlhrdlmlhrd.png' },
    { icon: 'shower', name: 'Douche express', count: 45, category: 'Space', price: '30-50 DH', description: 'Salle de bain + serviette propre', image: '/picture/overall/Gemini_Generated_Image_4si8lw4si8lw4si8.png' },
    { icon: 'wifi', name: 'Wifi/Coworking maison', count: 120, category: 'Space', price: '50-100 DH/h', description: 'Travaillez dans un salon confortable', image: '/picture/overall/Gemini_Generated_Image_xbd1rrxbd1rrxbd1.png' },
    { icon: 'restaurant', name: 'Cours cuisine marocaine', count: 95, category: 'Skills', price: '200-400 DH', description: 'Tajine, couscous chez l\'habitant', image: '/picture/overall/Gemini_Generated_Image_ssvgmpssvgmpssvg.png' },
    { icon: 'translate', name: 'Cours de darija', count: 60, category: 'Skills', price: '150-250 DH', description: 'Arabe marocain conversationnel', image: '/picture/overall/Gemini_Generated_Image_npjqhjnpjqhjnpjq.png' },
    { icon: 'shopping_bag', name: 'Accompagnement souk', count: 110, category: 'Connect', price: '100-150 DH/h', description: 'Shopping + traduction + conseils', image: '/picture/overall/Gemini_Generated_Image_bbfwmdbbfwmdbbfw.png' },
    { icon: 'child_care', name: 'Baby-sitting bilingue', count: 55, category: 'Connect', price: '80-120 DH/h', description: 'Garde d\'enfants qualifiée', image: '/picture/overall/Gemini_Generated_Image_i1bvcoi1bvcoi1bv.png' },
    { icon: 'directions_car', name: 'Transport aéroport', count: 90, category: 'Connect', price: 'Variable', description: 'Trajet privé personnalisé', image: '/picture/overall/Gemini_Generated_Image_9keka9keka9keka9.png' }
  ];

  howItWorks = [
    {
      step: 1,
      icon: 'explore',
      title: 'Découvrez',
      description: 'Explorez Spaces, Skills & Connect - trouvez l\'expérience parfaite'
    },
    {
      step: 2,
      icon: 'calendar_today',
      title: 'Réservez',
      description: 'Réservez facilement et payez en toute sécurité en ligne'
    },
    {
      step: 3,
      icon: 'verified',
      title: 'Vivez',
      description: 'Profitez d\'expériences locales authentiques avec des hôtes vérifiés'
    },
    {
      step: 4,
      icon: 'star',
      title: 'Partagez',
      description: 'Évaluez votre expérience et aidez la communauté'
    }
  ];

  // Testimonials - Figma Inspired
  testimonials = [
    {
      name: 'Sophie Martin',
      country: 'France',
      initials: 'SM',
      rating: 5,
      text: "J'ai stocké mes bagages chez Ahmed pendant 4h. Service impeccable, 20 DH seulement !",
      serviceType: 'Stockage Bagages',
      serviceIcon: 'luggage'
    },
    {
      name: 'John Smith',
      country: 'États-Unis',
      initials: 'JS',
      rating: 5,
      text: "Le cours de cuisine marocaine chez Fatima était incroyable. J'ai appris à faire un tajine authentique pour 200 DH. Expérience unique !",
      serviceType: 'Cours Cuisine',
      serviceIcon: 'restaurant'
    },
    {
      name: 'Maria Garcia',
      country: 'Espagne',
      initials: 'MG',
      rating: 5,
      text: "Youssef m'a accompagnée dans les souks de Marrakech. Meilleurs prix, conseils locaux, 100 DH pour 2h. Un guide parfait !",
      serviceType: 'Guide Souk',
      serviceIcon: 'shopping_bag'
    },
    {
      name: 'Hans Mueller',
      country: 'Allemagne',
      initials: 'HM',
      rating: 5,
      text: "Douche express après une nuit de train. Service rapide et propre, 30 DH. Merci DKHOUL !",
      serviceType: 'Douche Express',
      serviceIcon: 'shower'
    },
    {
      name: 'Sakura Tanaka',
      country: 'Japon',
      initials: 'ST',
      rating: 5,
      text: 'Cours de darija avec Mehdi. En 3 sessions, je peux commander au restaurant et négocier. 150 DH/session, excellent rapport qualité-prix.',
      serviceType: 'Cours Darija',
      serviceIcon: 'translate'
    },
    {
      name: 'Emma Brown',
      country: 'Royaume-Uni',
      initials: 'EB',
      rating: 5,
      text: 'Wifi + espace coworking chez Karim pour 50 DH. Meilleur que les cafés, calme et connexion rapide. Parfait pour nomades digitaux !',
      serviceType: 'Coworking',
      serviceIcon: 'wifi'
    }
  ];

  // Value Proposition
  valueProps = [
    {
      icon: 'savings',
      title: 'Prix 50-70% moins chers',
      description: 'DKHOUL: 50-300 DH vs Airbnb Experiences: 400-1500 DH vs GetYourGuide: 600-2000 DH',
      highlight: true
    },
    {
      icon: 'verified',
      title: '80% des revenus aux hôtes',
      description: 'Commission DKHOUL 20% vs 30% Airbnb vs 70-80% GetYourGuide - Redistribution équitable',
      highlight: true
    },
    {
      icon: 'schedule',
      title: 'Flexibilité totale',
      description: 'Réservation J ou J-1, durée 1-3h vs format rigide demi-journée ailleurs',
      highlight: false
    },
    {
      icon: 'handshake',
      title: 'Micro-services uniques',
      description: 'Seule plateforme avec bagages, wifi, douche - services pratiques introuvables ailleurs',
      highlight: false
    }
  ];

    heroStats = [
      { label: 'Hosts actifs', end: 500 },
      { label: 'DH projeté en 2030', end: 100, suffix: 'M+' }
    ];
    typedTexts = [
      'Monétise ton espace',
      'Vends ton savoir-faire',
      'Loue ton temps'
    ];
    heroImages = [
      '/picture/overall/Gemini_Generated_Image_lhrdlmlhrdlmlhrd.png',
      '/picture/overall/Gemini_Generated_Image_bbfwmdbbfwmdbbfw.png',
      '/picture/overall/Gemini_Generated_Image_i1bvcoi1bvcoi1bv.png',
      '/picture/overall/Gemini_Generated_Image_4si8lw4si8lw4si8.png'
    ];
  // ...existing code...

  router = inject(Router);

  ngOnInit() {
    this.initScrollProgress();
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      this.scrollListener();
    }
  }

  private initScrollProgress() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (!scrollIndicator) return;

    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollIndicator.style.width = scrollPercent + '%';
    };

    // Initial call
    updateScrollProgress();

    // Add scroll listener
    this.scrollListener = () => window.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('scroll', updateScrollProgress);
  }

  navigateToServices(): void {
    this.router.navigate(['/services']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToBecomeProvider(): void {
    this.router.navigate(['/auth/register'], { queryParams: { type: 'provider' } });
  }
}
