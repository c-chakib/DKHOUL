import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'about',
    loadComponent: () => import('./features/static/static-page.component').then(m => m.StaticPageComponent),
    data: {
      title: 'À propos de DKHOUL',
      subtitle: 'Notre mission: connecter voyageurs et locaux pour des expériences authentiques',
      sections: [
        { heading: 'Notre vision', content: 'Faire découvrir le Maroc authentique à travers ses habitants, ses savoir-faire et ses lieux uniques.' },
        { heading: 'Ce que nous proposons', content: '• Spaces: locations d\'espaces uniques\n• Skills: apprentissage avec des locaux\n• Connect: expériences culturelles et sociales' },
        { heading: 'Nos valeurs', content: 'Confiance, hospitalité, excellence du service, respect des cultures et durabilité.' }
      ]
    }
  },
  {
    path: 'help',
    loadComponent: () => import('./features/static/static-page.component').then(m => m.StaticPageComponent),
    data: {
      title: 'Centre d\'aide',
      subtitle: 'Questions fréquentes et support',
      sections: [
        { heading: 'Réservations', content: 'Comment réserver, annuler, ou modifier une réservation.' },
        { heading: 'Paiements', content: 'Paiements sécurisés, remboursements et reçus.' },
        { heading: 'Support', content: 'Besoin d\'aide ? Écrivez-nous: support@dkhoul.ma' }
      ]
    }
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/static/static-page.component').then(m => m.StaticPageComponent),
    data: {
      title: 'Nous contacter',
      subtitle: 'Nous serions ravis d\'échanger',
      sections: [
        { heading: 'Email', content: '<a href="mailto:contact@dkhoul.ma">contact@dkhoul.ma</a>' },
        { heading: 'Téléphone', content: '+212 662 127 709' },
        { heading: 'Adresse', content: 'Casablanca, Maroc' }
      ]
    }
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/static/static-page.component').then(m => m.StaticPageComponent),
    data: {
      title: 'Conditions d\'utilisation',
      sections: [
        { content: 'En utilisant DKHOUL, vous acceptez nos conditions générales. Les hôtes et voyageurs s\'engagent à respecter les lois locales et la charte de la communauté.' }
      ]
    }
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/static/static-page.component').then(m => m.StaticPageComponent),
    data: {
      title: 'Politique de confidentialité',
      sections: [
        { content: 'Nous protégeons vos données et n\'utilisons vos informations que pour fournir nos services conformément aux lois en vigueur.' }
      ]
    }
  },
  {
    path: 'cookies',
    loadComponent: () => import('./features/static/static-page.component').then(m => m.StaticPageComponent),
    data: {
      title: 'Gestion des cookies',
      sections: [
        { content: 'Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez les configurer dans votre navigateur.' }
      ]
    }
  },
  {
    path: 'safety',
    loadComponent: () => import('./features/static/static-page.component').then(m => m.StaticPageComponent),
    data: {
      title: 'Sécurité et confiance',
      sections: [
        { content: 'Vérification des hôtes, paiements sécurisés, messagerie privée et assistance en cas de besoin.' }
      ]
    }
  },
  {
    path: 'blog',
    loadComponent: () => import('./features/static/static-page.component').then(m => m.StaticPageComponent),
    data: {
      title: 'Blog & Actualités',
      sections: [
        { content: 'Bientôt disponible: histoires de voyageurs, nouveautés produit, et conseils pour découvrir le Maroc.' }
      ]
    }
  },
  {
    path: 'sitemap',
    loadComponent: () => import('./features/static/static-page.component').then(m => m.StaticPageComponent),
    data: {
      title: 'Plan du site',
      sections: [
        { content: 'Consultez le <a href="/sitemap.xml" target="_blank" rel="noopener">sitemap.xml</a> pour l\'indexation des pages.' }
      ]
    }
  },
  {
    path: 'reset-password/:token',
    redirectTo: 'auth/reset-password/:token'
  },
  {
    path: 'landing',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'investor',
    loadComponent: () => import('./features/investor/investor.component').then(m => m.InvestorComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'services',
    loadChildren: () => import('./features/services/services.routes').then(m => m.SERVICES_ROUTES)
  },
  {
    path: 'bookings',
    loadChildren: () => import('./features/bookings/bookings.routes').then(m => m.BOOKINGS_ROUTES)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES)
  },
  {
    path: 'messages',
    loadChildren: () => import('./features/messages/messages.routes').then(m => m.MESSAGES_ROUTES)
  },
  {
    path: 'reviews',
    loadChildren: () => import('./features/reviews/reviews.routes').then(m => m.REVIEWS_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
