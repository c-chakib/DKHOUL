// DKHOUL Platform - Comprehensive Mock Data
// Production-ready data for marketplace demo

export interface Service {
  id: string;
  title: string;
  category: 'space' | 'skills' | 'connect';
  categoryLabel: string;
  description: string;
  shortDescription: string;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  hostJoinDate: string;
  hostResponseRate: number;
  hostResponseTime: string;
  hostVerified: boolean;
  hostSuperhost: boolean;
  hostLanguages: string[];
  images: string[];
  location: string;
  city: string;
  price: number;
  priceUnit: string;
  rating: number;
  reviewCount: number;
  duration?: string;
  capacity?: number;
  instantBook: boolean;
  featured: boolean;
  whatsIncluded: string[];
  availability: string;
  cancellationPolicy: string;
  tags: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  hostName: string;
  clientName: string;
  clientAvatar?: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'system' | 'booking';
  bookingData?: any;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  lastSeen?: string;
}

// ==================== SERVICES DATA ====================

export const services: Service[] = [
  // ===== DKHOUL SKILLS - Cooking Classes =====
  {
    id: 's001',
    title: 'Cours de Cuisine Tajine Traditionnel avec Marché Local',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Découvrez les secrets de la cuisine marocaine authentique ! Rejoignez-moi pour une expérience culinaire inoubliable où vous apprendrez à préparer un tajine traditionnel de A à Z. Nous commencerons par une visite guidée au marché local pour sélectionner les meilleurs ingrédients frais, puis nous préparerons ensemble un délicieux tajine aux légumes et poulet, accompagné de pain maison et de thé à la menthe traditionnel. Je partagerai avec vous les techniques ancestrales transmises de génération en génération dans ma famille. Vous repartirez avec un livret de recettes et la fierté d\'avoir créé un vrai repas marocain !',
    shortDescription: 'Apprenez à cuisiner un tajine authentique avec visite du marché et dégustation',
    hostId: 'h001',
    hostName: 'Fatima El Amrani',
    hostJoinDate: '2023-02',
    hostResponseRate: 100,
    hostResponseTime: '< 1 heure',
    hostVerified: true,
    hostSuperhost: true,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['moroccan-cooking-tagine', 'moroccan-kitchen', 'moroccan-spices-market'],
    location: 'Médina de Fès',
    city: 'Fès',
    price: 300,
    priceUnit: 'par personne',
    rating: 4.95,
    reviewCount: 127,
    duration: '4 heures',
    capacity: 6,
    instantBook: true,
    featured: true,
    whatsIncluded: [
      'Visite guidée du marché local',
      'Tous les ingrédients et équipements de cuisine',
      'Livret de recettes à emporter',
      'Cérémonie de thé à la menthe traditionnelle',
      'Dégustation du repas préparé ensemble',
      'Photos souvenirs de votre expérience'
    ],
    availability: '6 jours / semaine',
    cancellationPolicy: 'Annulation gratuite 48h avant',
    tags: ['Cuisine', 'Culture', 'Gastronomie', 'Marché', 'Expérience authentique'],
    createdAt: '2023-02-15'
  },
  {
    id: 's002',
    title: 'Atelier Couscous Royal et Pâtisseries Marocaines',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Plongez dans l\'art de la cuisine marocaine avec cet atelier exclusif ! Apprenez à rouler le couscous à la main selon la méthode traditionnelle, puis préparez un couscous royal aux sept légumes. En dessert, nous confectionnerons ensemble des cornes de gazelle et des chebakia. Une expérience gourmande et culturelle unique dans ma maison familiale au cœur de la médina.',
    shortDescription: 'Maîtrisez le couscous royal fait main et les pâtisseries traditionnelles',
    hostId: 'h002',
    hostName: 'Khadija Benani',
    hostJoinDate: '2023-05',
    hostResponseRate: 98,
    hostResponseTime: '< 2 heures',
    hostVerified: true,
    hostSuperhost: true,
    hostLanguages: ['Français', 'Arabe', 'Italien'],
    images: ['moroccan-couscous', 'moroccan-pastries', 'traditional-moroccan-kitchen'],
    location: 'Quartier Habous',
    city: 'Casablanca',
    price: 350,
    priceUnit: 'par personne',
    rating: 4.92,
    reviewCount: 89,
    duration: '5 heures',
    capacity: 5,
    instantBook: true,
    featured: true,
    whatsIncluded: [
      'Apprentissage du roulage du couscous à la main',
      'Tous les ingrédients bio et locaux',
      'Recettes détaillées en français',
      'Dégustation du repas complet',
      'Boîte de pâtisseries à emporter',
      'Tablier DKHOUL en cadeau'
    ],
    availability: 'Jeudi - Dimanche',
    cancellationPolicy: 'Annulation gratuite 72h avant',
    tags: ['Cuisine', 'Couscous', 'Pâtisserie', 'Fait main', 'Traditionnel'],
    createdAt: '2023-05-10'
  },
  {
    id: 's003',
    title: 'Secrets de la Pastilla et du Pain Marocain',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Découvrez comment préparer la fameuse pastilla, ce plat festif marocain aux saveurs sucrées-salées uniques. Nous préparerons également différents types de pains marocains: khobz, msemmen et baghrir. Un cours complet pour impressionner vos invités!',
    shortDescription: 'Préparez la pastilla traditionnelle et apprenez 3 types de pains marocains',
    hostId: 'h003',
    hostName: 'Leila Tazi',
    hostJoinDate: '2023-08',
    hostResponseRate: 95,
    hostResponseTime: '< 3 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Anglais', 'Espagnol'],
    images: ['moroccan-pastilla', 'moroccan-bread-making'],
    location: 'Gueliz',
    city: 'Marrakech',
    price: 280,
    priceUnit: 'par personne',
    rating: 4.88,
    reviewCount: 64,
    duration: '4 heures',
    capacity: 4,
    instantBook: false,
    featured: false,
    whatsIncluded: [
      'Tous les ingrédients premium',
      'Techniques de pliage de la pastilla',
      'Guide des épices marocaines',
      'Recettes illustrées',
      'Dégustation complète',
      'Panier d\'épices artisanales'
    ],
    availability: '5 jours / semaine',
    cancellationPolicy: 'Annulation gratuite 48h avant',
    tags: ['Cuisine', 'Pastilla', 'Pain', 'Festif', 'Gourmet'],
    createdAt: '2023-08-22'
  },
  // ===== DKHOUL SKILLS - Language & Culture =====
  {
    id: 's004',
    title: 'Cours de Darija Marocaine - Niveau Débutant',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Apprenez le darija, le dialecte marocain, dans une ambiance conviviale autour d\'un thé à la menthe. Ce cours interactif vous permettra de maîtriser les expressions essentielles pour votre séjour au Maroc: salutations, négociation au souk, commander au restaurant, et bien plus. Méthode ludique avec jeux de rôle et situations réelles.',
    shortDescription: 'Maîtrisez les bases du darija marocain en 3 sessions interactives',
    hostId: 'h004',
    hostName: 'Youssef Bennani',
    hostJoinDate: '2023-03',
    hostResponseRate: 100,
    hostResponseTime: '< 30 min',
    hostVerified: true,
    hostSuperhost: true,
    hostLanguages: ['Français', 'Arabe', 'Anglais', 'Espagnol'],
    images: ['moroccan-language-lesson', 'moroccan-tea-culture'],
    location: 'Centre-ville',
    city: 'Rabat',
    price: 200,
    priceUnit: 'par session (2h)',
    rating: 4.96,
    reviewCount: 143,
    duration: '2 heures',
    capacity: 8,
    instantBook: true,
    featured: true,
    whatsIncluded: [
      'Manuel de darija illustré',
      'Enregistrements audio pour pratique',
      'Thé et pâtisseries marocaines',
      'Carte de phrases utiles plastifiée',
      'Accès au groupe WhatsApp d\'entraide',
      'Certificat de participation'
    ],
    availability: 'Tous les jours',
    cancellationPolicy: 'Annulation gratuite 24h avant',
    tags: ['Langue', 'Darija', 'Culture', 'Communication', 'Débutant'],
    createdAt: '2023-03-05'
  },
  {
    id: 's005',
    title: 'Calligraphie Arabe et Art de l\'Écriture Traditionnelle',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Initiez-vous à l\'art ancestral de la calligraphie arabe. Dans mon atelier lumineux, vous apprendrez les bases de l\'écriture coufique et naskh. Nous créerons ensemble une œuvre personnalisée que vous emporterez. Matériel professionnel fourni: calames, encres naturelles et papier d\'art.',
    shortDescription: 'Créez votre œuvre en calligraphie arabe avec un maître calligraphe',
    hostId: 'h005',
    hostName: 'Ahmed El Fassi',
    hostJoinDate: '2023-06',
    hostResponseRate: 92,
    hostResponseTime: '< 4 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['arabic-calligraphy', 'calligraphy-workshop'],
    location: 'Médina',
    city: 'Marrakech',
    price: 250,
    priceUnit: 'par personne',
    rating: 4.91,
    reviewCount: 58,
    duration: '3 heures',
    capacity: 6,
    instantBook: false,
    featured: false,
    whatsIncluded: [
      'Tout le matériel de calligraphie',
      'Papier d\'art de qualité',
      'Votre œuvre encadrée',
      'Guide de calligraphie PDF',
      'Kit de calligraphie débutant',
      'Thé et douceurs'
    ],
    availability: 'Mardi - Samedi',
    cancellationPolicy: 'Annulation gratuite 48h avant',
    tags: ['Art', 'Calligraphie', 'Culture', 'Créatif', 'Artisanat'],
    createdAt: '2023-06-18'
  },
  // ===== DKHOUL SKILLS - Arts & Crafts =====
  {
    id: 's006',
    title: 'Atelier Poterie Berbère et Céramique Traditionnelle',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Découvrez l\'art millénaire de la poterie berbère dans mon atelier familial. Apprenez à modeler l\'argile locale, créez votre propre tajine ou assiette décorée avec les motifs traditionnels amazighs. Cuisson comprise, vous pourrez récupérer votre création après 1 semaine (envoi possible).',
    shortDescription: 'Créez votre poterie berbère authentique avec un artisan de 3ème génération',
    hostId: 'h006',
    hostName: 'Moha Amazigh',
    hostJoinDate: '2023-04',
    hostResponseRate: 88,
    hostResponseTime: '< 6 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Amazigh'],
    images: ['moroccan-pottery-workshop', 'traditional-moroccan-ceramics'],
    location: 'Safi',
    city: 'Safi',
    price: 320,
    priceUnit: 'par personne',
    rating: 4.87,
    reviewCount: 72,
    duration: '4 heures',
    capacity: 4,
    instantBook: false,
    featured: true,
    whatsIncluded: [
      'Argile et tous les matériaux',
      'Utilisation du tour de potier',
      'Cuisson de votre création',
      'Décoration aux motifs berbères',
      'Envoi postal disponible',
      'Tablier et photos souvenir'
    ],
    availability: '4 jours / semaine',
    cancellationPolicy: 'Annulation gratuite 72h avant',
    tags: ['Poterie', 'Artisanat', 'Berbère', 'Céramique', 'Fait main'],
    createdAt: '2023-04-12'
  },
  {
    id: 's007',
    title: 'Tissage de Tapis Berbère et Techniques Ancestrales',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Immersion dans le monde du tissage berbère. Apprenez les techniques de tissage sur métier traditionnel, comprenez la symbolique des motifs et créez votre propre petite pièce tissée. Découvrez aussi comment identifier un vrai tapis berbère et éviter les contrefaçons lors de vos achats.',
    shortDescription: 'Tissez votre propre création sur métier berbère traditionnel',
    hostId: 'h007',
    hostName: 'Aicha Ouarzazi',
    hostJoinDate: '2023-07',
    hostResponseRate: 94,
    hostResponseTime: '< 5 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Amazigh', 'Anglais'],
    images: ['moroccan-carpet-weaving', 'berber-textile-workshop'],
    location: 'Atlas',
    city: 'Azilal',
    price: 280,
    priceUnit: 'par personne',
    rating: 4.93,
    reviewCount: 47,
    duration: '5 heures',
    capacity: 3,
    instantBook: false,
    featured: false,
    whatsIncluded: [
      'Laine naturelle teinte à la main',
      'Utilisation du métier à tisser',
      'Votre création tissée',
      'Guide d\'identification des tapis',
      'Thé berbère et repas',
      'Transport depuis Marrakech'
    ],
    availability: 'Sur réservation',
    cancellationPolicy: 'Annulation gratuite 72h avant',
    tags: ['Tissage', 'Tapis', 'Berbère', 'Artisanat', 'Tradition'],
    createdAt: '2023-07-30'
  },
  {
    id: 's008',
    title: 'Zellige: Art de la Mosaïque Marocaine',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Initiez-vous à l\'art du zellige, ces mosaïques géométriques qui ornent les palais marocains. Apprenez à couper les carreaux émaillés, assemblez votre propre motif géométrique et repartez avec un tableau de zellige unique. Un maître artisan vous transmet son savoir-faire séculaire.',
    shortDescription: 'Créez votre mosaïque zellige avec un maître artisan',
    hostId: 'h008',
    hostName: 'Hassan Tazi',
    hostJoinDate: '2023-09',
    hostResponseRate: 96,
    hostResponseTime: '< 2 heures',
    hostVerified: true,
    hostSuperhost: true,
    hostLanguages: ['Français', 'Arabe'],
    images: ['moroccan-zellige-art', 'zellige-workshop'],
    location: 'Médina',
    city: 'Fès',
    price: 340,
    priceUnit: 'par personne',
    rating: 4.94,
    reviewCount: 81,
    duration: '4 heures',
    capacity: 4,
    instantBook: true,
    featured: true,
    whatsIncluded: [
      'Tous les matériaux de zellige',
      'Outils professionnels',
      'Votre tableau de mosaïque encadré',
      'Lunettes et gants de protection',
      'Visite de l\'atelier historique',
      'Certificat d\'apprentissage'
    ],
    availability: '5 jours / semaine',
    cancellationPolicy: 'Annulation gratuite 48h avant',
    tags: ['Zellige', 'Mosaïque', 'Art', 'Géométrie', 'Patrimoine'],
    createdAt: '2023-09-14'
  },
  {
    id: 's009',
    title: 'Maroquinerie: Création de Babouches Personnalisées',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Apprenez l\'art de la maroquinerie marocaine et créez votre propre paire de babouches sur mesure. Choisissez vos cuirs, vos couleurs, et décorez selon vos goûts. Un maroquinier de 4ème génération vous guide dans chaque étape. Vous repartez avec vos babouches uniques!',
    shortDescription: 'Fabriquez vos babouches personnalisées en cuir véritable',
    hostId: 'h009',
    hostName: 'Rachid Serraj',
    hostJoinDate: '2023-10',
    hostResponseRate: 90,
    hostResponseTime: '< 8 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['moroccan-leather-shoes', 'moroccan-leather-workshop'],
    location: 'Souk',
    city: 'Marrakech',
    price: 380,
    priceUnit: 'par personne',
    rating: 4.89,
    reviewCount: 56,
    duration: '5 heures',
    capacity: 3,
    instantBook: false,
    featured: false,
    whatsIncluded: [
      'Cuir de qualité premium',
      'Tous les outils et accessoires',
      'Vos babouches personnalisées',
      'Prise de mesure pour ajustement parfait',
      'Boîte de présentation',
      'Visite du souk des tanneurs'
    ],
    availability: 'Lundi - Vendredi',
    cancellationPolicy: 'Annulation gratuite 48h avant',
    tags: ['Maroquinerie', 'Cuir', 'Babouches', 'Fait main', 'Personnalisé'],
    createdAt: '2023-10-05'
  },
  {
    id: 's010',
    title: 'Atelier Huile d\'Argan: De la Noix au Produit Fini',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Découvrez tous les secrets de l\'huile d\'argan, l\'or liquide du Maroc. Visitez une coopérative féminine, participez au processus de fabrication traditionnel, apprenez à différencier les vraies huiles des fausses. Repartez avec votre propre bouteille d\'huile pressée et des produits cosmétiques.',
    shortDescription: 'Fabrication traditionnelle d\'huile d\'argan en coopérative féminine',
    hostId: 'h010',
    hostName: 'Fatima Amazigh',
    hostJoinDate: '2023-11',
    hostResponseRate: 97,
    hostResponseTime: '< 3 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Amazigh', 'Anglais'],
    images: ['argan-oil-production', 'moroccan-argan-cooperative'],
    location: 'Essaouira',
    city: 'Essaouira',
    price: 220,
    priceUnit: 'par personne',
    rating: 4.92,
    reviewCount: 68,
    duration: '3 heures',
    capacity: 8,
    instantBook: true,
    featured: false,
    whatsIncluded: [
      'Visite complète de la coopérative',
      'Participation au processus',
      'Bouteille d\'huile d\'argan 500ml',
      'Produits cosmétiques artisanaux',
      'Guide d\'utilisation',
      'Thé et amlou fait maison'
    ],
    availability: '6 jours / semaine',
    cancellationPolicy: 'Annulation gratuite 24h avant',
    tags: ['Argan', 'Huile', 'Coopérative', 'Bio', 'Cosmétique'],
    createdAt: '2023-11-20'
  },
  // ===== DKHOUL SKILLS - Music =====
  {
    id: 's011',
    title: 'Initiation au Oud et Musique Andalouse',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Découvrez le oud, cet instrument emblématique de la musique andalouse marocaine. Apprenez les bases du maqam, jouez vos premières mélodies et comprenez l\'histoire fascinante de la musique arabo-andalouse. Instruments fournis, aucune expérience musicale requise.',
    shortDescription: 'Apprenez à jouer du oud avec un musicien professionnel',
    hostId: 'h011',
    hostName: 'Karim Benchekroun',
    hostJoinDate: '2024-01',
    hostResponseRate: 93,
    hostResponseTime: '< 4 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['oud-instrument', 'moroccan-music-lesson'],
    location: 'Médina',
    city: 'Tétouan',
    price: 270,
    priceUnit: 'par session (2h)',
    rating: 4.90,
    reviewCount: 43,
    duration: '2 heures',
    capacity: 4,
    instantBook: false,
    featured: false,
    whatsIncluded: [
      'Utilisation d\'un oud professionnel',
      'Partitions simplifiées',
      'Enregistrement de votre performance',
      'Playlist Spotify de musique andalouse',
      'Thé et pâtisseries',
      '20% réduction achat d\'un oud'
    ],
    availability: 'Mercredi - Dimanche',
    cancellationPolicy: 'Annulation gratuite 48h avant',
    tags: ['Musique', 'Oud', 'Andalouse', 'Instrument', 'Culture'],
    createdAt: '2024-01-10'
  },
  {
    id: 's012',
    title: 'Percussion Gnawa et Transe Spirituelle',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Plongez dans l\'univers mystique de la musique Gnawa. Apprenez les rythmes de base aux qraqeb (crotales métalliques), découvrez l\'histoire de cette tradition afro-marocaine, et participez à une session de musique collective. Une expérience culturelle et spirituelle unique.',
    shortDescription: 'Initiez-vous aux percussions et rythmes Gnawa traditionnels',
    hostId: 'h012',
    hostName: 'Mahmoud Gnawi',
    hostJoinDate: '2024-02',
    hostResponseRate: 89,
    hostResponseTime: '< 6 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['gnawa-music', 'moroccan-percussion'],
    location: 'Essaouira',
    city: 'Essaouira',
    price: 200,
    priceUnit: 'par personne',
    rating: 4.86,
    reviewCount: 52,
    duration: '2.5 heures',
    capacity: 10,
    instantBook: true,
    featured: false,
    whatsIncluded: [
      'Utilisation des qraqeb',
      'Session de musique collective',
      'Histoire et culture Gnawa',
      'Vidéo souvenir',
      'Thé et amlou',
      'Accès au festival Gnawa (si en saison)'
    ],
    availability: 'Tous les jours',
    cancellationPolicy: 'Annulation gratuite 24h avant',
    tags: ['Gnawa', 'Percussion', 'Musique', 'Spirituel', 'Culture'],
    createdAt: '2024-02-14'
  },
  // ===== DKHOUL SPACE - Coworking =====
  {
    id: 's013',
    title: 'Espace Coworking Design avec Vue sur Atlas',
    category: 'space',
    categoryLabel: 'DKHOUL Space',
    description: 'Bureau lumineux dans un riad rénové avec terrasse panoramique sur les montagnes de l\'Atlas. WiFi ultra rapide (fiber 500Mbps), bureau ergonomique, écran 27", café et thé à volonté. Ambiance calme et professionnelle, parfait pour digital nomads et freelances. Salle de réunion disponible.',
    shortDescription: 'Coworking premium dans riad avec terrasse et vue montagnes',
    hostId: 'h013',
    hostName: 'Sarah Alami',
    hostJoinDate: '2023-03',
    hostResponseRate: 99,
    hostResponseTime: '< 30 min',
    hostVerified: true,
    hostSuperhost: true,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['modern-coworking-space', 'coworking-desk-setup', 'moroccan-rooftop-terrace'],
    location: 'Guéliz',
    city: 'Marrakech',
    price: 80,
    priceUnit: 'par jour',
    rating: 4.97,
    reviewCount: 156,
    duration: 'Flexible',
    capacity: 12,
    instantBook: true,
    featured: true,
    whatsIncluded: [
      'WiFi 500Mbps fibre optique',
      'Bureau ergonomique dédié',
      'Écran 27" sur demande',
      'Café, thé, eau à volonté',
      'Salle de réunion (2h/jour)',
      'Terrasse avec vue',
      'Casier personnel sécurisé',
      'Climatisation / Chauffage'
    ],
    availability: 'Lundi - Samedi, 8h-20h',
    cancellationPolicy: 'Annulation gratuite 24h avant',
    tags: ['Coworking', 'WiFi rapide', 'Design', 'Terrasse', 'Digital nomad'],
    createdAt: '2023-03-20'
  },
  {
    id: 's014',
    title: 'Bureau Privé dans Médina - Calme Garanti',
    category: 'space',
    categoryLabel: 'DKHOUL Space',
    description: 'Bureau privé de 15m² dans maison traditionnelle rénovée. Idéal pour concentration maximale. Climatisé, lumineux, WiFi performant. Accès cuisine équipée et petit jardin intérieur avec fontaine. Quartier calme de la médina, proche de tous commerces.',
    shortDescription: 'Bureau privé climatisé dans riad traditionnel rénové',
    hostId: 'h014',
    hostName: 'Omar Fassi',
    hostJoinDate: '2023-05',
    hostResponseRate: 95,
    hostResponseTime: '< 2 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe'],
    images: ['private-office-space', 'moroccan-traditional-workspace'],
    location: 'Médina',
    city: 'Fès',
    price: 120,
    priceUnit: 'par jour',
    rating: 4.91,
    reviewCount: 78,
    duration: 'Flexible',
    capacity: 2,
    instantBook: false,
    featured: false,
    whatsIncluded: [
      'Bureau privé 15m²',
      'WiFi fibre 200Mbps',
      'Climatisation',
      'Accès cuisine équipée',
      'Jardin intérieur',
      'Café et thé',
      'Imprimante/scanner partagé'
    ],
    availability: '7j/7, 24h/24',
    cancellationPolicy: 'Annulation gratuite 48h avant',
    tags: ['Bureau privé', 'Calme', 'Médina', 'WiFi', 'Climatisé'],
    createdAt: '2023-05-15'
  },
  {
    id: 's015',
    title: 'Coworking Créatif pour Artistes et Designers',
    category: 'space',
    categoryLabel: 'DKHOUL Space',
    description: 'Espace de travail collaboratif dans ancien atelier d\'artiste. Grande verrière, lumière naturelle exceptionnelle. Parfait pour créatifs, designers, photographes. Équipements: table lumineuse, imprimante A3, bibliothèque design, matériel de prototypage. Communauté active et inspirante.',
    shortDescription: 'Atelier créatif avec verrière pour artistes et designers',
    hostId: 'h015',
    hostName: 'Nadia Benjelloun',
    hostJoinDate: '2023-07',
    hostResponseRate: 92,
    hostResponseTime: '< 4 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Anglais', 'Espagnol'],
    images: ['creative-workspace', 'artist-studio-space'],
    location: 'Anfa',
    city: 'Casablanca',
    price: 70,
    priceUnit: 'par jour',
    rating: 4.88,
    reviewCount: 93,
    duration: 'Flexible',
    capacity: 15,
    instantBook: true,
    featured: false,
    whatsIncluded: [
      'Grande verrière lumineuse',
      'WiFi 300Mbps',
      'Imprimante A3 couleur',
      'Table lumineuse',
      'Bibliothèque design',
      'Communauté créative',
      'Événements networking mensuels',
      'Café/thé/snacks'
    ],
    availability: 'Lundi - Vendredi, 9h-19h',
    cancellationPolicy: 'Annulation gratuite 24h avant',
    tags: ['Créatif', 'Design', 'Artiste', 'Communauté', 'Verrière'],
    createdAt: '2023-07-08'
  },
  // ===== DKHOUL SPACE - Storage & Services =====
  {
    id: 's016',
    title: 'Consigne Bagages Sécurisée Centre-Ville',
    category: 'space',
    categoryLabel: 'DKHOUL Space',
    description: 'Déposez vos bagages en toute sécurité dans notre local surveillé 24h/24. Idéal si vous arrivez tôt ou partez tard. Accessible facilement depuis la gare et l\'aéroport. Casiers sécurisés, vidéosurveillance, assurance incluse. Service de navette disponible en supplément.',
    shortDescription: 'Gardez vos bagages en sécurité avec surveillance 24h/24',
    hostId: 'h016',
    hostName: 'Hamza Moussaoui',
    hostJoinDate: '2023-04',
    hostResponseRate: 98,
    hostResponseTime: '< 1 heure',
    hostVerified: true,
    hostSuperhost: true,
    hostLanguages: ['Français', 'Arabe', 'Anglais', 'Espagnol'],
    images: ['luggage-storage-facility', 'secure-storage-lockers'],
    location: 'Gare',
    city: 'Casablanca',
    price: 30,
    priceUnit: 'par bagage/jour',
    rating: 4.94,
    reviewCount: 287,
    duration: 'Flexible',
    capacity: 50,
    instantBook: true,
    featured: true,
    whatsIncluded: [
      'Casier sécurisé personnel',
      'Surveillance 24h/24',
      'Vidéosurveillance',
      'Assurance bagages',
      'Étiquettes de sécurité',
      'WiFi gratuit dans l\'espace accueil',
      'Toilettes propres'
    ],
    availability: '24h/24, 7j/7',
    cancellationPolicy: 'Annulation gratuite 2h avant',
    tags: ['Bagages', 'Consigne', 'Sécurisé', '24h', 'Centre-ville'],
    createdAt: '2023-04-25'
  },
  {
    id: 's017',
    title: 'Douche et Vestiaire pour Voyageurs',
    category: 'space',
    categoryLabel: 'DKHOUL Space',
    description: 'Rafraîchissez-vous avant ou après votre vol/train! Douches individuelles ultra-propres, serviettes fournies, produits de toilette bio. Vestiaires sécurisés, sèche-cheveux, miroir lumineux. Parfait pour les longs voyages ou avant un rendez-vous professionnel.',
    shortDescription: 'Douches privées et vestiaires propres pour voyageurs',
    hostId: 'h017',
    hostName: 'Samira Idrissi',
    hostJoinDate: '2023-06',
    hostResponseRate: 96,
    hostResponseTime: '< 2 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['modern-shower-facility', 'clean-bathroom-space'],
    location: 'Aéroport',
    city: 'Marrakech',
    price: 50,
    priceUnit: 'par personne',
    rating: 4.89,
    reviewCount: 164,
    duration: '1 heure',
    capacity: 6,
    instantBook: true,
    featured: false,
    whatsIncluded: [
      'Douche privée ultra-propre',
      'Serviettes propres fournies',
      'Produits de toilette bio',
      'Sèche-cheveux professionnel',
      'Vestiaire sécurisé',
      'WiFi gratuit',
      'Espace détente avec thé'
    ],
    availability: '6h-23h, 7j/7',
    cancellationPolicy: 'Annulation gratuite 2h avant',
    tags: ['Douche', 'Vestiaire', 'Aéroport', 'Propre', 'Voyage'],
    createdAt: '2023-06-30'
  },
  {
    id: 's018',
    title: 'Salle de Réunion Équipée 8 Personnes',
    category: 'space',
    categoryLabel: 'DKHOUL Space',
    description: 'Salle de réunion professionnelle climatisée dans immeuble moderne. Écran 65", visioconférence HD, tableau blanc, connexion HDMI. Eau, café, thé inclus. Possibilité restauration pour déjeuners d\'affaires. Accueil professionnel et parking gratuit.',
    shortDescription: 'Salle de réunion pro avec visioconférence et équipements',
    hostId: 'h018',
    hostName: 'Mehdi Tazi',
    hostJoinDate: '2023-08',
    hostResponseRate: 94,
    hostResponseTime: '< 3 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['modern-meeting-room', 'conference-room-setup'],
    location: 'CFC',
    city: 'Casablanca',
    price: 200,
    priceUnit: 'par 2 heures',
    rating: 4.92,
    reviewCount: 112,
    duration: '2-8 heures',
    capacity: 8,
    instantBook: false,
    featured: false,
    whatsIncluded: [
      'Écran 65" 4K',
      'Système visioconférence HD',
      'WiFi très haut débit',
      'Tableau blanc et marqueurs',
      'Eau, café, thé à volonté',
      'Climatisation',
      'Parking gratuit',
      'Accueil professionnel'
    ],
    availability: 'Lundi - Vendredi, 8h-20h',
    cancellationPolicy: 'Annulation gratuite 24h avant',
    tags: ['Réunion', 'Professionnel', 'Visioconférence', 'Équipée', 'Parking'],
    createdAt: '2023-08-17'
  },
  // ===== DKHOUL CONNECT - Guided Tours =====
  {
    id: 's019',
    title: 'Visite Guidée Privée des Souks et Médina',
    category: 'connect',
    categoryLabel: 'DKHOUL Connect',
    description: 'Explorez les souks labyrinthiques avec un guide local né dans la médina. Découvrez les ateliers cachés des artisans, apprenez l\'art de la négociation, évitez les pièges à touristes. Je vous emmène dans mes endroits secrets: le meilleur thé, les vraies épices, les artisans authentiques. Visite sur mesure selon vos intérêts!',
    shortDescription: 'Découverte authentique des souks avec un local passionné',
    hostId: 'h019',
    hostName: 'Abdel Souiri',
    hostJoinDate: '2023-02',
    hostResponseRate: 100,
    hostResponseTime: '< 30 min',
    hostVerified: true,
    hostSuperhost: true,
    hostLanguages: ['Français', 'Arabe', 'Anglais', 'Espagnol', 'Italien'],
    images: ['moroccan-souk-market', 'medina-traditional-shop'],
    location: 'Médina',
    city: 'Marrakech',
    price: 180,
    priceUnit: 'par groupe (1-6 pers)',
    rating: 4.98,
    reviewCount: 243,
    duration: '3 heures',
    capacity: 6,
    instantBook: true,
    featured: true,
    whatsIncluded: [
      'Guide local expert',
      'Visite ateliers artisans',
      'Conseils de négociation',
      'Dégustation thé à la menthe',
      'Carte des souks annotée',
      'Adresses secrètes partagées',
      'Photos souvenirs',
      'Disponible en 5 langues'
    ],
    availability: 'Tous les jours',
    cancellationPolicy: 'Annulation gratuite 24h avant',
    tags: ['Souk', 'Médina', 'Visite guidée', 'Shopping', 'Artisanat'],
    createdAt: '2023-02-10'
  },
  {
    id: 's020',
    title: 'Tour Photographique au Lever du Soleil',
    category: 'connect',
    categoryLabel: 'DKHOUL Connect',
    description: 'Réveillez-vous tôt pour capturer la magie de Marrakech au lever du soleil. Je vous emmène aux meilleurs spots photo: terrasses secrètes, ruelles colorées, jardins cachés. Conseils de cadrage et composition. Parfait pour photographes amateurs et professionnels. Les meilleures lumières pour Instagram!',
    shortDescription: 'Session photo guidée aux plus beaux spots au lever du soleil',
    hostId: 'h020',
    hostName: 'Yasmine El Korti',
    hostJoinDate: '2023-09',
    hostResponseRate: 97,
    hostResponseTime: '< 1 heure',
    hostVerified: true,
    hostSuperhost: true,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['moroccan-sunrise-photography', 'medina-rooftop-view'],
    location: 'Médina',
    city: 'Marrakech',
    price: 220,
    priceUnit: 'par personne',
    rating: 4.96,
    reviewCount: 128,
    duration: '2.5 heures',
    capacity: 4,
    instantBook: true,
    featured: true,
    whatsIncluded: [
      'Guide photographe professionnel',
      'Accès terrasses privées',
      'Conseils photo personnalisés',
      'Petit-déjeuner marocain',
      'Liste des spots Instagram',
      'Retouche basique de 10 photos',
      'Réveil en douceur avec thé'
    ],
    availability: 'Tous les jours, départ 5h30',
    cancellationPolicy: 'Annulation gratuite 24h avant',
    tags: ['Photographie', 'Lever de soleil', 'Instagram', 'Spots secrets', 'Guide'],
    createdAt: '2023-09-22'
  },
  {
    id: 's021',
    title: 'Excursion Montagnes Atlas & Villages Berbères',
    category: 'connect',
    categoryLabel: 'DKHOUL Connect',
    description: 'Échappez à la ville pour une journée dans l\'Atlas! Visite de villages berbères authentiques, rencontre avec les habitants, randonnée légère avec vues spectaculaires, déjeuner traditionnel chez l\'habitant. Transport 4x4, guide berbère francophone. Une immersion culturelle inoubliable!',
    shortDescription: 'Journée complète dans l\'Atlas avec déjeuner berbère chez l\'habitant',
    hostId: 'h021',
    hostName: 'Brahim Amazigh',
    hostJoinDate: '2023-04',
    hostResponseRate: 95,
    hostResponseTime: '< 2 heures',
    hostVerified: true,
    hostSuperhost: true,
    hostLanguages: ['Français', 'Arabe', 'Amazigh', 'Anglais'],
    images: ['atlas-mountains-morocco', 'berber-village-morocco'],
    location: 'Atlas',
    city: 'Marrakech',
    price: 450,
    priceUnit: 'par personne',
    rating: 4.97,
    reviewCount: 189,
    duration: '8 heures',
    capacity: 8,
    instantBook: false,
    featured: true,
    whatsIncluded: [
      'Transport 4x4 climatisé',
      'Guide berbère francophone',
      'Randonnée guidée (niveau facile)',
      'Déjeuner traditionnel complet',
      'Thé à la menthe chez l\'habitant',
      'Visite coopérative d\'argan',
      'Eau minérale illimitée',
      'Prise en charge hôtel'
    ],
    availability: 'Mardi - Dimanche',
    cancellationPolicy: 'Annulation gratuite 72h avant',
    tags: ['Atlas', 'Berbère', 'Nature', 'Randonnée', 'Culturel', '4x4'],
    createdAt: '2023-04-18'
  },
  {
    id: 's022',
    title: 'Tour Gastronomique: Street Food Authentique',
    category: 'connect',
    categoryLabel: 'DKHOUL Connect',
    description: 'Gourmands, cette visite est pour vous! Découvrez la vraie street food marocaine avec un foodie local. 10+ dégustations dans mes adresses favorites: harira, brochettes, snail soup, jus d\'orange frais, pâtisseries... Je vous raconte l\'histoire de chaque plat. Venez avec un bon appétit!',
    shortDescription: 'Découverte culinaire avec 10+ dégustations de street food locale',
    hostId: 'h022',
    hostName: 'Karim Benjelloun',
    hostJoinDate: '2023-07',
    hostResponseRate: 99,
    hostResponseTime: '< 1 heure',
    hostVerified: true,
    hostSuperhost: true,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['moroccan-street-food', 'traditional-moroccan-food'],
    location: 'Médina',
    city: 'Fès',
    price: 160,
    priceUnit: 'par personne',
    rating: 4.95,
    reviewCount: 167,
    duration: '3 heures',
    capacity: 6,
    instantBook: true,
    featured: true,
    whatsIncluded: [
      '10+ dégustations généreuses',
      'Boissons incluses',
      'Guide foodie passionné',
      'Histoire de la cuisine locale',
      'Carnet d\'adresses',
      'Conseils restaurants',
      'Végétarien possible',
      'Digestif traditionnel'
    ],
    availability: 'Tous les jours, 18h-21h',
    cancellationPolicy: 'Annulation gratuite 24h avant',
    tags: ['Food tour', 'Street food', 'Gastronomie', 'Local', 'Dégustation'],
    createdAt: '2023-07-12'
  },
  {
    id: 's023',
    title: 'Balade Vintage en Scooter Vespa',
    category: 'connect',
    categoryLabel: 'DKHOUL Connect',
    description: 'Explorez la ville avec style sur une Vespa vintage! Circuit personnalisé à travers les quartiers modernes et traditionnels. Je conduis, vous profitez! Arrêts photos, pause café, anecdotes historiques. Casques fournis, parcours sécurisé. Une façon unique et fun de découvrir la ville!',
    shortDescription: 'Tour de ville original en Vespa vintage avec guide',
    hostId: 'h023',
    hostName: 'Amine Tazi',
    hostJoinDate: '2023-10',
    hostResponseRate: 91,
    hostResponseTime: '< 4 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['vintage-vespa-scooter', 'city-scooter-tour'],
    location: 'Ville nouvelle',
    city: 'Casablanca',
    price: 280,
    priceUnit: 'par Vespa (1-2 pers)',
    rating: 4.90,
    reviewCount: 76,
    duration: '2 heures',
    capacity: 2,
    instantBook: false,
    featured: false,
    whatsIncluded: [
      'Vespa vintage restaurée',
      'Casques et équipement sécurité',
      'Guide conducteur expérimenté',
      'Circuit personnalisé',
      'Arrêts photos',
      'Pause café/thé',
      'Assurance complète',
      'Photos professionnelles'
    ],
    availability: 'Mercredi - Dimanche, 10h ou 16h',
    cancellationPolicy: 'Annulation gratuite 48h avant',
    tags: ['Vespa', 'Tour', 'Vintage', 'Fun', 'Original'],
    createdAt: '2023-10-28'
  },
  {
    id: 's024',
    title: 'Accompagnement Shopping Personnalisé',
    category: 'connect',
    categoryLabel: 'DKHOUL Connect',
    description: 'Personal shopper local à votre service! Je vous aide à trouver exactement ce que vous cherchez: tapis, babouches, argan, épices, artisanat... Je négocie pour vous au meilleur prix, évite les arnaques, trouve la qualité authentique. Liste de souhaits, budget, style: je m\'adapte à vos besoins!',
    shortDescription: 'Personal shopper expert pour achats authentiques au juste prix',
    hostId: 'h024',
    hostName: 'Salma Alaoui',
    hostJoinDate: '2023-11',
    hostResponseRate: 98,
    hostResponseTime: '< 2 heures',
    hostVerified: true,
    hostSuperhost: true,
    hostLanguages: ['Français', 'Arabe', 'Anglais', 'Espagnol'],
    images: ['moroccan-shopping-market', 'traditional-moroccan-crafts'],
    location: 'Souks',
    city: 'Marrakech',
    price: 150,
    priceUnit: 'par 2 heures',
    rating: 4.94,
    reviewCount: 134,
    duration: '2-6 heures',
    capacity: 4,
    instantBook: true,
    featured: false,
    whatsIncluded: [
      'Personal shopper expert',
      'Négociation professionnelle',
      'Garantie authenticité',
      'Conseils qualité/prix',
      'Service d\'envoi international',
      'Liste d\'adresses fiables',
      'Thé de bienvenue',
      'Sacs de transport'
    ],
    availability: 'Tous les jours',
    cancellationPolicy: 'Annulation gratuite 24h avant',
    tags: ['Shopping', 'Personal shopper', 'Négociation', 'Artisanat', 'Conseils'],
    createdAt: '2023-11-05'
  },
  {
    id: 's025',
    title: 'Conseils et Accompagnement pour Entrepreneurs',
    category: 'connect',
    categoryLabel: 'DKHOUL Connect',
    description: 'Entrepreneur expérimenté au Maroc depuis 15 ans. Je partage mes connaissances: création d\'entreprise, networking local, démarches administratives, culture business marocaine, opportunités sectorielles. Consulting personnalisé pour votre projet. Réseau de contacts professionnels inclus.',
    shortDescription: 'Consulting business avec entrepreneur expérimenté au Maroc',
    hostId: 'h025',
    hostName: 'Mehdi Berrada',
    hostJoinDate: '2024-01',
    hostResponseRate: 93,
    hostResponseTime: '< 6 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['business-meeting-modern', 'moroccan-entrepreneur'],
    location: 'Marina',
    city: 'Casablanca',
    price: 400,
    priceUnit: 'par session (2h)',
    rating: 4.91,
    reviewCount: 52,
    duration: '2 heures',
    capacity: 3,
    instantBook: false,
    featured: false,
    whatsIncluded: [
      'Consulting personnalisé',
      'Analyse de votre projet',
      'Guide création d\'entreprise',
      'Contacts professionnels qualifiés',
      'Follow-up email',
      'Documents templates',
      'Café dans espace business',
      'Recommandations experts'
    ],
    availability: 'Lundi - Vendredi sur RDV',
    cancellationPolicy: 'Annulation gratuite 48h avant',
    tags: ['Business', 'Entrepreneur', 'Consulting', 'Networking', 'Startup'],
    createdAt: '2024-01-15'
  },
  // ADDITIONAL SERVICES for more variety...
  {
    id: 's026',
    title: 'Hammam Traditionnel et Gommage Authentique',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Vivez l\'expérience du vrai hammam marocain dans un établissement familial authentique. Rituel complet: hammam vapeur, gommage au savon noir, massage relaxant à l\'huile d\'argan. Notre tayeba (spécialiste hammam) vous guide dans cette tradition millénaire. Un moment de détente et de purification absolue.',
    shortDescription: 'Hammam traditionnel complet avec gommage et massage par tayeba',
    hostId: 'h026',
    hostName: 'Malika Benjelloun',
    hostJoinDate: '2023-12',
    hostResponseRate: 96,
    hostResponseTime: '< 3 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe'],
    images: ['traditional-moroccan-hammam', 'moroccan-spa-treatment'],
    location: 'Médina',
    city: 'Marrakech',
    price: 250,
    priceUnit: 'par personne',
    rating: 4.93,
    reviewCount: 98,
    duration: '2 heures',
    capacity: 4,
    instantBook: true,
    featured: false,
    whatsIncluded: [
      'Hammam vapeur traditionnel',
      'Gommage complet savon noir',
      'Massage huile d\'argan 30min',
      'Ghassoul cheveux',
      'Thé à la menthe relaxation',
      'Produits naturels bio',
      'Serviettes fournies',
      'Zone détente privée'
    ],
    availability: 'Mardi - Dimanche',
    cancellationPolicy: 'Annulation gratuite 24h avant',
    tags: ['Hammam', 'Spa', 'Bien-être', 'Traditionnel', 'Relaxation'],
    createdAt: '2023-12-03'
  },
  {
    id: 's027',
    title: 'Initiation au Henné Artistique',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Apprenez l\'art ancestral du henné avec une artiste professionnelle. Découvrez les motifs traditionnels marocains, berbères et modernes. Créez vos propres designs, apprenez les techniques d\'application. Repartez avec un kit de henné naturel et vos mains décorées. Parfait pour un souvenir unique!',
    shortDescription: 'Atelier henné artistique avec artiste professionnelle',
    hostId: 'h027',
    hostName: 'Zineb El Fassi',
    hostJoinDate: '2024-01',
    hostResponseRate: 94,
    hostResponseTime: '< 4 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['henna-art-hands', 'moroccan-henna-design'],
    location: 'Médina',
    city: 'Fès',
    price: 180,
    priceUnit: 'par personne',
    rating: 4.89,
    reviewCount: 71,
    duration: '2 heures',
    capacity: 5,
    instantBook: true,
    featured: false,
    whatsIncluded: [
      'Atelier design et application',
      'Kit henné naturel à emporter',
      'Book de motifs traditionnels',
      'Application professionnelle',
      'Photos de vos créations',
      'Thé et gâteaux',
      'Conseils entretien',
      'Design personnalisé'
    ],
    availability: 'Mercredi - Dimanche',
    cancellationPolicy: 'Annulation gratuite 24h avant',
    tags: ['Henné', 'Art', 'Traditionnel', 'Beauté', 'Créatif'],
    createdAt: '2024-01-20'
  },
  {
    id: 's028',
    title: 'Studio Photo Professionnel avec Équipement',
    category: 'space',
    categoryLabel: 'DKHOUL Space',
    description: 'Studio photo 60m² entièrement équipé pour vos shootings. Fonds blanc/noir/vert, éclairages professionnels Profoto, vestiaire, coin maquillage, cuisine, WiFi. Idéal pour photographes, influenceurs, créateurs de contenu. Réservation à l\'heure ou à la journée.',
    shortDescription: 'Studio photo 60m² équipé avec éclairages pro et fonds',
    hostId: 'h028',
    hostName: 'Reda Alaoui',
    hostJoinDate: '2023-09',
    hostResponseRate: 90,
    hostResponseTime: '< 5 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['professional-photo-studio', 'photography-studio-equipment'],
    location: 'Maarif',
    city: 'Casablanca',
    price: 300,
    priceUnit: 'par 3 heures',
    rating: 4.87,
    reviewCount: 64,
    duration: '3-12 heures',
    capacity: 10,
    instantBook: false,
    featured: false,
    whatsIncluded: [
      'Studio 60m² climatisé',
      'Éclairages Profoto complets',
      'Fonds blanc/noir/vert',
      'Coin maquillage avec miroir',
      'Vestiaire privé',
      'WiFi haut débit',
      'Cuisine équipée',
      'Système audio Bluetooth',
      'Parking gratuit'
    ],
    availability: 'Tous les jours, 8h-22h',
    cancellationPolicy: 'Annulation gratuite 48h avant',
    tags: ['Studio photo', 'Professionnel', 'Équipé', 'Shooting', 'Création'],
    createdAt: '2023-09-08'
  },
  {
    id: 's029',
    title: 'Assistance Démarches Administratives Expatriés',
    category: 'connect',
    categoryLabel: 'DKHOUL Connect',
    description: 'Expert en accompagnement d\'expatriés depuis 10 ans. Je vous aide dans toutes vos démarches: carte de résident, ouverture compte bancaire, recherche logement, abonnements, assurance santé, scolarité enfants. Service en français complet pour faciliter votre installation.',
    shortDescription: 'Accompagnement complet pour expatriés: admin, logement, installation',
    hostId: 'h029',
    hostName: 'Sofia Benkirane',
    hostJoinDate: '2023-05',
    hostResponseRate: 97,
    hostResponseTime: '< 2 heures',
    hostVerified: true,
    hostSuperhost: true,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['business-consultation-office', 'moroccan-administration'],
    location: 'Agdal',
    city: 'Rabat',
    price: 350,
    priceUnit: 'par session (3h)',
    rating: 4.95,
    reviewCount: 87,
    duration: '3 heures',
    capacity: 2,
    instantBook: false,
    featured: false,
    whatsIncluded: [
      'Consultation personnalisée',
      'Guide complet expatriation',
      'Accompagnement démarches',
      'Contacts fiables (avocats, agents...)',
      'Templates documents',
      'Suivi par email 3 mois',
      'Checklist installation',
      'Recommandations quartiers'
    ],
    availability: 'Lundi - Vendredi sur RDV',
    cancellationPolicy: 'Annulation gratuite 48h avant',
    tags: ['Expatriation', 'Administration', 'Assistance', 'Installation', 'Conseil'],
    createdAt: '2023-05-25'
  },
  {
    id: 's030',
    title: 'Masterclass Pâtisserie Française-Marocaine Fusion',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Chef pâtissier formé en France vous apprend la fusion culinaire franco-marocaine. Créez des desserts innovants: macaron fleur d\'oranger, éclair à l\'argan, tarte amande-miel, millefeuille aux dattes. Techniques professionnelles, présentation gastronomique. Pour passionnés de pâtisserie!',
    shortDescription: 'Cours de pâtisserie fusion avec chef professionnel',
    hostId: 'h030',
    hostName: 'Chef Driss Tazi',
    hostJoinDate: '2024-02',
    hostResponseRate: 92,
    hostResponseTime: '< 6 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe'],
    images: ['french-pastry-making', 'gourmet-desserts'],
    location: 'Guéliz',
    city: 'Marrakech',
    price: 450,
    priceUnit: 'par personne',
    rating: 4.91,
    reviewCount: 38,
    duration: '5 heures',
    capacity: 6,
    instantBook: false,
    featured: false,
    whatsIncluded: [
      'Cours avec chef professionnel',
      'Ingrédients premium',
      'Équipement professionnel',
      'Recettes détaillées',
      'Dégustation complète',
      'Boîte pâtisseries à emporter',
      'Tablier chef personnalisé',
      'Certificat de participation'
    ],
    availability: 'Samedi - Dimanche',
    cancellationPolicy: 'Annulation gratuite 72h avant',
    tags: ['Pâtisserie', 'Fusion', 'Chef', 'Gastronomie', 'Professionnel'],
    createdAt: '2024-02-08'
  },
  // Continue with more creative services...
  {
    id: 's031',
    title: 'Session Yoga sur Terrasse avec Vue Médina',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Commencez votre journée avec une séance de yoga revigorante sur ma terrasse panoramique. Vue imprenable sur la médina et les montagnes. Tous niveaux bienvenus. Tapis et accessoires fournis. Petit-déjeuner sain inclus après la session. Cours en français ou anglais.',
    shortDescription: 'Yoga matinal sur terrasse panoramique avec petit-déjeuner',
    hostId: 'h031',
    hostName: 'Imane Lahlou',
    hostJoinDate: '2023-08',
    hostResponseRate: 95,
    hostResponseTime: '< 3 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['yoga-rooftop-terrace', 'moroccan-rooftop-meditation'],
    location: 'Médina',
    city: 'Marrakech',
    price: 150,
    priceUnit: 'par personne',
    rating: 4.92,
    reviewCount: 103,
    duration: '1.5 heures',
    capacity: 8,
    instantBook: true,
    featured: false,
    whatsIncluded: [
      'Cours de yoga tous niveaux',
      'Tapis et accessoires',
      'Vue panoramique',
      'Petit-déjeuner sain bio',
      'Thé détox',
      'Musique relaxante',
      'Espace vestiaire',
      'Photos de la session'
    ],
    availability: 'Tous les jours, 7h30',
    cancellationPolicy: 'Annulation gratuite 12h avant',
    tags: ['Yoga', 'Bien-être', 'Terrasse', 'Petit-déjeuner', 'Vue'],
    createdAt: '2023-08-16'
  },
  {
    id: 's032',
    title: 'Cours de Cuisine Végane Marocaine Moderne',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Découvrez comment adapter les recettes marocaines traditionnelles en versions véganes délicieuses! Tajine végétal, couscous aux légumes, pastilla vegan, pâtisseries sans œufs ni lait. Chef spécialisé nutrition végétale. Astuces et substitutions créatives.',
    shortDescription: 'Cuisine marocaine végane avec chef spécialisé',
    hostId: 'h032',
    hostName: 'Dounia Berrada',
    hostJoinDate: '2023-11',
    hostResponseRate: 94,
    hostResponseTime: '< 4 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe', 'Anglais'],
    images: ['vegan-cooking-colorful', 'moroccan-vegetable-dishes'],
    location: 'Gauthier',
    city: 'Casablanca',
    price: 280,
    priceUnit: 'par personne',
    rating: 4.88,
    reviewCount: 59,
    duration: '4 heures',
    capacity: 6,
    instantBook: false,
    featured: false,
    whatsIncluded: [
      'Cours avec chef végane',
      'Ingrédients bio locaux',
      'Recettes adaptées',
      'Guide substitutions',
      'Dégustation complète',
      'Smoothie détox',
      'Liste courses véganes Maroc',
      'E-book recettes'
    ],
    availability: 'Vendredi - Dimanche',
    cancellationPolicy: 'Annulation gratuite 48h avant',
    tags: ['Végane', 'Cuisine', 'Bio', 'Santé', 'Moderne'],
    createdAt: '2023-11-12'
  },
  {
    id: 's033',
    title: 'Coworking avec Rooftop Piscine',
    category: 'space',
    categoryLabel: 'DKHOUL Space',
    description: 'Travaillez dans un cadre exceptionnel! Espace coworking moderne avec accès à une magnifique piscine sur rooftop. WiFi ultra-rapide, bureaux confortables, salles de réunion. Pause baignade quand vous voulez. Restaurant healthy sur place. Le coworking rêvé pour digital nomads!',
    shortDescription: 'Coworking premium avec piscine rooftop et restaurant',
    hostId: 'h033',
    hostName: 'Yassine Alami',
    hostJoinDate: '2023-06',
    hostResponseRate: 96,
    hostResponseTime: '< 2 heures',
    hostVerified: true,
    hostSuperhost: true,
    hostLanguages: ['Français', 'Arabe', 'Anglais', 'Espagnol'],
    images: ['coworking-rooftop-pool', 'modern-workspace-pool'],
    location: 'Hivernage',
    city: 'Marrakech',
    price: 150,
    priceUnit: 'par jour',
    rating: 4.96,
    reviewCount: 214,
    duration: 'Flexible',
    capacity: 30,
    instantBook: true,
    featured: true,
    whatsIncluded: [
      'Bureau dédié ou espace flex',
      'WiFi fibre 1Gbps',
      'Accès piscine rooftop',
      'Transats et serviettes',
      'Salle de réunion',
      'Restaurant healthy',
      'Café/thé illimité',
      'Casier sécurisé',
      'Douche et vestiaire',
      'Parking gratuit'
    ],
    availability: '7j/7, 8h-20h',
    cancellationPolicy: 'Annulation gratuite 24h avant',
    tags: ['Coworking', 'Piscine', 'Premium', 'Digital nomad', 'Rooftop'],
    createdAt: '2023-06-22'
  },
  {
    id: 's034',
    title: 'Safari Désert: Nuit sous les Étoiles',
    category: 'connect',
    categoryLabel: 'DKHOUL Connect',
    description: 'Expérience inoubliable dans le désert! Départ en 4x4, balade à dos de dromadaire au coucher du soleil, dîner berbère traditionnel, nuit en camp de luxe sous un ciel étoilé magique. Petit-déjeuner au lever du soleil. Retour Marrakech. Guide berbère authentique. Tout inclus!',
    shortDescription: 'Aventure désert 2j/1n: dromadaire, camp luxe, dîner sous étoiles',
    hostId: 'h034',
    hostName: 'Hassan Ait Baha',
    hostJoinDate: '2023-03',
    hostResponseRate: 98,
    hostResponseTime: '< 1 heure',
    hostVerified: true,
    hostSuperhost: true,
    hostLanguages: ['Français', 'Arabe', 'Amazigh', 'Anglais', 'Espagnol'],
    images: ['sahara-desert-camp', 'camel-ride-sunset'],
    location: 'Zagora',
    city: 'Marrakech',
    price: 850,
    priceUnit: 'par personne',
    rating: 4.98,
    reviewCount: 276,
    duration: '2 jours / 1 nuit',
    capacity: 12,
    instantBook: false,
    featured: true,
    whatsIncluded: [
      'Transport 4x4 climatisé A/R',
      'Balade dromadaire 2h',
      'Camp luxe avec sanitaires',
      'Dîner berbère complet',
      'Petit-déjeuner au désert',
      'Musique berbère au feu',
      'Guide multilingue',
      'Eau minérale illimitée',
      'Couvertures chaudes',
      'Photos professionnelles'
    ],
    availability: 'Tous les jours',
    cancellationPolicy: 'Annulation gratuite 7 jours avant',
    tags: ['Désert', 'Sahara', 'Dromadaire', 'Camp', 'Aventure', 'Berbère'],
    createdAt: '2023-03-30'
  },
  {
    id: 's035',
    title: 'Atelier Parfumerie: Créez Votre Parfum',
    category: 'skills',
    categoryLabel: 'DKHOUL Skills',
    description: 'Créez votre parfum unique avec un maître parfumeur! Découvrez les essences marocaines: rose, jasmin, fleur d\'oranger, cèdre, musc. Apprenez la pyramide olfactive, créez votre propre fragrance personnalisée. Repartez avec 50ml de votre création dans un flacon artisanal.',
    shortDescription: 'Créez votre parfum personnalisé avec maître parfumeur',
    hostId: 'h035',
    hostName: 'Amina El Glaoui',
    hostJoinDate: '2023-10',
    hostResponseRate: 91,
    hostResponseTime: '< 5 heures',
    hostVerified: true,
    hostSuperhost: false,
    hostLanguages: ['Français', 'Arabe'],
    images: ['perfume-making-workshop', 'moroccan-fragrance-bottles'],
    location: 'Médina',
    city: 'Fès',
    price: 380,
    priceUnit: 'par personne',
    rating: 4.90,
    reviewCount: 67,
    duration: '3 heures',
    capacity: 4,
    instantBook: false,
    featured: false,
    whatsIncluded: [
      'Atelier avec maître parfumeur',
      '40+ essences à découvrir',
      'Votre parfum 50ml personnalisé',
      'Flacon artisanal gravé',
      'Formule de votre création',
      'Guide olfactif',
      'Boîte cadeau',
      'Possibilité re-commande'
    ],
    availability: 'Mardi - Samedi',
    cancellationPolicy: 'Annulation gratuite 48h avant',
    tags: ['Parfum', 'Création', 'Artisanal', 'Essences', 'Unique'],
    createdAt: '2023-10-19'
  }
];

// ==================== REVIEWS DATA ====================

export const reviews: Review[] = [
  // Reviews for s001 - Cours Tajine
  {
    id: 'r001',
    serviceId: 's001',
    userId: 'u101',
    userName: 'Sophie Martin',
    rating: 5,
    comment: 'Expérience absolument fabuleuse! Fatima est une hôte extraordinaire, passionnée et généreuse. La visite du marché était fascinante et le tajine que nous avons préparé était délicieux. J\'ai adoré chaque moment et je recommande à 100%!',
    date: '2024-10-15',
    helpful: 24
  },
  {
    id: 'r002',
    serviceId: 's001',
    userId: 'u102',
    userName: 'Thomas Dubois',
    rating: 5,
    comment: 'Un des meilleurs souvenirs de mon voyage au Maroc! Fatima nous a appris bien plus que la cuisine, elle nous a fait découvrir la culture marocaine authentique. Le livret de recettes est parfait, j\'ai déjà refait le tajine chez moi avec succès!',
    date: '2024-10-08',
    helpful: 18
  },
  {
    id: 'r003',
    serviceId: 's001',
    userId: 'u103',
    userName: 'Emma Wilson',
    rating: 5,
    comment: 'Absolutely amazing experience! The market tour was eye-opening, and Fatima\'s cooking skills are incredible. The food we made was restaurant-quality. Such a warm and welcoming atmosphere. Highly recommend!',
    date: '2024-09-28',
    helpful: 31
  },
  {
    id: 'r004',
    serviceId: 's001',
    userId: 'u104',
    userName: 'Pierre Lefèvre',
    rating: 5,
    comment: 'Magnifique! Fatima est une excellente enseignante, très patiente. Sa maison dans la médina est charmante et tout était parfaitement organisé. Les photos prises pendant l\'expérience sont magnifiques. Merci infiniment!',
    date: '2024-09-20',
    helpful: 15
  },
  {
    id: 'r005',
    serviceId: 's001',
    userId: 'u105',
    userName: 'Laura García',
    rating: 4,
    comment: 'Très belle expérience! Le tajine était succulent et l\'ambiance très conviviale. Petit bémol: nous étions 6 personnes et c\'était un peu serré dans la cuisine. Mais sinon, tout était parfait!',
    date: '2024-09-12',
    helpful: 9
  },
  
  // Reviews for s002 - Couscous
  {
    id: 'r006',
    serviceId: 's002',
    userId: 'u106',
    userName: 'Marie Fontaine',
    rating: 5,
    comment: 'Khadija est une vraie perle! Rouler le couscous à la main était plus difficile que je pensais mais tellement gratifiant. Les pâtisseries étaient divines. Une journée complète de bonheur culinaire!',
    date: '2024-10-20',
    helpful: 22
  },
  {
    id: 'r007',
    serviceId: 's002',
    userId: 'u107',
    userName: 'Jean Moreau',
    rating: 5,
    comment: 'Expérience authentique et enrichissante. Le couscous royal était un festin! Khadija partage sa passion avec beaucoup de générosité. Le tablier DKHOUL en cadeau est une belle attention. Je reviendrai!',
    date: '2024-10-12',
    helpful: 17
  },
  {
    id: 'r008',
    serviceId: 's002',
    userId: 'u108',
    userName: 'Isabella Romano',
    rating: 5,
    comment: 'Che meraviglia! Khadija speaks perfect Italian which made everything easier. The couscous was the best I\'ve ever tasted. The pastries we made were works of art. Grazie mille!',
    date: '2024-09-30',
    helpful: 14
  },
  
  // Reviews for s013 - Coworking
  {
    id: 'r009',
    serviceId: 's013',
    userId: 'u109',
    userName: 'Alex Thompson',
    rating: 5,
    comment: 'Best coworking space in Marrakech, hands down! The WiFi is incredibly fast, the view from the terrace is stunning, and Sarah is a wonderful host. Perfect for getting work done while enjoying the Moroccan vibe.',
    date: '2024-10-22',
    helpful: 43
  },
  {
    id: 'r010',
    serviceId: 's013',
    userId: 'u110',
    userName: 'Claire Dubois',
    rating: 5,
    comment: 'Espace de rêve pour les nomades digitaux! J\'y ai travaillé pendant 2 semaines et je n\'ai eu aucun problème de connexion. L\'ambiance est calme et professionnelle. La terrasse est parfaite pour les pauses. Highly recommended!',
    date: '2024-10-18',
    helpful: 38
  },
  {
    id: 'r011',
    serviceId: 's013',
    userId: 'u111',
    userName: 'Marc Petit',
    rating: 5,
    comment: 'Lieu exceptionnel! WiFi ultra rapide (j\'ai testé plusieurs appels vidéo sans problème), bureau confortable, café excellent. Sarah est tr��s accueillante et le lieu est impeccablement tenu. Je reviendrai à chaque passage à Marrakech!',
    date: '2024-10-10',
    helpful: 29
  },
  {
    id: 'r012',
    serviceId: 's013',
    userId: 'u112',
    userName: 'Nina Schmidt',
    rating: 5,
    comment: 'Als digitale Nomadin habe ich viele Coworking-Spaces getestet - dieser ist einer der besten! Sehr schnelles Internet, tolle Atmosphäre, spektakuläre Aussicht. Sarah ist super nett. Perfekt!',
    date: '2024-09-25',
    helpful: 26
  },
  
  // Reviews for s019 - Tour Souks
  {
    id: 'r013',
    serviceId: 's019',
    userId: 'u113',
    userName: 'Julie Bernard',
    rating: 5,
    comment: 'Abdel est un guide exceptionnel! Il connaît chaque recoin de la médina et a partagé des histoires fascinantes. Grâce à lui, j\'ai trouvé des trésors artisanaux authentiques à des prix justes. Un must à Marrakech!',
    date: '2024-10-25',
    helpful: 51
  },
  {
    id: 'r014',
    serviceId: 's019',
    userId: 'u114',
    userName: 'David Chen',
    rating: 5,
    comment: 'Best tour guide ever! Abdel took us to hidden workshops that tourists never find. His negotiation skills saved us so much money. We learned about Moroccan crafts and culture. The mint tea stops were perfect. 10/10!',
    date: '2024-10-20',
    helpful: 47
  },
  {
    id: 'r015',
    serviceId: 's019',
    userId: 'u115',
    userName: 'Camille Rousseau',
    rating: 5,
    comment: 'Visite incroyable! Abdel parle 5 langues couramment et s\'adapte parfaitement aux intérêts de chacun. Les ateliers d\'artisans étaient magnifiques. La carte annotée qu\'il m\'a donnée m\'a été utile tout mon séjour. Merci!',
    date: '2024-10-15',
    helpful: 42
  },
  {
    id: 'r016',
    serviceId: 's019',
    userId: 'u116',
    userName: 'Robert Miller',
    rating: 5,
    comment: 'Simply outstanding! Abdel\'s knowledge of the medina is encyclopedic. We avoided all the tourist traps and found authentic crafts. He\'s friendly, professional, and genuinely passionate. Worth every dirham!',
    date: '2024-10-08',
    helpful: 39
  },
  
  // More reviews for popular services
  {
    id: 'r017',
    serviceId: 's020',
    userId: 'u117',
    userName: 'Sophie Laurent',
    rating: 5,
    comment: 'Lever à 5h30 mais ça en valait totalement la peine! Les spots que Yasmine m\'a montrés sont incroyables. J\'ai fait les meilleures photos de ma vie! Le petit-déjeuner sur la terrasse au lever du soleil était magique. Merci Yasmine!',
    date: '2024-10-23',
    helpful: 36
  },
  {
    id: 'r018',
    serviceId: 's020',
    userId: 'u118',
    userName: 'James Anderson',
    rating: 5,
    comment: 'As a professional photographer, I was impressed by Yasmine\'s knowledge of the best angles and lighting. The sunrise over Marrakech is breathtaking. She edited 10 of my photos beautifully. Must-do for Instagrammers!',
    date: '2024-10-17',
    helpful: 33
  },
  {
    id: 'r019',
    serviceId: 's021',
    userId: 'u119',
    userName: 'Émilie Petit',
    rating: 5,
    comment: 'Journée extraordinaire dans l\'Atlas! Brahim est un guide formidable, très cultivé et drôle. Le déjeuner chez l\'habitant était authentique et délicieux. Les paysages sont à couper le souffle. Une vraie immersion culturelle!',
    date: '2024-10-19',
    helpful: 45
  },
  {
    id: 'r020',
    serviceId: 's021',
    userId: 'u120',
    userName: 'Michael Brown',
    rating: 5,
    comment: 'Incredible day trip! The Atlas Mountains are stunning and the Berber villages are so authentic. Brahim shared fascinating insights about Berber culture. The home-cooked meal was the best food of our trip. Don\'t miss this!',
    date: '2024-10-11',
    helpful: 41
  },
  
  // Reviews for s022 - Food Tour
  {
    id: 'r021',
    serviceId: 's022',
    userId: 'u121',
    userName: 'Antoine Girard',
    rating: 5,
    comment: 'En tant que foodie, c\'était le paradis! Karim connaît les meilleures adresses de Fès. Nous avons goûté des plats que je n\'aurais jamais trouvés seul. Les 10 dégustations étaient généreuses et délicieuses. J\'ai adoré!',
    date: '2024-10-24',
    helpful: 38
  },
  {
    id: 'r022',
    serviceId: 's022',
    userId: 'u122',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'This food tour exceeded all expectations! Karim is passionate and knowledgeable. We tried amazing street food, learned about Moroccan cuisine history, and discovered hidden gems. Come hungry - portions are generous!',
    date: '2024-10-16',
    helpful: 34
  },
  
  // Reviews for s034 - Desert Safari
  {
    id: 'r023',
    serviceId: 's034',
    userId: 'u123',
    userName: 'Isabelle Martin',
    rating: 5,
    comment: 'Expérience magique et inoubliable! Le camp était luxueux et confortable, le dîner sous les étoiles était romantique, et Hassan est un guide exceptionnel. La balade à dromadaire au coucher du soleil restera gravée à jamais dans ma mémoire!',
    date: '2024-10-21',
    helpful: 67
  },
  {
    id: 'r024',
    serviceId: 's034',
    userId: 'u124',
    userName: 'Christopher Lee',
    rating: 5,
    comment: 'Once-in-a-lifetime experience! The Sahara desert is breathtaking. Hassan and his team took care of everything. The camel ride, Berber music, stargazing - all perfect. The camp was surprisingly comfortable. Absolutely recommend!',
    date: '2024-10-14',
    helpful: 62
  },
  {
    id: 'r025',
    serviceId: 's034',
    userId: 'u125',
    userName: 'Céline Dubois',
    rating: 5,
    comment: 'Moment hors du temps! Le désert est encore plus beau que sur les photos. La nuit sous les étoiles était féérique, la musique berbère envoutante. Hassan est un excellent conteur. Le meilleur moment de notre voyage au Maroc!',
    date: '2024-10-07',
    helpful: 58
  },
  {
    id: 'r026',
    serviceId: 's034',
    userId: 'u126',
    userName: 'Daniel García',
    rating: 5,
    comment: 'Increíble! La experiencia en el desierto del Sahara fue mágica. Hassan es un guía maravilloso. El campamento de lujo tenía todas las comodidades. La comida bereber era deliciosa. Las fotos profesionales son un gran plus. ¡Recomendado 100%!',
    date: '2024-09-29',
    helpful: 53
  }
];

// Add 70+ more reviews for other services to reach 100+ total
// Continuing with more reviews to populate all services...

export const bookingsData: Booking[] = [
  {
    id: 'DKH-2024-001234',
    serviceId: 's001',
    serviceName: 'Cours de Cuisine Tajine Traditionnel',
    serviceImage: 'moroccan-cooking-tagine',
    hostName: 'Fatima El Amrani',
    clientName: 'Sophie Martin',
    date: '2024-11-15',
    time: '10:00',
    guests: 2,
    status: 'confirmed',
    amount: 600,
    createdAt: '2024-11-01'
  },
  {
    id: 'DKH-2024-001235',
    serviceId: 's013',
    serviceName: 'Espace Coworking Design',
    serviceImage: 'modern-coworking-space',
    hostName: 'Sarah Alami',
    clientName: 'Alex Thompson',
    date: '2024-11-10',
    time: '08:00',
    guests: 1,
    status: 'confirmed',
    amount: 80,
    createdAt: '2024-11-05'
  },
  {
    id: 'DKH-2024-001236',
    serviceId: 's019',
    serviceName: 'Visite Guidée Privée des Souks',
    serviceImage: 'moroccan-souk-market',
    hostName: 'Abdel Souiri',
    clientName: 'Julie Bernard',
    date: '2024-11-12',
    time: '14:00',
    guests: 4,
    status: 'pending',
    amount: 180,
    createdAt: '2024-11-06'
  },
  {
    id: 'DKH-2024-001237',
    serviceId: 's034',
    serviceName: 'Safari Désert: Nuit sous les Étoiles',
    serviceImage: 'sahara-desert-camp',
    hostName: 'Hassan Ait Baha',
    clientName: 'Isabelle Martin',
    date: '2024-11-20',
    time: '07:00',
    guests: 2,
    status: 'confirmed',
    amount: 1700,
    createdAt: '2024-10-28'
  },
  {
    id: 'DKH-2024-001238',
    serviceId: 's021',
    serviceName: 'Excursion Montagnes Atlas',
    serviceImage: 'atlas-mountains-morocco',
    hostName: 'Brahim Amazigh',
    clientName: 'Émilie Petit',
    date: '2024-11-14',
    time: '08:30',
    guests: 3,
    status: 'confirmed',
    amount: 1350,
    createdAt: '2024-11-02'
  },
  {
    id: 'DKH-2024-001239',
    serviceId: 's002',
    serviceName: 'Atelier Couscous Royal',
    serviceImage: 'moroccan-couscous',
    hostName: 'Khadija Benani',
    clientName: 'Marie Fontaine',
    date: '2024-11-18',
    time: '11:00',
    guests: 1,
    status: 'pending',
    amount: 350,
    createdAt: '2024-11-07'
  },
  {
    id: 'DKH-2024-001240',
    serviceId: 's022',
    serviceName: 'Tour Gastronomique Street Food',
    serviceImage: 'moroccan-street-food',
    hostName: 'Karim Benjelloun',
    clientName: 'Antoine Girard',
    date: '2024-11-13',
    time: '18:00',
    guests: 2,
    status: 'confirmed',
    amount: 320,
    createdAt: '2024-11-04'
  },
  {
    id: 'DKH-2024-001241',
    serviceId: 's006',
    serviceName: 'Atelier Poterie Berbère',
    serviceImage: 'moroccan-pottery-workshop',
    hostName: 'Moha Amazigh',
    clientName: 'Claire Dubois',
    date: '2024-11-16',
    time: '10:00',
    guests: 2,
    status: 'pending',
    amount: 640,
    createdAt: '2024-11-06'
  },
  {
    id: 'DKH-2024-001242',
    serviceId: 's020',
    serviceName: 'Tour Photographique Lever du Soleil',
    serviceImage: 'moroccan-sunrise-photography',
    hostName: 'Yasmine El Korti',
    clientName: 'Sophie Laurent',
    date: '2024-11-11',
    time: '05:30',
    guests: 1,
    status: 'completed',
    amount: 220,
    createdAt: '2024-10-30'
  },
  {
    id: 'DKH-2024-001243',
    serviceId: 's033',
    serviceName: 'Coworking avec Rooftop Piscine',
    serviceImage: 'coworking-rooftop-pool',
    hostName: 'Yassine Alami',
    clientName: 'Nina Schmidt',
    date: '2024-11-09',
    time: '08:00',
    guests: 1,
    status: 'completed',
    amount: 150,
    createdAt: '2024-11-01'
  }
];

export const messagesData: Message[] = [
  {
    id: 'm001',
    conversationId: 'c001',
    senderId: 'u101',
    senderName: 'Sophie Martin',
    content: 'Bonjour! Je suis très intéressée par votre cours de cuisine. Est-ce adapté pour les débutants complets?',
    timestamp: '2024-11-07 14:23',
    read: true,
    type: 'text'
  },
  {
    id: 'm002',
    conversationId: 'c001',
    senderId: 'h001',
    senderName: 'Fatima El Amrani',
    content: 'Bonjour Sophie! Oui absolument, mon cours est parfait pour les débutants. Je vous guide étape par étape et tout est expliqué simplement. Vous allez adorer! 😊',
    timestamp: '2024-11-07 14:35',
    read: true,
    type: 'text'
  },
  {
    id: 'm003',
    conversationId: 'c001',
    senderId: 'u101',
    senderName: 'Sophie Martin',
    content: 'Parfait! Est-ce que je peux venir avec mon mari? Nous sommes en voyage de noces au Maroc.',
    timestamp: '2024-11-07 14:40',
    read: true,
    type: 'text'
  },
  {
    id: 'm004',
    conversationId: 'c001',
    senderId: 'h001',
    senderName: 'Fatima El Amrani',
    content: 'Bien sûr! Félicitations pour votre mariage! 💕 Le prix est de 300 DH par personne donc 600 DH pour vous deux. Je vous offrirai un petit cadeau surprise pour célébrer!',
    timestamp: '2024-11-07 14:42',
    read: true,
    type: 'text'
  },
  {
    id: 'm005',
    conversationId: 'c001',
    senderId: 'u101',
    senderName: 'Sophie Martin',
    content: 'C\'est tellement gentil! Merci beaucoup! Je vais réserver pour le 15 novembre à 10h.',
    timestamp: '2024-11-07 14:45',
    read: true,
    type: 'text'
  },
  {
    id: 'm006',
    conversationId: 'c001',
    senderId: 'system',
    senderName: 'Système DKHOUL',
    content: 'Réservation confirmée #DKH-2024-001234',
    timestamp: '2024-11-07 14:46',
    read: true,
    type: 'system'
  },
  {
    id: 'm007',
    conversationId: 'c001',
    senderId: 'h001',
    senderName: 'Fatima El Amrani',
    content: 'Super! J\'ai hâte de vous rencontrer! Je vous enverrai l\'adresse exacte 24h avant. À bientôt! 🎉',
    timestamp: '2024-11-07 14:48',
    read: true,
    type: 'text'
  }
];

export const conversationsData: Conversation[] = [
  {
    id: 'c001',
    participantId: 'u101',
    participantName: 'Sophie Martin',
    lastMessage: 'J\'ai hâte de vous rencontrer! À bientôt! 🎉',
    lastMessageTime: '14:48',
    unreadCount: 0,
    online: false,
    lastSeen: 'il y a 2 heures'
  },
  {
    id: 'c002',
    participantId: 'u109',
    participantName: 'Alex Thompson',
    lastMessage: 'Merci pour cette semaine au coworking, c\'était parfait!',
    lastMessageTime: '10:30',
    unreadCount: 1,
    online: true
  },
  {
    id: 'c003',
    participantId: 'u113',
    participantName: 'Julie Bernard',
    lastMessage: 'Peut-on commencer la visite à 14h au lieu de 15h?',
    lastMessageTime: 'Hier',
    unreadCount: 2,
    online: false,
    lastSeen: 'il y a 5 heures'
  },
  {
    id: 'c004',
    participantId: 'system',
    participantName: 'Support DKHOUL',
    lastMessage: 'Bienvenue sur DKHOUL! Comment pouvons-nous vous aider?',
    lastMessageTime: 'il y a 1 semaine',
    unreadCount: 0,
    online: true
  }
];

// Helper function to get service by ID
export function getServiceById(id: string): Service | undefined {
  return services.find(s => s.id === id);
}

// Helper function to get reviews for a service
export function getReviewsByServiceId(serviceId: string): Review[] {
  return reviews.filter(r => r.serviceId === serviceId);
}

// Helper function to calculate average rating
export function calculateAverageRating(serviceId: string): number {
  const serviceReviews = getReviewsByServiceId(serviceId);
  if (serviceReviews.length === 0) return 0;
  const sum = serviceReviews.reduce((acc, r) => acc + r.rating, 0);
  return Number((sum / serviceReviews.length).toFixed(2));
}

// Helper function to get services by category
export function getServicesByCategory(category: 'space' | 'skills' | 'connect'): Service[] {
  return services.filter(s => s.category === category);
}

// Helper function to filter services
export function filterServices(filters: {
  category?: string[];
  minPrice?: number;
  maxPrice?: number;
  instantBook?: boolean;
  minRating?: number;
  city?: string;
}): Service[] {
  return services.filter(service => {
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(service.category)) return false;
    }
    if (filters.minPrice !== undefined && service.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && service.price > filters.maxPrice) return false;
    if (filters.instantBook !== undefined && service.instantBook !== filters.instantBook) return false;
    if (filters.minRating !== undefined && service.rating < filters.minRating) return false;
    if (filters.city && service.city !== filters.city) return false;
    return true;
  });
}

// Get featured services
export function getFeaturedServices(): Service[] {
  return services.filter(s => s.featured);
}

// Get popular services (high rating + many reviews)
export function getPopularServices(limit: number = 12): Service[] {
  return services
    .filter(s => s.reviewCount > 50)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, limit);
}
