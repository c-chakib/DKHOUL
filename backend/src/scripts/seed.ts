import dotenv from 'dotenv';
import { connectDatabase } from '../config/database';
import User from '../models/User.model';
import Service from '../models/Service.model';
import Booking from '../models/Booking.model';
import Review from '../models/Review.model';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Moroccan cities for location diversity
const moroccanCities = [
  { city: 'Casablanca', region: 'Casablanca-Settat', coords: [-7.6177, 33.5731] },
  { city: 'Rabat', region: 'Rabat-Salé-Kénitra', coords: [-6.8326, 33.9716] },
  { city: 'Marrakech', region: 'Marrakech-Safi', coords: [-7.9811, 31.6295] },
  { city: 'Fès', region: 'Fès-Meknès', coords: [-5.0003, 34.0181] },
  { city: 'Tanger', region: 'Tanger-Tétouan-Al Hoceïma', coords: [-5.8087, 35.7595] },
  { city: 'Agadir', region: 'Souss-Massa', coords: [-9.5981, 30.4278] },
  { city: 'Meknès', region: 'Fès-Meknès', coords: [-5.5473, 33.8935] },
  { city: 'Oujda', region: 'Oriental', coords: [-1.9077, 34.6814] },
  { city: 'Essaouira', region: 'Marrakech-Safi', coords: [-9.7700, 31.5085] },
  { city: 'Chefchaouen', region: 'Tanger-Tétouan-Al Hoceïma', coords: [-5.2686, 35.1689] },
];

// Spaces category services (Accommodations & Venues)
const spacesServices = [
  {
    title: 'Riad Traditionnel - Médina de Marrakech',
    description: 'Magnifique riad authentique au cœur de la médina. 5 chambres luxueuses avec patio central, fontaine, et terrasse panoramique. Architecture marocaine traditionnelle avec zellige et bois sculpté.',
    category: 'Space',
    pricing: { amount: 1200, currency: 'MAD', priceType: 'per_day' },
    capacity: 10,
    duration: 1440,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Villa Moderne avec Piscine - Casablanca',
    description: 'Villa contemporaine 4 chambres avec piscine privée, jardin paysagé, cuisine équipée, WiFi haut débit. Parfait pour familles et groupes d\'amis.',
    category: 'Space',
    pricing: { amount: 2500, currency: 'MAD', priceType: 'per_day' },
    capacity: 8,
    duration: 1440,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Appartement Vue Mer - Essaouira',
    description: 'Appartement cosy avec vue panoramique sur l\'océan Atlantique. 2 chambres, balcon spacieux, proche de la médina et de la plage. Idéal pour couples et petites familles.',
    category: 'Space',
    pricing: { amount: 600, currency: 'MAD', priceType: 'per_day' },
    capacity: 4,
    duration: 1440,
    languages: ['Français', 'Anglais'],
  },
  {
    title: 'Dar Traditionnelle - Fès El Bali',
    description: 'Maison traditionnelle dans la vieille médina de Fès. Architecture authentique, 3 chambres, patio andalou, proche des souks et monuments historiques.',
    category: 'Space',
    pricing: { amount: 800, currency: 'MAD', priceType: 'per_day' },
    capacity: 6,
    duration: 1440,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Chalet de Montagne - Ifrane',
    description: 'Chalet en bois dans la "Suisse du Maroc". 3 chambres, cheminée, entouré de cèdres. Parfait pour escapade nature et ski en hiver.',
    category: 'Space',
    pricing: { amount: 1000, currency: 'MAD', priceType: 'per_day' },
    capacity: 6,
    duration: 1440,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Kasbah Restaurée - Ouarzazate',
    description: 'Kasbah authentique restaurée dans le désert. 4 chambres, terrasse avec vue sur les dunes, expérience unique au cœur du Sahara.',
    category: 'Space',
    pricing: { amount: 1500, currency: 'MAD', priceType: 'per_day' },
    capacity: 8,
    duration: 1440,
    languages: ['Français', 'Arabe', 'Anglais', 'Espagnol'],
  },
  {
    title: 'Studio Moderne - Rabat Centre',
    description: 'Studio meublé moderne en plein centre-ville. WiFi, climatisation, cuisine équipée. Idéal pour voyageurs d\'affaires et courts séjours.',
    category: 'Space',
    pricing: { amount: 400, currency: 'MAD', priceType: 'per_day' },
    capacity: 2,
    duration: 1440,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Salle de Réception - Casablanca Marina',
    description: 'Salle événementielle élégante avec vue sur la marina. Capacité 100 personnes, équipements audiovisuels, traiteur disponible. Pour mariages, séminaires, conférences.',
    category: 'Space',
    pricing: { amount: 5000, currency: 'MAD', priceType: 'per_day' },
    capacity: 100,
    duration: 480,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Espace Coworking - Marrakech Gueliz',
    description: 'Espace de coworking moderne avec bureaux privés, salles de réunion, WiFi fibre optique, cuisine partagée. Ambiance professionnelle et collaborative.',
    category: 'Space',
    pricing: { amount: 150, currency: 'MAD', priceType: 'per_day' },
    capacity: 20,
    duration: 480,
    languages: ['Français', 'Anglais'],
  },
  {
    title: 'Penthouse Luxe - Tanger Malabata',
    description: 'Penthouse de luxe avec terrasse panoramique sur le détroit de Gibraltar. 3 chambres, jacuzzi, design contemporain. Standing exceptionnel.',
    category: 'Space',
    pricing: { amount: 3000, currency: 'MAD', priceType: 'per_day' },
    capacity: 6,
    duration: 1440,
    languages: ['Français', 'Arabe', 'Anglais', 'Espagnol'],
  },
  {
    title: 'Ferme Éco-Responsable - Région d\'Agadir',
    description: 'Ferme écologique avec 4 gîtes indépendants. Production bio, animaux de ferme, activités nature. Expérience authentique et durable.',
    category: 'Space',
    pricing: { amount: 700, currency: 'MAD', priceType: 'per_day' },
    capacity: 12,
    duration: 1440,
    languages: ['Français', 'Arabe', 'Berbère'],
  },
  {
    title: 'Loft Artistique - Casablanca Quartier Habous',
    description: 'Loft spacieux décoré par des artistes locaux. Open space, hauteur sous plafond, lumière naturelle. Parfait pour créatifs et photographes.',
    category: 'Space',
    pricing: { amount: 900, currency: 'MAD', priceType: 'per_day' },
    capacity: 4,
    duration: 1440,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Camp de Luxe - Désert de Merzouga',
    description: 'Camp berbère de luxe dans les dunes de l\'Erg Chebbi. Tentes équipées, restaurant traditionnel, nuit sous les étoiles, excursions chamelières.',
    category: 'Space',
    pricing: { amount: 1800, currency: 'MAD', priceType: 'per_day' },
    capacity: 20,
    duration: 1440,
    languages: ['Français', 'Arabe', 'Anglais', 'Berbère'],
  },
  {
    title: 'Maison de Campagne - Vallée de l\'Ourika',
    description: 'Maison traditionnelle dans les montagnes de l\'Atlas. Vue sur la vallée, proximité cascades, randonnées. Calme et nature garantis.',
    category: 'Space',
    pricing: { amount: 650, currency: 'MAD', priceType: 'per_day' },
    capacity: 5,
    duration: 1440,
    languages: ['Français', 'Arabe', 'Berbère'],
  },
  {
    title: 'Appartement Duplex - Rabat Agdal',
    description: 'Duplex moderne 3 chambres dans quartier résidentiel calme. Balcon, parking, proche des commerces et transports.',
    category: 'Space',
    pricing: { amount: 750, currency: 'MAD', priceType: 'per_day' },
    capacity: 6,
    duration: 1440,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Riad Boutique - Tanger Médina',
    description: 'Petit riad intimiste avec 3 chambres. Décoration raffinée mêlant tradition et modernité. Terrasse avec vue sur le port.',
    category: 'Space',
    pricing: { amount: 1100, currency: 'MAD', priceType: 'per_day' },
    capacity: 6,
    duration: 1440,
    languages: ['Français', 'Arabe', 'Anglais', 'Espagnol'],
  },
  {
    title: 'Salle de Sport Privée - Casablanca',
    description: 'Salle de sport équipée à louer pour sessions privées. Machines cardio, musculation, espace yoga. Coach personnel disponible.',
    category: 'Space',
    pricing: { amount: 200, currency: 'MAD', priceType: 'per_hour' },
    capacity: 5,
    duration: 60,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Jardin Événementiel - Marrakech Palmeraie',
    description: 'Magnifique jardin de 2 hectares pour événements. Palmiers centenaires, bassin, espaces ombragés. Mariages, réceptions, shootings photos.',
    category: 'Space',
    pricing: { amount: 8000, currency: 'MAD', priceType: 'per_day' },
    capacity: 200,
    duration: 480,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Chambre d\'Hôtes - Chefchaouen',
    description: 'Chambre confortable dans maison traditionnelle bleue. Petit-déjeuner marocain inclus, vue sur les montagnes du Rif. Accueil chaleureux.',
    category: 'Space',
    pricing: { amount: 350, currency: 'MAD', priceType: 'per_day' },
    capacity: 2,
    duration: 1440,
    languages: ['Français', 'Arabe', 'Espagnol'],
  },
  {
    title: 'Bureau Privé - Tanger Free Zone',
    description: 'Bureau meublé dans zone franche de Tanger. Internet haut débit, salle de réunion partagée, services administratifs. Idéal entrepreneurs.',
    category: 'Space',
    pricing: { amount: 2000, currency: 'MAD', priceType: 'per_day' },
    capacity: 8,
    duration: 480,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
];

// Skills category services (Workshops & Lessons)
const skillsServices = [
  {
    title: 'Cours de Cuisine Marocaine Traditionnelle',
    description: 'Apprenez à préparer un menu complet marocain : tajine, couscous, pâtisseries. Marché traditionnel inclus, recettes à emporter. Cours de 4h avec chef expérimenté.',
    category: 'Skills',
    pricing: { amount: 450, currency: 'MAD', priceType: 'per_hour' },
    capacity: 6,
    duration: 240,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Atelier de Poterie Berbère',
    description: 'Initiation à la poterie traditionnelle berbère. Création de votre propre pièce (assiette, vase, tajine). Technique ancestrale, argile naturelle.',
    category: 'Skills',
    pricing: { amount: 300, currency: 'MAD', priceType: 'per_hour' },
    capacity: 8,
    duration: 180,
    languages: ['Français', 'Arabe', 'Berbère'],
  },
  {
    title: 'Cours de Calligraphie Arabe',
    description: 'Apprenez l\'art de la calligraphie arabe. Techniques du qalam, différents styles (Kufi, Thuluth, Naskh). Matériel fourni.',
    category: 'Skills',
    pricing: { amount: 250, currency: 'MAD', priceType: 'per_hour' },
    capacity: 10,
    duration: 120,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Atelier Mosaïque Zellige',
    description: 'Créez votre propre mosaïque marocaine. Technique du zellige traditionnel, coupe et assemblage. Repartez avec votre création.',
    category: 'Skills',
    pricing: { amount: 350, currency: 'MAD', priceType: 'per_hour' },
    capacity: 6,
    duration: 180,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Cours de Darija (Arabe Marocain)',
    description: 'Apprenez l\'arabe dialectal marocain avec professeur natif. Méthode conversationnelle, expressions du quotidien. Tous niveaux.',
    category: 'Skills',
    pricing: { amount: 200, currency: 'MAD', priceType: 'per_hour' },
    capacity: 4,
    duration: 60,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Atelier Tissage de Tapis',
    description: 'Découvrez l\'art du tissage de tapis berbères. Techniques traditionnelles, symboles et motifs. Démonstration et pratique.',
    category: 'Skills',
    pricing: { amount: 280, currency: 'MAD', priceType: 'per_hour' },
    capacity: 8,
    duration: 180,
    languages: ['Français', 'Arabe', 'Berbère'],
  },
  {
    title: 'Cours de Danse Orientale',
    description: 'Initiation à la danse orientale avec danseuse professionnelle. Mouvements de base, chorégraphie, musique traditionnelle.',
    category: 'Skills',
    pricing: { amount: 220, currency: 'MAD', priceType: 'per_hour' },
    capacity: 12,
    duration: 90,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Atelier de Henna Artistique',
    description: 'Apprenez l\'art du tatouage au henné. Motifs traditionnels et modernes, préparation du henné naturel. Pratique sur modèles.',
    category: 'Skills',
    pricing: { amount: 180, currency: 'MAD', priceType: 'per_hour' },
    capacity: 8,
    duration: 120,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Cours de Photographie - Architecture Marocaine',
    description: 'Workshop photo dans la médina. Techniques de composition, lumière naturelle, architecture traditionnelle. Tous niveaux.',
    category: 'Skills',
    pricing: { amount: 400, currency: 'MAD', priceType: 'per_hour' },
    capacity: 6,
    duration: 180,
    languages: ['Français', 'Anglais'],
  },
  {
    title: 'Atelier Maroquinerie Traditionnelle',
    description: 'Créez votre propre article en cuir (portefeuille, sac, ceinture). Techniques de tannerie et couture traditionnelles.',
    category: 'Skills',
    pricing: { amount: 320, currency: 'MAD', priceType: 'per_hour' },
    capacity: 6,
    duration: 240,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Cours d\'Oud (Luth Oriental)',
    description: 'Initiation à l\'oud avec musicien professionnel. Techniques de base, gammes arabes, morceaux traditionnels.',
    category: 'Skills',
    pricing: { amount: 300, currency: 'MAD', priceType: 'per_hour' },
    capacity: 4,
    duration: 60,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Atelier Peinture sur Soie',
    description: 'Créez un foulard ou tableau en soie. Techniques de fixation, dégradés de couleurs, motifs orientaux.',
    category: 'Skills',
    pricing: { amount: 260, currency: 'MAD', priceType: 'per_hour' },
    capacity: 8,
    duration: 150,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Cours de Pâtisserie Marocaine',
    description: 'Maîtrisez les secrets des pâtisseries orientales : chebakia, briouat, kaab ghazal, baklava. Recettes authentiques.',
    category: 'Skills',
    pricing: { amount: 350, currency: 'MAD', priceType: 'per_hour' },
    capacity: 8,
    duration: 180,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Atelier Bijoux en Argent',
    description: 'Création de bijoux en argent avec techniques berbères. Design, martelage, gravure. Repartez avec votre création unique.',
    category: 'Skills',
    pricing: { amount: 380, currency: 'MAD', priceType: 'per_hour' },
    capacity: 6,
    duration: 240,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Cours de Yoga sur Terrasse',
    description: 'Séance de yoga avec vue panoramique. Hatha yoga, pranayama, méditation. Atmosphère zen et authentique.',
    category: 'Skills',
    pricing: { amount: 150, currency: 'MAD', priceType: 'per_hour' },
    capacity: 15,
    duration: 90,
    languages: ['Français', 'Anglais'],
  },
  {
    title: 'Atelier Parfumerie Naturelle',
    description: 'Créez votre parfum personnel avec huiles essentielles marocaines. Rose, jasmin, cèdre, argan. Formation olfactive.',
    category: 'Skills',
    pricing: { amount: 400, currency: 'MAD', priceType: 'per_hour' },
    capacity: 8,
    duration: 120,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Cours de Surf - Essaouira',
    description: 'Leçons de surf avec instructeur certifié. Spot idéal pour débutants, planche et combinaison fournies. Vagues garanties!',
    category: 'Skills',
    pricing: { amount: 280, currency: 'MAD', priceType: 'per_hour' },
    capacity: 6,
    duration: 120,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Atelier Cosmétiques Naturels Marocains',
    description: 'Fabriquez vos produits de beauté : savon noir, gommage, huiles de massage. Ingrédients 100% naturels du Maroc.',
    category: 'Skills',
    pricing: { amount: 250, currency: 'MAD', priceType: 'per_hour' },
    capacity: 10,
    duration: 150,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Cours de Berbère (Tamazight)',
    description: 'Apprenez le berbère avec locuteur natif. Conversation, écriture tifinagh, culture amazighe. Tous niveaux bienvenus.',
    category: 'Skills',
    pricing: { amount: 200, currency: 'MAD', priceType: 'per_hour' },
    capacity: 6,
    duration: 60,
    languages: ['Français', 'Berbère'],
  },
  {
    title: 'Atelier Broderie Fassie',
    description: 'Découvrez la broderie traditionnelle de Fès. Techniques du point fassi, motifs géométriques et floraux. Projet personnel.',
    category: 'Skills',
    pricing: { amount: 230, currency: 'MAD', priceType: 'per_hour' },
    capacity: 8,
    duration: 180,
    languages: ['Français', 'Arabe'],
  },
];

// Connect category services (Cultural Experiences & Guided Tours)
const connectServices = [
  {
    title: 'Tour Guidé de la Médina de Fès',
    description: 'Visite guidée complète de Fès El Bali, la plus grande médina du monde. Souks, médersa Bou Inania, tanneries, palais. Guide historien officiel.',
    category: 'Connect',
    pricing: { amount: 350, currency: 'MAD', priceType: 'per_hour' },
    capacity: 10,
    duration: 240,
    languages: ['Français', 'Arabe', 'Anglais', 'Espagnol'],
  },
  {
    title: 'Excursion Cascades d\'Ouzoud',
    description: 'Journée aux cascades d\'Ouzoud (110m). Randonnée, baignade, observation des singes magots. Déjeuner berbère inclus. Transport aller-retour.',
    category: 'Connect',
    pricing: { amount: 500, currency: 'MAD', priceType: 'fixed' },
    capacity: 8,
    duration: 480,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Soirée Marocaine Traditionnelle',
    description: 'Dîner spectacle dans palais authentique. Menu 5 services, musiciens gnawa, danseuses, conteur. Ambiance des 1001 nuits.',
    category: 'Connect',
    pricing: { amount: 600, currency: 'MAD', priceType: 'fixed' },
    capacity: 30,
    duration: 180,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Randonnée Vallée du Paradis',
    description: 'Trekking dans la vallée du Paradis près d\'Agadir. Piscines naturelles, palmiers, oasis. Guide nature, pique-nique bio.',
    category: 'Connect',
    pricing: { amount: 400, currency: 'MAD', priceType: 'fixed' },
    capacity: 12,
    duration: 360,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Visite des Jardins Majorelle et Musée YSL',
    description: 'Tour guidé du jardin Majorelle et du musée Yves Saint Laurent. Histoire, botanique, architecture. Billets coupe-file inclus.',
    category: 'Connect',
    pricing: { amount: 250, currency: 'MAD', priceType: 'per_hour' },
    capacity: 15,
    duration: 120,
    languages: ['Français', 'Anglais'],
  },
  {
    title: 'Expédition 3 Jours Désert du Sahara',
    description: 'Circuit désert : Ouarzazate, gorges du Dadès, dunes de Merzouga. Nuits en camp berbère, méharée, coucher/lever de soleil. Tout inclus.',
    category: 'Connect',
    pricing: { amount: 2500, currency: 'MAD', priceType: 'fixed' },
    capacity: 8,
    duration: 4320,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Tour Culinaire Street Food - Marrakech',
    description: 'Découverte gastronomique de Jemaa el-Fna et souks. 10 dégustations authentiques. Guide foodie local, histoires et anecdotes.',
    category: 'Connect',
    pricing: { amount: 300, currency: 'MAD', priceType: 'per_hour' },
    capacity: 8,
    duration: 180,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Hammam & Spa Traditionnel',
    description: 'Rituel complet de hammam marocain. Gommage au savon noir, enveloppement ghassoul, massage aux huiles d\'argan. 3h de bien-être.',
    category: 'Connect',
    pricing: { amount: 450, currency: 'MAD', priceType: 'fixed' },
    capacity: 4,
    duration: 180,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Balade à Dos de Chameau - Palmeraie Marrakech',
    description: 'Promenade romantique en méharée dans la palmeraie. Coucher de soleil, thé à la menthe sous tente berbère. Photos mémorables.',
    category: 'Connect',
    pricing: { amount: 350, currency: 'MAD', priceType: 'per_hour' },
    capacity: 10,
    duration: 120,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Visite Privée des Tanneries de Fès',
    description: 'Accès VIP aux célèbres tanneries Chouara. Processus ancestral de tannage, vue panoramique. Visite atelier maroquinerie.',
    category: 'Connect',
    pricing: { amount: 200, currency: 'MAD', priceType: 'per_hour' },
    capacity: 6,
    duration: 90,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Quad dans le Désert d\'Agafay',
    description: 'Aventure quad dans le désert de pierres d\'Agafay. Paysages lunaires, villages berbères. Équipement et briefing sécurité inclus.',
    category: 'Connect',
    pricing: { amount: 500, currency: 'MAD', priceType: 'per_hour' },
    capacity: 8,
    duration: 120,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Tour des Souks et Artisans - Marrakech',
    description: 'Visite guidée des souks avec artisan local. Rencontre des maîtres artisans : menuisiers, ferronniers, teinturiers. Shopping intelligent.',
    category: 'Connect',
    pricing: { amount: 250, currency: 'MAD', priceType: 'per_hour' },
    capacity: 8,
    duration: 180,
    languages: ['Français', 'Arabe'],
  },
  {
    title: 'Cours de Thé à la Menthe avec Cérémonie',
    description: 'Apprenez l\'art de préparer le thé marocain. Cérémonie traditionnelle, histoire, dégustation de pâtisseries. Expérience authentique.',
    category: 'Connect',
    pricing: { amount: 150, currency: 'MAD', priceType: 'per_hour' },
    capacity: 10,
    duration: 90,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Randonnée Sommet Toubkal (4167m)',
    description: 'Ascension du plus haut sommet d\'Afrique du Nord. 2 jours/1 nuit, refuge, guide de montagne certifié. Vue exceptionnelle.',
    category: 'Connect',
    pricing: { amount: 1200, currency: 'MAD', priceType: 'fixed' },
    capacity: 8,
    duration: 2880,
    languages: ['Français', 'Arabe', 'Anglais', 'Berbère'],
  },
  {
    title: 'Visite Coopérative d\'Argan',
    description: 'Découverte du processus de production d\'huile d\'argan. Rencontre avec les femmes berbères, dégustation, achat équitable.',
    category: 'Connect',
    pricing: { amount: 180, currency: 'MAD', priceType: 'per_hour' },
    capacity: 15,
    duration: 120,
    languages: ['Français', 'Arabe', 'Berbère'],
  },
  {
    title: 'Croisière Coucher de Soleil - Tanger',
    description: 'Navigation dans le détroit de Gibraltar. Vue sur l\'Espagne, dauphins possibles. Boissons et tapas à bord. Moment magique.',
    category: 'Connect',
    pricing: { amount: 400, currency: 'MAD', priceType: 'per_hour' },
    capacity: 20,
    duration: 120,
    languages: ['Français', 'Arabe', 'Anglais', 'Espagnol'],
  },
  {
    title: 'Immersion Village Berbère - Atlas',
    description: 'Journée dans village berbère authentique. Vie locale, repas en famille, boulangerie communautaire, jardin en terrasses. Expérience humaine.',
    category: 'Connect',
    pricing: { amount: 450, currency: 'MAD', priceType: 'fixed' },
    capacity: 6,
    duration: 480,
    languages: ['Français', 'Arabe', 'Berbère'],
  },
  {
    title: 'Tour Architectural Art Déco - Casablanca',
    description: 'Visite guidée de l\'architecture Art Déco de Casablanca. Années 1920-30, façades remarquables, intérieurs préservés. Guide architecte.',
    category: 'Connect',
    pricing: { amount: 280, currency: 'MAD', priceType: 'per_hour' },
    capacity: 12,
    duration: 150,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
  {
    title: 'Safari Ornithologique - Souss Massa',
    description: 'Observation d\'oiseaux dans le parc national Souss-Massa. Ibis chauve, flamants roses. Jumelles et guide ornithologue inclus.',
    category: 'Connect',
    pricing: { amount: 350, currency: 'MAD', priceType: 'per_hour' },
    capacity: 8,
    duration: 240,
    languages: ['Français', 'Anglais'],
  },
  {
    title: 'Expérience Musicale Gnawa',
    description: 'Soirée avec musiciens gnawa. Histoire de cette musique spirituelle, instruments (guembri, qraqeb), participation interactive.',
    category: 'Connect',
    pricing: { amount: 300, currency: 'MAD', priceType: 'per_hour' },
    capacity: 20,
    duration: 120,
    languages: ['Français', 'Arabe', 'Anglais'],
  },
];

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    await connectDatabase();
    console.log('✅ Database connected\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create password hash
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create Admin User
    console.log('👤 Creating Admin user...');
    const admin = await User.create({
      email: 'admin@dkhoul.ma',
      password: hashedPassword,
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'DKHOUL',
        phone: '+212 600-000000',
        bio: 'Administrateur de la plateforme DKHOUL',
        languages: ['Français', 'Arabe', 'Anglais'],
        createdAt: new Date(),
      },
      emailVerified: true,
      notificationPreferences: {
        email: true,
        push: true,
        sms: false,
      },
    });
    console.log('✅ Admin created:', admin.email);

    // Create Regular Users (Clients)
    console.log('\n👥 Creating regular users...');
    const regularUsers = [];
    const firstNames = ['Youssef', 'Fatima', 'Mohammed', 'Amina', 'Rachid', 'Sanaa'];
    const lastNames = ['Alami', 'Bennani', 'Tazi', 'Fassi', 'Chaoui', 'Berrada'];
    
    for (let i = 0; i < 10; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const user = await User.create({
        email: `user${i + 1}@dkhoul.ma`,
        password: hashedPassword,
        role: 'tourist',
        profile: {
          firstName: firstName,
          lastName: lastName,
          phone: `+212 6${Math.floor(10000000 + Math.random() * 90000000)}`,
          bio: `Passionné de culture marocaine et de nouvelles expériences`,
          languages: ['Français', 'Arabe'],
          createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 90 days
        },
        emailVerified: true,
        notificationPreferences: {
          email: true,
          push: true,
          sms: false,
        },
      });
      regularUsers.push(user);
    }
    console.log(`✅ ${regularUsers.length} regular users created`);

    // Create Host Users (Service Providers)
    console.log('\n🏠 Creating host users...');
    const hosts = [];
    const hostNames = [
      { firstName: 'Hassan', lastName: 'Benjelloun' },
      { firstName: 'Zineb', lastName: 'Idrissi' },
      { firstName: 'Karim', lastName: 'Fassi-Fihri' },
      { firstName: 'Leila', lastName: 'Slaoui' },
      { firstName: 'Omar', lastName: 'Tazi' },
      { firstName: 'Nadia', lastName: 'Bouayad' },
      { firstName: 'Mehdi', lastName: 'Alaoui' },
      { firstName: 'Sophia', lastName: 'Benkirane' },
      { firstName: 'Amine', lastName: 'Lazrak' },
      { firstName: 'Salma', lastName: 'Cherkaoui' },
    ];

    for (let i = 0; i < 10; i++) {
      const host = await User.create({
        email: `host${i + 1}@dkhoul.ma`,
        password: hashedPassword,
        role: 'host',
        profile: {
          firstName: hostNames[i].firstName,
          lastName: hostNames[i].lastName,
          phone: `+212 6${Math.floor(10000000 + Math.random() * 90000000)}`,
          photo: `https://ui-avatars.com/api/?name=${hostNames[i].firstName}+${hostNames[i].lastName}&background=667eea&color=fff&size=200`,
          bio: `Professionnel expérimenté, passionné par le partage de la culture marocaine. Plus de ${Math.floor(3 + Math.random() * 7)} ans d'expérience dans le secteur du tourisme et de l'hospitalité.`,
          languages: ['Français', 'Arabe', 'Anglais'],
          createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
        },
        emailVerified: true,
        notificationPreferences: {
          email: true,
          push: true,
          sms: true,
        },
      });
      hosts.push(host);
    }
    console.log(`✅ ${hosts.length} host users created`);

    // Create Services
    console.log('\n🎯 Creating services...');
    const allServices = [...spacesServices, ...skillsServices, ...connectServices];
    const createdServices = [];

    for (let i = 0; i < allServices.length; i++) {
      const serviceData = allServices[i];
      const host = hosts[i % hosts.length]; // Distribute services among hosts
      const location = moroccanCities[Math.floor(Math.random() * moroccanCities.length)];
      
      // Generate 3-8 random photos for each service
      const photoCount = Math.floor(3 + Math.random() * 6);
      const photos = [];
      for (let j = 0; j < photoCount; j++) {
        photos.push(`https://source.unsplash.com/800x600/?morocco,${serviceData.category},${j}`);
      }

      const service = await Service.create({
        hostId: host._id,
        category: serviceData.category,
        title: serviceData.title,
        description: serviceData.description,
        photos: photos,
        pricing: serviceData.pricing,
        location: {
          type: 'Point',
          coordinates: location.coords,
          address: `${Math.floor(1 + Math.random() * 200)} Rue ${['des Artisans', 'de la Kasbah', 'du Souk', 'de la Médina', 'des Palmiers'][Math.floor(Math.random() * 5)]}`,
          city: location.city,
          region: location.region,
        },
        availability: generateAvailability(),
        capacity: serviceData.capacity,
        duration: serviceData.duration,
        languages: serviceData.languages,
        amenities: generateAmenities(serviceData.category),
        cancellationPolicy: 'Annulation gratuite jusqu\'à 48h avant. Remboursement à 50% entre 48h et 24h. Pas de remboursement moins de 24h avant.',
        rules: [
          'Respecter les horaires convenus',
          'Traiter l\'hôte et les lieux avec respect',
          'Suivre les consignes de sécurité',
        ],
        status: 'active',
        createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000), // Random date within last 6 months
        updatedAt: new Date(),
      });

      createdServices.push(service);
    }

    console.log(`✅ ${createdServices.length} services created`);
    console.log(`   - ${spacesServices.length} Spaces services`);
    console.log(`   - ${skillsServices.length} Skills services`);
    console.log(`   - ${connectServices.length} Connect services`);

    // Create sample bookings
    console.log('\n📅 Creating sample bookings...');
    const bookings = [];
    for (let i = 0; i < 15; i++) {
      const service = createdServices[Math.floor(Math.random() * createdServices.length)];
      const user = regularUsers[Math.floor(Math.random() * regularUsers.length)];
      const bookingDate = new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000); // Random date within next 60 days
      
      // Calculate pricing
      const baseAmount = service.pricing.amount;
      const serviceFee = Math.round(baseAmount * 0.1); // 10% service fee
      const totalAmount = baseAmount + serviceFee;
      
      const booking = await Booking.create({
        serviceId: service._id,
        touristId: user._id,
        hostId: service.hostId,
        bookingDate: bookingDate,
        timeSlot: {
          startTime: '09:00',
          endTime: service.pricing.priceType === 'per_hour' ? '11:00' : '17:00'
        },
        numberOfGuests: Math.floor(1 + Math.random() * Math.min(4, service.capacity)),
        pricing: {
          baseAmount: baseAmount,
          serviceFee: serviceFee,
          totalAmount: totalAmount,
          currency: service.pricing.currency
        },
        status: ['pending', 'confirmed', 'completed'][Math.floor(Math.random() * 3)] as 'pending' | 'confirmed' | 'completed',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
      bookings.push(booking);
    }
    console.log(`✅ ${bookings.length} sample bookings created`);

    // Create sample reviews
    console.log('\n⭐ Creating sample reviews...');
    const reviewComments = [
      'Expérience exceptionnelle ! Hautement recommandé.',
      'Très professionnel et accueillant. Je reviendrai sans hésiter.',
      'Magnifique découverte de la culture marocaine. Merci !',
      'Service impeccable, conforme à la description.',
      'Moment inoubliable, à faire absolument lors de votre visite.',
      'Excellent rapport qualité-prix. Guide très compétent.',
      'Une belle expérience authentique. Tout était parfait.',
      'Je recommande vivement ! Accueil chaleureux.',
    ];

    for (let i = 0; i < Math.min(25, bookings.length); i++) {
      const booking = bookings[i % bookings.length];
      const service = createdServices.find(s => s._id.toString() === booking.serviceId.toString());
      if (!service) continue;
      
      const overallRating = Math.floor(4 + Math.random() * 2); // 4-5 stars
      const expiresAt = new Date(booking.createdAt);
      expiresAt.setDate(expiresAt.getDate() + 90); // Reviews expire after 90 days
      
      const review = await Review.create({
        bookingId: booking._id,
        reviewerId: booking.touristId,
        revieweeId: booking.hostId,
        serviceId: service._id,
        reviewerType: 'tourist' as 'tourist',
        ratings: {
          overall: overallRating,
          communication: Math.floor(4 + Math.random() * 2),
          accuracy: Math.floor(4 + Math.random() * 2),
          value: Math.floor(4 + Math.random() * 2),
          cleanliness: service.category === 'Space' ? Math.floor(4 + Math.random() * 2) : undefined,
        },
        comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        photos: [],
        expiresAt: expiresAt,
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      });
    }
    console.log(`✅ ${Math.min(25, bookings.length)} sample reviews created`);

    // Final summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('\n📊 Summary:');
    console.log(`   ✅ 1 Admin user`);
    console.log(`   ✅ 10 Regular users (tourists)`);
    console.log(`   ✅ 10 Host users (service providers)`);
    console.log(`   ✅ 60 Services total:`);
    console.log(`      - 20 Spaces (Accommodations & Venues)`);
    console.log(`      - 20 Skills (Workshops & Lessons)`);
    console.log(`      - 20 Connect (Cultural Experiences)`);
    console.log(`   ✅ 15 Sample bookings`);
    console.log(`   ✅ 25 Sample reviews`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin:  admin@dkhoul.ma / password123');
    console.log('   Host:   host1@dkhoul.ma / password123');
    console.log('   User:   user1@dkhoul.ma / password123');
    console.log('\n✨ Your DKHOUL marketplace is ready to explore!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Helper function to generate availability for next 30 days
function generateAvailability() {
  const availability = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    availability.push({
      date: date,
      timeSlots: [
        { startTime: '09:00', endTime: '12:00', available: Math.random() > 0.3 },
        { startTime: '14:00', endTime: '17:00', available: Math.random() > 0.3 },
        { startTime: '18:00', endTime: '21:00', available: Math.random() > 0.3 },
      ],
    });
  }
  
  return availability;
}

// Helper function to generate amenities based on category
function generateAmenities(category: string): string[] {
  const spaceAmenities = ['WiFi', 'Climatisation', 'Cuisine équipée', 'Parking', 'Terrasse', 'TV', 'Machine à laver'];
  const skillsAmenities = ['Matériel fourni', 'Certificat', 'Pause café', 'Documentation', 'Photos incluses'];
  const connectAmenities = ['Transport inclus', 'Guide francophone', 'Repas inclus', 'Eau minérale', 'Assurance', 'Photos souvenirs'];
  
  let amenitiesList: string[] = [];
  if (category === 'Space') amenitiesList = spaceAmenities;
  else if (category === 'Skills') amenitiesList = skillsAmenities;
  else if (category === 'Connect') amenitiesList = connectAmenities;
  
  // Return 3-5 random amenities
  const count = Math.floor(3 + Math.random() * 3);
  return amenitiesList.sort(() => 0.5 - Math.random()).slice(0, count);
}

seedData();
