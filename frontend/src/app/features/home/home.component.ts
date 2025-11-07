import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
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
      examples: ['Stockage sécurisé de bagages', 'Accès wifi + café', 'Garage privé', 'Salon coworking']
    },
    { 
      icon: 'school', 
      name: 'DKHOUL Skills', 
      tagline: 'Vends ton savoir-faire',
      count: 180,
      priceRange: '150-400 DH',
      description: 'Apprentissages authentiques : cuisine marocaine, artisanat, langues, musique traditionnelle',
      subcategories: ['Cours cuisine (200 DH)', 'Darija (150 DH)', 'Artisanat (200 DH)', 'Musique (250 DH)'],
      examples: ['Tajine/Couscous chez l\'habitant', 'Initiation darija conversationnelle', 'Poterie berbère', 'Rythmes gnaoua']
    },
    { 
      icon: 'groups', 
      name: 'DKHOUL Connect', 
      tagline: 'Loue ton temps',
      count: 150,
      priceRange: '50-300 DH',
      description: 'Expériences humaines : accompagnement souk, conseils locaux, transport personnalisé, baby-sitting',
      subcategories: ['Shopping souk (100 DH/h)', 'Conseils locaux (50 DH)', 'Transport aéroport', 'Baby-sitting (80 DH/h)'],
      examples: ['Guide shopping médina', 'Bons plans restos', 'Trajet privé aéroport', 'Garde enfants bilingue']
    }
  ];

  // Featured service subcategories
  featuredCategories = [
    { icon: 'luggage', name: 'Stockage bagages', count: 85, category: 'Space', price: '20-30 DH/bagage', description: 'Garde sécurisée de vos valises' },
    { icon: 'shower', name: 'Douche express', count: 45, category: 'Space', price: '30-50 DH', description: 'Salle de bain + serviette propre' },
    { icon: 'wifi', name: 'Wifi/Coworking maison', count: 120, category: 'Space', price: '50-100 DH/h', description: 'Travaillez dans un salon confortable' },
    { icon: 'restaurant', name: 'Cours cuisine marocaine', count: 95, category: 'Skills', price: '200-400 DH', description: 'Tajine, couscous chez l\'habitant' },
    { icon: 'translate', name: 'Cours de darija', count: 60, category: 'Skills', price: '150-250 DH', description: 'Arabe marocain conversationnel' },
    { icon: 'shopping_bag', name: 'Accompagnement souk', count: 110, category: 'Connect', price: '100-150 DH/h', description: 'Shopping + traduction + conseils' },
    { icon: 'child_care', name: 'Baby-sitting bilingue', count: 55, category: 'Connect', price: '80-120 DH/h', description: 'Garde d\'enfants qualifiée' },
    { icon: 'directions_car', name: 'Transport aéroport', count: 90, category: 'Connect', price: 'Variable', description: 'Trajet privé personnalisé' }
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

  testimonials = [
    {
      name: 'Youssef Alami',
      rating: 5,
      text: 'J\'ai découvert un magnifique riad à Marrakech via Spaces. L\'hôte était incroyable et l\'expérience authentique!',
      avatar: 'YA'
    },
    {
      name: 'Sara Bennani',
      rating: 5,
      text: 'Les cours de cuisine marocaine m\'ont permis d\'apprendre les secrets des tajines. Une expérience inoubliable!',
      avatar: 'SB'
    },
    {
      name: 'Mehdi Tazi',
      rating: 5,
      text: 'La visite guidée de la médina de Fès était exceptionnelle. Notre guide local connaissait tous les secrets.',
      avatar: 'MT'
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

  constructor(private router: Router) {}

  ngOnInit(): void {}

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
