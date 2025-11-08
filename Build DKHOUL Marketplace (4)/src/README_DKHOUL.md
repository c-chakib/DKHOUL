# DKHOUL - Marketplace Touristique Marocaine

## 🎯 Vue d'ensemble

DKHOUL est une plateforme marketplace innovante qui permet aux Marocains de monétiser leurs espaces, compétences et temps en offrant des micro-services aux 15 millions de touristes qui visitent le Maroc chaque année.

## 🚀 Structure du Projet

Le projet comporte **deux expériences distinctes** accessibles depuis une page d'accueil (Gateway):

### 1. **Page Gateway** (Point d'entrée)
- Page d'accueil qui présente les deux options
- Permet de choisir entre:
  - **Explorer la Plateforme** → Démo interactive de la marketplace
  - **Voir le Pitch Investisseur** → Dossier pour investisseurs

### 2. **Plateforme Demo** (Expérience Utilisateur)
Pages disponibles:
- ✅ **Home Page** - Hero avec recherche, catégories (Space/Skills/Connect), services populaires, témoignages
- ✅ **Search Page** - Filtres avancés (catégories, prix, date, notes, langues) et résultats paginés
- ✅ **Service Detail** - Page complète avec galerie photos, profil host, avis détaillés, et sidebar réservation
- ✅ **Booking Flow** - Processus complet en 3 étapes (Détails, Paiement, Confirmation) avec récapitulatif
- ✅ **Host Dashboard** - Tableau de bord avec stats, graphiques revenus, gestion services, réservations et avis
- ✅ **Profile** - Profil utilisateur avec infos, badges vérification, avis reçus, favoris et paramètres
- ✅ **Messages** - Messagerie complète avec conversations, chat temps réel, pièces jointes

### 3. **Investor Pitch** (Dossier Investisseur)
Sections complètes:
- ✅ **Hero** - Résumé de l'opportunité (500K DH recherchés)
- ✅ **Problème** - Concentration des revenus touristiques
- ✅ **Solution** - Les 3 catégories DKHOUL (Space, Skills, Connect)
- ✅ **Marché** - 15M touristes, événements majeurs (Coupe du Monde 2030)
- ✅ **Business Model** - Commission 20%, sources de revenus
- ✅ **Projections Financières** - Graphiques de croissance sur 5 ans
- ✅ **Impact Social** - Création d'opportunités pour les Marocains

## 🎨 Charte Graphique

### Couleurs Principales
- **Primary** (Bleu): `#2563EB` - Confiance, Tourisme
- **Secondary** (Vert): `#059669` - Authenticité, Local
- **Accent** (Ambre): `#F59E0B` - Chaleur marocaine

### Typographie
- Titres: Poppins (Bold/Semi-Bold)
- Texte: Inter (Regular/Medium)
- Tailles: H1 (32-48px), H2 (24-32px), Body (16px)

## 📊 Données Clés

### Marché
- **15M** touristes/an au Maroc
- **+12%** croissance annuelle
- **100B DH** marché touristique total

### Projections (5 ans)
- Année 1: 720K DH revenus | 50 Hosts
- Année 2: 4.3M DH revenus | 200 Hosts
- Année 3: 18M DH revenus | 500 Hosts
- Année 4: 54M DH revenus | 1200 Hosts
- Année 5 (2030): **100M+ DH** revenus | 2000 Hosts

### Business Model
- **20%** commission par transaction
- Panier moyen: **180 DH**
- **12** transactions/mois par Host

## 🧭 Navigation

### Depuis n'importe quelle page:

**Gateway ⟷ Platform Demo**
- Logo DKHOUL → Retour à la page d'accueil de la section actuelle
- Menu utilisateur → "Retour à l'accueil" pour revenir au Gateway
- Footer → Lien "DKHOUL" pour retour au Gateway

**Gateway ⟷ Investor Pitch**
- Navigation interne avec ancres (#problem, #solution, #market, etc.)
- Header sticky avec boutons "Voir la Démo" et "Contact"
- Bouton "Explorer la Plateforme" en bas de page

**Platform ⟷ Investor Pitch**
- Menu navigation → Bouton "Investisseurs"
- Footer → Lien "Investisseurs"

## 🛠️ Technologies Utilisées

- **React** - Framework UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI
- **Recharts** - Graphiques financiers
- **Lucide React** - Icônes

## 📦 Structure des Fichiers

```
/
├── App.tsx                          # Routing principal
├── components/
│   ├── GatewayLanding.tsx          # Page d'accueil (choix)
│   ├── investor/
│   │   └── InvestorPitch.tsx       # Dossier investisseur complet
│   ├── platform/
│   │   ├── Navigation.tsx          # Header de la plateforme
│   │   ├── HomePage.tsx            # Page d'accueil marketplace
│   │   ├── SearchPage.tsx          # Recherche et filtres
│   │   └── ServiceDetailPage.tsx  # Détail d'un service
│   └── ui/                          # Composants shadcn/ui
└── styles/
    └── globals.css                  # Variables CSS et thème
```

## 🎯 Cas d'Usage

### Pour un Investisseur
1. Accède au site → **Gateway Landing**
2. Clique "Voir le Pitch" → **Investor Pitch**
3. Navigue dans les sections (problème, solution, marché, financials)
4. Clique "Explorer la Plateforme" pour voir la démo
5. Télécharge le pitch deck ou demande un RDV

### Pour un Utilisateur Potentiel (Touriste/Host)
1. Accède au site → **Gateway Landing**
2. Clique "Voir la Démo" → **Platform Home**
3. Utilise la recherche → **Search Page**
4. Sélectionne un service → **Service Detail**
5. Consulte le profil du Host, les avis, et peut réserver

### Pour un Journaliste/Analyste
1. Accède au site → **Gateway Landing**
2. Lit le contexte et les stats clés
3. Explore les deux faces du projet:
   - Démo pour comprendre l'UX
   - Pitch pour comprendre le business

## 🚀 Évolutions Futures

### Pages développées ✅:
- [x] Booking Flow (3 étapes: détails, paiement, confirmation)
- [x] Host Dashboard (stats, revenus, services, calendrier)
- [x] User Profile (profil, vérifications, paramètres)
- [x] Messaging System (chat temps réel)

### Pages à développer:
- [ ] Create Service Form (formulaire multi-étapes pour hosts)
- [ ] Admin Dashboard (modération, analytics, gestion utilisateurs)

### Fonctionnalités:
- [ ] Authentification utilisateur
- [ ] Paiement en ligne (intégration CMI/Stripe)
- [ ] Système de notation et avis
- [ ] Notifications en temps réel
- [ ] Support multilingue (FR/AR/EN)
- [ ] Mode RTL pour l'arabe
- [ ] Upload photos pour Hosts
- [ ] Calendrier de disponibilités
- [ ] Géolocalisation et carte interactive

## 💡 Points Forts

✅ **Dual Experience** - Platform demo + Investor pitch dans une seule app
✅ **Design Moderne** - Interface clean inspirée d'Airbnb/Booking.com
✅ **Pages Complètes** - Toutes les pages principales avec données réalistes
✅ **Data Visualization** - Graphiques financiers interactifs (Recharts)
✅ **Booking Flow Complet** - Processus de réservation en 3 étapes fonctionnel
✅ **Dashboard Professionnel** - Stats, graphiques, gestion complète pour hosts
✅ **Messaging System** - Chat fonctionnel avec conversations et historique
✅ **Mobile Responsive** - Adapté à tous les écrans
✅ **Moroccan Touch** - Couleurs et patterns culturels authentiques
✅ **Component Library** - shadcn/ui pour cohérence et qualité
✅ **Production Ready** - Code propre, componentisé et réutilisable

## 📞 Contact

Pour toute question concernant le projet DKHOUL:
- **Email**: contact@dkhoul.ma
- **Pitch Deck**: Téléchargeable depuis la page Investor Pitch
- **Démo Live**: Accessible via le Gateway

---

**© 2025 DKHOUL - Tous droits réservés**
