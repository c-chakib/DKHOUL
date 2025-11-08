# DKHOUL Platform - Complete Project Recreation Prompt
## 🚀 Production-Ready Marketplace - Investor & Demo Ready

## Executive Summary

**DKHOUL** is a fully-functional, production-ready digital marketplace platform that connects 40M+ annual tourists with local Moroccans offering authentic micro-services. This is not a prototype—it's a complete, sellable product with:

1. **Platform Demo** - Fully interactive marketplace with 35+ services, 100+ reviews, real booking flow
2. **Investor Pitch** - Professional 10-slide presentation with real metrics and projections
3. **Comprehensive Data** - Realistic services across 3 categories (Space, Skills, Connect)
4. **Professional UI/UX** - Modern design following Airbnb/Booking.com patterns
5. **Complete Features** - Search, filters, booking, messaging, host dashboard, admin capabilities

### The Business Model

**DKHOUL** (Arabic: "Entry/Access") bridges the gap between mass tourism and authentic local experiences in Morocco, creating economic opportunities for locals while offering tourists unforgettable cultural immersion.

**Target Market:**
- 14M tourists to Morocco annually (2023)
- Growing digital nomad community (50,000+ in Marrakech)
- Expatriates seeking local integration
- Business travelers needing flexible workspaces
- Cultural enthusiasts wanting authentic experiences

**Revenue Streams:**
1. **15% Commission** on all transactions
2. **Premium Host Subscriptions** - 99 DH/month for featured listings
3. **Advertising** - 200 DH/month for top placement  
4. **Value-Added Services** - Photography, translation, insurance

**Market Opportunity:**
- TAM (Total Addressable Market): 95B DH Moroccan tourism industry
- SAM (Serviceable Available Market): 8B DH micro-services segment by 2028
- SOM (Serviceable Obtainable Market): 400M DH target by Year 3

---

## Project Overview

Create **DKHOUL**, a complete digital marketplace platform connecting tourists with Moroccans offering micro-services. This is a dual-experience application with:
1. **Platform Demo** - Full interactive marketplace experience  
2. **Investor Pitch** - Professional presentation for investors

## Design System & Brand Identity

### Color Palette (Inspired by Moroccan Flag & Culture)
- **Primary Blue**: #2563EB - Represents trust, professionalism, Mediterranean sky
- **Success Green**: #059669 - Moroccan flag green, growth, confirmation
- **Accent Amber**: #F59E0B - Sahara desert, warmth, premium experiences
- **Supporting Colors:**
  - Terracotta: #DC8665 - Traditional pottery
  - Mint: #10B981 - Mint tea culture  
  - Sand: #F5F5F4 - Desert landscapes
  - Deep Red: #991B1B - Moroccan spices

### Brand Voice
- **Authentic** - Real local experiences, no tourist traps
- **Empowering** - Creating economic opportunities for Moroccans
- **Warm & Welcoming** - Moroccan hospitality (Diyafa)
- **Professional** - Trustworthy, secure, reliable
- **Culturally Rich** - Celebrating Moroccan heritage

### Typography
- Use default system fonts with proper hierarchy
- Do not add custom font-size, font-weight, or line-height classes unless specifically needed
- Rely on globals.css typography tokens
- Arabic text support for "DKHOUL" logo (دخول)

### Visual Elements
- Moroccan geometric patterns (zellige) as subtle backgrounds
- Gradient overlays on hero images (blue to green)
- Rounded corners (border-radius: 12px) for modern feel
- Elevation with shadows for card depth
- Hover animations (scale, shadow increase)

## Application Structure

### Entry Point: Gateway Landing Page

Create a stunning, professional landing page that impresses both users and investors:

**Page: GatewayLanding.tsx**

**Hero Section:**
- Full-height viewport with subtle animated Moroccan zellige pattern background
- Gradient overlay (from blue-600/20 to green-600/20)
- Large "DKHOUL" branding:
  - Arabic "دخول" (Entry) in elegant typography
  - Latin "DKHOUL" with gradient text effect
- Tagline: "La plateforme qui connecte touristes et locaux marocains"
- Subheadline: "40M de touristes × Expertise locale = Expériences authentiques"

**Dual Experience Cards (Side by Side):**

1. **"Explorer la Plateforme"** (Demo Experience)
   - Blue-to-green gradient background
   - Icon: Compass or MapPin
   - Preview stats:
     - "35+ services authentiques"
     - "500+ réservations complétées"
     - "4.9★ satisfaction moyenne"
   - Preview features list:
     - ✓ Cours de cuisine traditionnelle
     - ✓ Espaces coworking design
     - ✓ Guides locaux experts
   - CTA Button: "Découvrir" (primary blue)
   - Hover: Scale 1.02, shadow-2xl

2. **"Présentation Investisseurs"** (Pitch Experience)
   - Amber-to-orange gradient background  
   - Icon: TrendingUp or PieChart
   - Business metrics preview:
     - "400M DH opportunité marché"
     - "15% commission modèle"
     - "25M DH projection An 5"
   - Key points:
     - 📊 Modèle économique éprouvé
     - 🚀 Croissance +120% MoM
     - 💰 Levée de fonds: 5M DH
   - CTA Button: "Voir la présentation" (amber)
   - Hover: Scale 1.02, shadow-2xl

**Trust Indicators Section (Below Cards):**
- Logos partners: "Maroc Telecom", "CDG Invest", "Impact Lab", etc.
- Social proof: "Soutenu par Morocco Digital Hub"
- Certifications: "Startup Act certified"

**Animation & Interaction:**
- Fade-in animations on scroll
- Parallax effect on background pattern (subtle)
- Smooth transitions between hover states
- Particles.js or subtle floating elements (optional, Moroccan themed)

**Footer (Minimal):**
- © 2024 DKHOUL - Fait au Maroc 🇲🇦
- Links: Contact | LinkedIn | Pitch Deck
- Language selector: FR | EN | AR

---

## Comprehensive Mock Data Strategy

### Data Architecture

**IMPORTANT:** Create a `/data/mockData.ts` file containing ALL data for the platform. This ensures:
- Consistency across all pages
- Easy updates and maintenance
- Realistic, interconnected data
- Production-ready data structures

### Data Models

```typescript
// Services: 35+ complete service listings
interface Service {
  id, title, category, description, hostInfo,
  images[], location, price, rating, reviewCount,
  whatsIncluded[], availability, tags[], etc.
}

// Reviews: 100+ realistic reviews in French
interface Review {
  id, serviceId, user, rating, comment, date, helpful
}

// Bookings: 50+ bookings in various states
interface Booking {
  id, serviceId, clientInfo, date, status, amount
}

// Messages: Realistic conversation threads
interface Message {
  id, conversationId, sender, content, timestamp, read
}
```

### Service Distribution (35+ Services)

**DKHOUL Skills (15 services):**
- Cooking Classes (5): Tajine, Couscous, Pastilla, Bread, Vegan
- Language & Culture (3): Darija lessons, Calligraphy, Henné
- Arts & Crafts (5): Pottery, Weaving, Zellige, Leather, Argan
- Music (2): Oud, Gnawa percussion  
- Wellness (2): Yoga, Hammam
- Specialty (2): Perfume making, French-Moroccan pastry

**DKHOUL Space (10 services):**
- Coworking (4): Premium riad, Private office, Creative studio, Rooftop pool
- Storage (2): Luggage lockers, General storage
- Services (3): Shower facilities, Meeting rooms, Photo studio
- Other (1): Event space

**DKHOUL Connect (10 services):**
- Guided Tours (4): Medina/souks, Photography tour, Atlas mountains, Food tour
- Experiences (3): Desert safari, Vespa tour, Hammam experience
- Services (3): Personal shopper, Business consulting, Expat assistance

### Realistic Pricing Strategy

- **Skills - Cooking:** 200-450 DH per person (3-5 hours)
- **Skills - Workshops:** 250-380 DH per person (3-4 hours)
- **Skills - Language:** 150-270 DH per session (2-3 hours)
- **Space - Coworking:** 70-150 DH per day
- **Space - Services:** 30-300 DH per use
- **Connect - Tours:** 150-280 DH per person (2-4 hours)
- **Connect - Experiences:** 450-850 DH per person (full day/overnight)

### Host Profiles (20+ Diverse Hosts)

Create varied, realistic host profiles:
- **Demographics:** Mix of genders, ages (25-60), backgrounds
- **Languages:** Most speak French + Arabic, many speak English, some Spanish/Italian
- **Expertise:** Family traditions (3rd generation), Professional training, Hybrid
- **Tenure:** From 2023-02 to 2024-02 (spread across time)
- **Response:** 88% to 100% response rates, < 30min to < 8 hours response time
- **Verification:** Mix of verified (80%) and standard hosts
- **Superhost:** 40% of hosts are superhosts (high ratings + many bookings)

### Cities Coverage

- **Marrakech** (40% of services) - Tourist hub, most diverse offering
- **Fès** (20%) - Cultural capital, artisan crafts, cuisine
- **Casablanca** (15%) - Business city, coworking, modern experiences
- **Rabat** (10%) - Capital, language classes, expat services
- **Essaouira** (5%) - Coastal, argan, gnawa music
- **Other** (10%) - Safi, Azilal, Tétouan, Agadir

### Review Distribution (100+ Reviews)

- **5 stars:** 70% of reviews
- **4 stars:** 25% of reviews  
- **3 stars:** 5% of reviews
- **Average:** 4.89 across platform

**Review Content Guidelines:**
- Written in French primarily (70%), English (25%), Spanish/Italian (5%)
- 2-5 sentences each
- Specific details (names, dishes, places mentioned)
- Authentic language (not marketing copy)
- Mix of perspectives: solo travelers, couples, families, digital nomads
- Helpful count: 5-70 helpful votes per review

### Booking States

- **Confirmed** (50%): Payment completed, date upcoming
- **Pending** (25%): Awaiting host acceptance
- **Completed** (20%): Service delivered, can be reviewed
- **Cancelled** (5%): Cancelled by user or host

### Seasonal Considerations

- High season: October-April (more bookings, higher prices)
- Low season: May-September (fewer bookings, promotions)
- Current date context: November 2024 (peak season)

---

## FLOW 1: PLATFORM DEMO (9 Complete Pages)

### 1. Home Page (HomePage.tsx)

**Hero Section:**
- Large background image (Moroccan architecture/medina)
- Overlay gradient
- Heading: "Vivez le vrai Maroc avec des locaux authentiques"
- Subheading: "Cours de cuisine, espaces coworking, accompagnements... Découvrez plus de 500 expériences uniques"
- Advanced search bar with 4 fields:
  - Location (with MapPin icon): "Où?"
  - Date (with Calendar icon): "Quand?" (date picker)
  - Category dropdown: "Quoi?" (Space/Skills/Connect)
  - Search button with Search icon

**Categories Section (3 Cards):**

1. **DKHOUL Space** (Blue gradient)
   - Icon: Home
   - Title: "Espaces à louer"
   - Description: "Coworking, stockage bagages, douche..."
   - Price: "À partir de 50 DH/h"
   - Click navigates to Search with category filter

2. **DKHOUL Skills** (Green gradient)
   - Icon: Palette
   - Title: "Apprendre & Créer"
   - Description: "Cuisine, darija, artisanat, musique..."
   - Price: "À partir de 150 DH/session"

3. **DKHOUL Connect** (Amber gradient)
   - Icon: Handshake
   - Title: "Guides & Conseils"
   - Description: "Guide souk, conseils locaux, transport..."
   - Price: "À partir de 100 DH/h"

**Popular Services Grid (12 services minimum - use featured/popular from mockData):**

Each service card must have:
- High-quality image (use Unsplash tool)
- Category badge (color-coded: blue=Space, green=Skills, amber=Connect)
- Heart icon (favorite button with toast notification & state toggle)
- Service title (max 2 lines, truncate with ...)
- Host name with avatar (colored circle with initials)
- Star rating (★★★★★ visual) + review count in gray
- Price in DH (bold) + unit (smaller text)
- Location with MapPin icon (city)
- Hover effects: scale-105, shadow-xl, image zoom
- Click navigates to service detail with ID

**Priority Services (Pull from mockData.ts):**

Row 1 (Top Rated):
1. "Cours de Cuisine Tajine Traditionnel avec Marché Local" - Skills - Fatima El Amrani - 4.95★ (127) - 300 DH/pers - Fès
2. "Espace Coworking Design avec Vue sur Atlas" - Space - Sarah Alami - 4.97★ (156) - 80 DH/jour - Marrakech  
3. "Visite Guidée Privée des Souks et Médina" - Connect - Abdel Souiri - 4.98★ (243) - 180 DH/groupe - Marrakech
4. "Safari Désert: Nuit sous les Étoiles" - Connect - Hassan Ait Baha - 4.98★ (276) - 850 DH/pers - Zagora

Row 2 (Featured):
5. "Atelier Couscous Royal et Pâtisseries Marocaines" - Skills - Khadija Benani - 4.92★ (89) - 350 DH - Casablanca
6. "Atelier Poterie Berbère et Céramique" - Skills - Moha Amazigh - 4.87★ (72) - 320 DH - Safi
7. "Zellige: Art de la Mosaïque Marocaine" - Skills - Hassan Tazi - 4.94★ (81) - 340 DH - Fès
8. "Tour Photographique au Lever du Soleil" - Connect - Yasmine El Korti - 4.96★ (128) - 220 DH - Marrakech

Row 3 (Diverse):
9. "Cours de Darija Marocaine - Niveau Débutant" - Skills - Youssef Bennani - 4.96★ (143) - 200 DH/session - Rabat
10. "Consigne Bagages Sécurisée Centre-Ville" - Space - Hamza Moussaoui - 4.94★ (287) - 30 DH/bagage - Casablanca
11. "Excursion Montagnes Atlas & Villages Berbères" - Connect - Brahim Amazigh - 4.97★ (189) - 450 DH - Marrakech
12. "Coworking avec Rooftop Piscine" - Space - Yassine Alami - 4.96★ (214) - 150 DH/jour - Marrakech

**Loading Animation:**
- Skeleton cards while loading
- Smooth fade-in when data loads
- Lazy loading for images

**How It Works Section:**
- 3 steps with icons and descriptions
- "Trouvez" → "Réservez" → "Vivez l'expérience"

**Trust Section:**
- Statistics: "500+ services", "10,000+ réservations", "4.8★ moyenne"
- Trust badges: "Paiement sécurisé", "Service client 24/7", "Hôtes vérifiés"

**Host CTA Section:**
- "Devenez Host DKHOUL"
- Benefits list
- "Commencer" button → navigates to Host Dashboard

**Footer Component** (reusable across all pages):
- 4 columns: Brand, Services, Company, Contact
- Social media links (Facebook, Instagram, Twitter, LinkedIn)
- Links to all main pages
- Copyright: "© 2025 DKHOUL. Tous droits réservés."
- Legal links: Terms, Privacy, Legal
- Badge: "🇲🇦 Fait au Maroc"

---

### 2. Search & Results Page (SearchPage.tsx)

**Top Search Bar:**
- Sticky header with search input
- View toggle: Grid / List / Map icons
- Filter toggle button

**Left Sidebar Filters (collapsible):**

1. **Category** (checkboxes):
   - Space - Espaces à louer
   - Skills - Apprendre & Créer
   - Connect - Accompagnement

2. **Price Range** (slider):
   - Min: 50 DH, Max: 500 DH
   - Display current range values

3. **Instant Booking** (toggle switch)

4. **Rating** (star selector):
   - 5★, 4★+, 3★+, All

5. **Availability** (date picker)

6. **Languages** (checkboxes):
   - 🇫🇷 Français
   - 🇲🇦 العربية
   - 🇬🇧 English
   - 🇪🇸 Español

7. **Reset Filters** button (with toast notification)

**Results Area:**
- Header: "X services à Marrakech" + sorting dropdown
- Sorting: Pertinence, Prix croissant, Prix décroissant, Mieux notés
- Service cards in grid/list view (switchable)
- Each card shows: Image, Category badge, Heart button (favorite with toast), Title, Host, Duration, Location, Rating, Price
- 20+ realistic service listings

**Grid View**: 3 columns
**List View**: Full width cards with horizontal layout

Services must include variety:
- Cooking classes (tajine, couscous, pastilla, mint tea ceremony)
- Language lessons (Darija, Arabic calligraphy, French)
- Artisan workshops (pottery, zellige, leather, carpet weaving, argan oil)
- Music lessons (oud, gnawa, andalusian)
- Coworking spaces (various locations and amenities)
- Luggage storage, shower access, rest areas
- Tour guides (medina, souks, Atlas mountains, desert)
- Photography guides, shopping assistants
- Transportation help, local advice

---

### 3. Service Detail Page (ServiceDetailPage.tsx)

**Image Gallery:**
- Main large image + 4 thumbnail grid
- "Show all photos" button

**Service Header:**
- Title (e.g., "Cours de Cuisine Marocaine Traditionnelle")
- Category badge
- Location with MapPin icon
- Rating (4.9★) + review count (87 avis)
- Share button + Save button (heart with toast)

**Two Column Layout:**

**Left Column (Main Content):**

1. **Host Section:**
   - Avatar with name "Fatima Z."
   - Verified badge
   - Join date: "Host depuis 2023"
   - Response rate: "100%"
   - "Contacter" button

2. **Description:**
   - Rich text with paragraphs about the experience
   - What you'll do, what's included
   - "Lire plus" expandable section

3. **What's Included:**
   - Bullet list with CheckCircle icons:
     - All ingredients and cooking equipment
     - Recipe booklet to take home
     - Traditional Moroccan tea ceremony
     - Photos of your creations
     - Market visit (optional)

4. **Location Section:**
   - Map placeholder or description
   - "Médina de Fès - Emplacement exact partagé après réservation"

5. **Availability Calendar:**
   - Interactive calendar component
   - Available dates highlighted
   - Shows: "Disponible 6 jours / semaine"

6. **Reviews Section (87 reviews):**
   - Overall rating breakdown (5★: 75%, 4★: 20%, etc.)
   - Filter: Most recent, Highest rated, Lowest rated
   - 10+ detailed review cards:
     - User avatar + name
     - Rating stars
     - Date
     - Review text (2-4 sentences in French)
     - Helpful button

**Right Column (Booking Card - Sticky):**
- Price: "280 DH / personne"
- Date selector (calendar dropdown)
- Time selector (dropdown with available slots)
- Guest counter (stepper: - 1 +)
- "Réserver maintenant" button → navigates to booking
- Price breakdown:
  - 280 DH × 1 personne = 280 DH
  - Frais de service (15%) = 42 DH
  - Total: 322 DH
- "Vous ne serez débité qu'après confirmation"
- Cancellation policy: "Annulation gratuite 48h avant"

**Safety & Trust Section:**
- Icons with text:
  - Shield: "Paiement sécurisé"
  - CheckCircle: "Hôtes vérifiés"
  - MessageSquare: "Support 24/7"

**Similar Services Section:**
- "Vous pourriez aussi aimer"
- 4 service cards in horizontal scroll

---

### 4. Booking Flow (BookingFlow.tsx) - 3 Steps

**Progress Indicator:**
- Step 1: Details ━ Step 2: Payment ━ Step 3: Confirmation

**STEP 1: Booking Details**

- Service summary card (image, title, host, price)
- Date & Time confirmation (editable)
- Number of guests (stepper)
- Special requests (textarea): "Message pour l'hôte (optionnel)"
- Summary sidebar showing:
  - Check-in details
  - Pricing breakdown
  - Total amount
- Navigation: "Retour" (back to service) | "Continuer" (next step with toast)

**STEP 2: Payment**

- Payment method selection (cards):
  1. Credit/Debit Card (CreditCard icon) - Selected by default
  2. PayPal (icon)
  3. Mobile Money - Maroc Telecom / Orange Money (icon)

- Card payment form:
  - Card number (input with validation visual)
  - Expiry date (MM/YY)
  - CVV (3 digits)
  - Cardholder name

- Billing address:
  - Country dropdown
  - Postal code

- Checkboxes:
  - "Save this card for future bookings"
  - "I agree to the terms and conditions"

- Security badges:
  - SSL Encrypted
  - Secure payment by Stripe
  - Money-back guarantee

- Summary sidebar (same as step 1)
- Navigation: "Retour" (previous step) | "Confirmer et payer" (next step with success toast)

**STEP 3: Confirmation**

- Large success icon (CheckCircle2 with animation)
- "Réservation confirmée!" heading
- Booking reference number: #DKH-2024-001234
- Success message: "Vous recevrez un email de confirmation sous peu"

- Booking summary card:
  - Service name + image
  - Host name with "Contacter l'hôte" button
  - Date & time
  - Number of guests
  - Location
  - Total paid

- What's next section:
  - Timeline with icons:
    - "Confirmation envoyée à l'hôte"
    - "Recevez les détails par email"
    - "Rencontrez votre hôte le [date]"

- Action buttons:
  - "Voir mes réservations" (primary)
  - "Retour à l'accueil" (secondary)
  - "Ajouter au calendrier" (outline)

- Share section: "Partagez votre expérience"

---

### 5. Host Dashboard (HostDashboard.tsx)

**Header:**
- "Tableau de bord Host"
- "Bonjour, Fatima! 👋"
- Quick stats cards (4 across):
  - Total Earnings: "12,450 DH" (green, TrendingUp icon)
  - Active Listings: "3 services" (blue, Home icon)
  - Pending Bookings: "5 nouvelles" (amber, Calendar icon)
  - Rating: "4.9★ (87 avis)" (green, Star icon)

**Tabs Navigation:**
1. Vue d'ensemble (Overview)
2. Réservations (Bookings)
3. Services (Listings)
4. Revenus (Earnings)
5. Avis (Reviews)
6. Paramètres (Settings)

**TAB 1: Vue d'ensemble**

- **Revenue Chart** (Recharts line/bar chart):
  - Title: "Revenus des 6 derniers mois"
  - Monthly data: Jan-Jun 2024
  - Data: [1200, 1800, 2200, 1900, 2400, 2850] DH
  - Interactive tooltips

- **Bookings Chart** (Recharts area chart):
  - Title: "Réservations par mois"
  - Same months
  - Data: [8, 12, 15, 13, 17, 20] bookings

- **Upcoming Bookings Table:**
  - Columns: Date, Service, Client, Guests, Status, Amount, Actions
  - 5+ realistic bookings with different statuses:
    - "En attente" (amber badge)
    - "Confirmé" (green badge)
    - "Terminé" (gray badge)
  - Actions: View, Accept/Decline buttons

- **Quick Actions Cards:**
  - "Créer un nouveau service" (Plus icon)
  - "Gérer le calendrier" (Calendar icon)
  - "Voir les messages" (MessageSquare icon)
  - "Retirer des fonds" (CreditCard icon)

**TAB 2: Réservations**

- Filter bar: All / Pending / Confirmed / Completed / Cancelled
- Search by client name
- Date range filter

- **Bookings List** (10+ entries):
  Each booking card shows:
  - Booking ID: #DKH-2024-XXXXX
  - Date & time
  - Service name + thumbnail
  - Client info (avatar, name, guests count)
  - Status badge
  - Amount
  - Action buttons:
    - "Accepter" (green) - shows toast
    - "Refuser" (red) - shows toast
    - "Voir détails" (outline)
    - "Contacter" (outline)

**TAB 3: Services**

- "Créer un nouveau service" button (primary, top right)

- **Services Grid** (2-3 columns):
  
  Service Card 1: "Cours de cuisine tajine"
  - Image
  - Status badge: "Actif" (green)
  - Category: Skills
  - Price: 300 DH/session
  - Stats: 87 réservations, 4.9★
  - Toggle: Active/Inactive switch
  - Actions:
    - "Modifier" (Edit icon) - shows toast
    - "Dupliquer" (Copy icon) - shows toast
    - "Statistiques" (BarChart icon)
    - "Supprimer" (Trash icon) - shows confirmation

  Service Card 2: "Visite guidée médina"
  - Similar structure
  - Status: "Actif"
  - Category: Connect
  - Price: 150 DH/3h
  - 156 bookings, 5.0★

  Service Card 3: "Atelier poterie"
  - Status: "Inactif" (gray)
  - Category: Skills
  - Price: 250 DH
  - 93 bookings, 4.9★

**TAB 4: Revenus**

- **Summary Cards:**
  - Total earnings (all time): "45,890 DH"
  - This month: "2,850 DH"
  - Available to withdraw: "1,200 DH"
  - Next payout: "15 Nov 2024"

- **Revenue Chart** (detailed, by service):
  - Stacked bar chart
  - Shows revenue per service per month
  - Legend with colors

- **Transaction History Table:**
  - Columns: Date, Type, Description, Amount, Status
  - 20+ transactions:
    - "Réservation #DKH-2024-001234" - +280 DH - Completed
    - "Retrait vers compte bancaire" - -1000 DH - Processed
    - "Frais de service" - -42 DH - Completed
  - Pagination

- **Withdraw Funds Button:**
  - Opens dialog with bank account selection
  - Amount input
  - "Processing time: 2-3 business days"

**TAB 5: Avis**

- Overall rating display: Large 4.9★ with breakdown
- Filter: All services / By service dropdown
- Sort: Recent / Highest / Lowest

- **Reviews List** (20+ reviews):
  Each review:
  - Service name
  - Client avatar + name
  - Rating stars
  - Date
  - Review text (in French)
  - Response section:
    - Your response (if exists)
    - "Répondre" button → textarea appears
    - "Envoyer" button - shows toast

**TAB 6: Paramètres**

- **Profile Settings:**
  - Profile photo upload (with preview)
  - Full name
  - Email
  - Phone number
  - Location
  - Bio (textarea)
  - Languages spoken (multi-select)
  - "Sauvegarder" button - shows success toast

- **Bank Account:**
  - Account holder name
  - Bank name
  - IBAN
  - "Mettre à jour" button - shows toast

- **Availability:**
  - Weekly schedule grid
  - Toggle days on/off
  - Set hours for each day

- **Notifications:**
  - Toggles for:
    - Email notifications for new bookings
    - SMS alerts
    - Push notifications
    - Marketing emails
  - Each toggle shows toast on change

- **Security:**
  - Change password
  - Two-factor authentication toggle
  - Login history

---

### 6. Profile Page (ProfilePage.tsx)

**Profile Header:**
- Cover photo area
- Large avatar (center, overlapping)
- Name: "Fatima Zahra"
- Location: Fès, Maroc
- Member since: 2024
- Badges: "Superhost", "Verified ID"
- "Edit Profile" button (only when viewing own profile)

**Tabs:**
1. À propos (About)
2. Services (Listings)
3. Avis (Reviews)
4. Favoris (Favorites)

**TAB 1: À propos**

- **Bio Section:**
  - "Passionnée par la cuisine marocaine traditionnelle et le partage de notre culture avec les voyageurs du monde entier. Host sur DKHOUL depuis 2024."
  
- **Info Cards:**
  - Languages: Français, Arabe, Anglais
  - Response rate: 100%
  - Response time: < 1 hour
  - Email: fatima.zahra@gmail.com (with verified badge)
  - Phone: +212 6 12 34 56 78 (with verified badge)

- **Verification:**
  - List with CheckCircle icons:
    - ✓ Email verified
    - ✓ Phone verified
    - ✓ ID verified
    - ✓ Address verified

- **Stats:**
  - 3 services actifs
  - 250+ réservations
  - Host depuis 1 an

**TAB 2: Services**
- Grid of user's active services (3 cards)
- Same format as search results

**TAB 3: Avis**
- Reviews received as a host
- Format same as service detail reviews
- 87 total reviews

**TAB 4: Favoris**
- Grid of favorited services
- Empty state if no favorites: "Aucun favori pour le moment"

**Edit Profile Mode** (when "Edit" clicked):
- All fields become editable
- Image upload buttons
- "Annuler" and "Enregistrer" buttons
- Success toast on save

---

### 7. Messages Page (MessagesPage.tsx)

**Two-Column Layout:**

**Left Sidebar (Conversations List):**
- Search conversations input
- Filter tabs: All / Unread / Archived
- Conversation items (10+):
  - Avatar
  - Name
  - Last message preview (truncated)
  - Timestamp
  - Unread badge (count)
  - Active state highlight

Sample conversations:
1. Ahmed Z. - "Merci pour la visite..." - 5m ago - Unread: 2
2. Youssef B. - "La réservation est confirmée" - 1h ago
3. Khadija A. - "Je peux apporter mon appareil photo?" - 2h ago
4. Support DKHOUL - "Bienvenue sur DKHOUL!" - 1d ago
... and more

**Right Panel (Active Conversation):**

- **Header:**
  - Contact avatar + name
  - Status: "En ligne" (green dot) or "Vu il y a 2h"
  - Action buttons:
    - Phone call icon
    - Video call icon
    - More options (3 dots) → Archive, Block, Report

- **Message Thread:**
  
  Realistic conversation with alternating sender/receiver:
  
  ```
  [Them - Yesterday 14:23]
  "Bonjour! Je suis intéressé par votre cours de cuisine. Est-ce que c'est adapté pour les débutants?"
  
  [You - Yesterday 14:35]
  "Bonjour! Oui absolument, mon cours est parfait pour les débutants. Je vous guide étape par étape 😊"
  
  [Them - Yesterday 14:40]
  "Parfait! Est-ce que je peux venir avec un ami?"
  
  [You - Yesterday 14:42]
  "Oui bien sûr! Le prix est de 280 DH par personne."
  
  [Them - Today 09:15]
  "Génial! Je vais réserver pour 2 personnes pour samedi prochain."
  
  [You - Today 09:20]
  "Parfait! J'ai hâte de vous rencontrer! 🎉"
  ```

  - Each message bubble with:
    - Avatar (for received messages)
    - Text content
    - Timestamp
    - Read status (double checkmark)

  - Support for:
    - Text messages
    - Emoji
    - System messages (e.g., "Réservation confirmée #DKH-001234")
    - Booking cards embedded in chat

- **Message Input:**
  - Textarea that expands
  - Emoji picker button
  - Attach file button
  - Send button (paper plane icon)
  - "Typing..." indicator when other person is typing

- **Quick Actions** (above input):
  - "Envoyer dates disponibles"
  - "Partager position"
  - "Envoyer prix personnalisé"

**Empty State** (when no conversation selected):
- Icon and text: "Sélectionnez une conversation pour commencer"

---

### 8. Navigation Component (Navigation.tsx)

**Sticky header across all platform pages:**

**Desktop Layout:**
- Logo "DKHOUL" (left, clickable → home)
- Search bar (center):
  - "Rechercher des services..."
  - Search icon
- Right side menu:
  - "Devenir Host" link
  - Language selector (🇫🇷 FR ▼)
  - Notifications bell (with badge count)
  - Messages icon (with badge count)
  - User avatar dropdown:
    - "Mon profil"
    - "Mes réservations"
    - "Favoris"
    - "Paramètres"
    - Separator
    - "Tableau de bord Host" (if is host)
    - Separator
    - "Aide"
    - "Déconnexion"

**Mobile Layout:**
- Logo (left)
- Hamburger menu (right)
- Slide-out drawer with all navigation

**Bottom on all pages except confirmation:**
- Footer component

---

### 9. Admin Panel (Optional Enhancement)

Create an admin dashboard with:
- User management
- Service approvals
- Transaction monitoring
- Analytics
- Support tickets

---

## FLOW 2: INVESTOR PITCH (InvestorPitch.tsx)

**Professional slide-deck style presentation with compelling visuals and data:**

### Navigation & Controls

- Slide counter: "1 / 10" (bottom center)
- Previous / Next buttons (keyboard arrows supported)
- Progress bar (top, fills left to right)
- Slide indicator dots (clickable)
- "Retour au portail" button (top left, small)
- "Télécharger PDF" button (top right) - opens mock dialog
- Auto-advance option (timer icon) - 30s per slide
- Fullscreen mode toggle

### Slide 1: Cover / Title Slide

**Visual Design:**
- Full-screen background: Stunning Moroccan landscape (sunset over Atlas mountains)
- Dark gradient overlay (black opacity 50%)
- Centered content with animations (fade in, scale up)

**Content:**
- Logo: DKHOUL with Arabic "دخول" (large, white, glowing effect)
- Main Headline: "L'avenir du tourisme authentique au Maroc"
- Tagline: "Connecter 40 millions de touristes avec l'expertise locale marocaine"
- Value Prop: "Marketplace digital pour micro-services culturels et professionnels"

**Footer:**
- "Présentation Investisseurs • Novembre 2024"
- "Confidentiel"

**Animation:**
- Logo fades in (0.5s)
- Headline slides up (1s)
- Tagline fades in (1.5s)
- Background parallax effect on mouse move

### Slide 2: Le Problème / Market Pain Points

**Layout:** Split screen - Left: Problem, Right: Data visualization

**Header:** "Un Problème à 2 Milliards de Dirhams"

**Left Side - Pain Points (3 cards with icons):**

1. **Touristes Frustrés** 🧳
   - Icon: User-X (red circle)
   - "60% des touristes cherchent des expériences authentiques au-delà des hôtels"
   - "Mais tombent dans des pièges à touristes ou des arnaques"
   - Quote: *"Je voulais apprendre à cuisiner avec une vraie famille marocaine, pas dans un atelier touristique standardisé."* - Sophie, France

2. **Talents Locaux Sous-Exploités** 👨‍🍳
   - Icon: Briefcase (amber)
   - "Des milliers de Marocains ont des compétences/espaces uniques mais aucune visibilité"
   - "Revenus limités aux cercles personnels ou tourisme informel non sécurisé"
   - Quote: *"J'ai 20 ans d'expérience en cuisine traditionnelle mais je ne sais pas comment atteindre les touristes."* - Fatima, Fès

3. **Marché Fragmenté Sans Confiance** ⚠️
   - Icon: AlertTriangle (red)
   - "Pas de plateforme centralisée, sécurisée et moderne pour connecter l'offre et la demande"
   - "Transactions informelles sans garantie, assurance ou qualité vérifiée"
   - "Opportunités économiques perdues pour tout l'écosystème"

**Right Side - Market Data (Visual Charts):**

**Chart 1: Tourism Growth**
- Line chart showing tourism to Morocco
- 2019: 13M → 2023: 14.5M → 2028: 20M (projected)
- +38% growth in 5 years
- Source note: "Ministère du Tourisme, 2024"

**Chart 2: Experience Economy**
- Pie chart of tourist spending
- Accommodation: 35%
- Food & Dining: 25%
- **Experiences & Activities: 20%** (highlighted)
- Shopping: 15%
- Other: 5%

**Chart 3: Informal Market**
- Bar chart showing informal micro-services market
- Current: 2Mds DH
- Projected 2028: 5Mds DH
- **Opportunity: Digitize & Capture 20% = 1Md DH**

**Bottom Stats Bar:**
- 📊 14.5M touristes (2023)
- 💰 95Mds DH industrie touristique
- 🎯 60% veulent expériences locales authentiques
- 📈 Marché informel: 2Mds DH non-capturé

### Slide 3: La Solution DKHOUL / Product Overview

**Header:** "DKHOUL: Le Airbnb des Micro-Services Marocains"

**Main Value Proposition (Center, Large):**
"Plateforme digitale sécurisée connectant touristes et locaux pour des expériences authentiques et services pratiques"

**Product Screenshot Mockup (Center-Right):**
- Large, high-fidelity mockup of platform homepage
- Show on MacBook + iPhone (responsive design)
- Highlight key UI elements:
  - Search bar with "Cours de cuisine à Marrakech"
  - Service cards with ratings
  - Trust badges
  - Clean, modern interface

**Left Side - 3 Service Categories:**

1. **DKHOUL Skills** 🎨
   - Icon: Palette (green gradient circle)
   - "Apprendre & Créer"
   - Examples: Cuisine • Artisanat • Langue • Musique
   - "De la cuisine aux zellige, apprenez avec des experts locaux"
   - Metric: "150+ expériences culturelles"

2. **DKHOUL Space** 🏢
   - Icon: Home (blue gradient circle)
   - "Espaces & Services"
   - Examples: Coworking • Consigne • Douche • Réunion
   - "Espaces de travail, stockage et services pour nomades digitaux"
   - Metric: "50+ espaces disponibles"

3. **DKHOUL Connect** 🤝
   - Icon: Users (amber gradient circle)
   - "Guides & Conseils"
   - Examples: Tours • Shopping • Business • Assistance
   - "Expertise locale pour naviguer le Maroc comme un pro"
   - Metric: "100+ guides vérifiés"

**Key Platform Features (Bottom, 4 icons across):**

✓ **Paiement Sécurisé**
- Stripe integration
- Protection acheteur

✓ **Hôtes Vérifiés**
- ID + téléphone
- Reviews authentiques

✓ **Mobile-First**
- iOS & Android ready
- PWA installable

✓ **Multi-Langues**
- FR, EN, AR, ES
- Support 24/7

**Unique Differentiators (Right sidebar):**
- ⚡ Réservation instantanée
- 💬 Messagerie intégrée
- 📅 Calendrier synchronisé
- 🔔 Notifications temps-réel
- ⭐ Système de reviews
- 🛡️ Assurance incluse

### Slide 4: Modèle Économique / Business Model

**Header:** "Modèle de Revenus Multi-Stream Éprouvé"

**Layout:** Two columns

**Left Column - Revenue Streams (4 Cards):**

1. **Commission Transactions** 💳
   - "15% de commission sur chaque réservation"
   - Pricing: Host price + 15% service fee
   - Example: Cours 300 DH → Commission 45 DH
   - **Contribution: 70% des revenus**
   - Benchmark: "Standard marketplace (Airbnb: 14-16%, Fiverr: 20%)"

2. **Abonnements Hosts Premium** ⭐
   - "99 DH/mois pour les hosts professionnels"
   - Benefits:
     - Priorité dans résultats recherche
     - Badge "Pro" visible
     - Analytics avancées
     - Support prioritaire
     - 0 photos professionnelles gratuites
   - **Contribution: 15% des revenus**
   - Projection: "20% des hosts actifs s'abonnent (industry standard)"

3. **Featured Listings** 📢
   - "200-500 DH/mois pour mise en avant"
   - Placements:
     - Top de page recherche
     - Homepage carousel
     - Email promotionnel
   - Pay-per-click option: 2 DH par clic
   - **Contribution: 10% des revenus**

4. **Services à Valeur Ajoutée** 📸
   - Photography professionnelle: 800 DH
   - Traduction de profil: 200 DH
   - Assurance premium: 5% transaction
   - Formation hosts: 500 DH
   - **Contribution: 5% des revenus**

**Right Column - Financial Projections:**

**Chart 1: Revenue Projection (5 Years)**
- Beautiful bar chart with gradient colors
- Year 1 (2024): 500K DH
- Year 2 (2025): 2.5M DH (+400%)
- Year 3 (2026): 8M DH (+220%)
- Year 4 (2027): 16M DH (+100%)
- Year 5 (2028): 25M DH (+56%)
- CAGR: 148% (Compound Annual Growth Rate)

**Chart 2: Unit Economics (Per Transaction)**
- Average booking value: 350 DH
- Platform commission (15%): 52.5 DH
- Payment processing (2%): -7 DH
- Customer acquisition cost: -15 DH
- Contribution margin: 30.5 DH
- **Margin: 87% (after payment processing)**

**Key Metrics Table:**

| Metric | Year 1 | Year 3 | Year 5 |
|--------|--------|--------|--------|
| Active Hosts | 150 | 1,200 | 3,500 |
| Monthly Bookings | 200 | 2,500 | 8,000 |
| GMV (Gross Merch. Value) | 3M DH | 50M DH | 165M DH |
| Take Rate | 15% | 15% | 15% |
| **Revenue** | **500K** | **8M** | **25M** |

**Bottom - Competitive Positioning:**

"Notre take rate de 15% est optimal pour le marché marocain:"
- Plus bas qu'international (Airbnb 18-20%) → Plus attractif pour hosts
- Plus haut que concurrents locaux (10-12%) → Meilleure qualité de service
- Justifié par: Vérification, assurance, paiement sécurisé, marketing, support

**Call-out Box:**
"💡 Path to Profitability: Rentable dès Année 2 avec 2,000+ bookings/mois"

### Slide 5: Marché & Opportunité / Market Opportunity

**Header:** "Un Marché de 8 Milliards de Dirhams à Capturer"

**Visual: Market Sizing (TAM-SAM-SOM Funnel)**

```
┌─────────────────────────────────────────┐
│ TAM: 95Mds DH                           │ Tourisme Maroc (total)
│ Industrie touristique marocaine entière │
└─────────────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ SAM: 8Mds DH                     │ Micro-services & Expériences
│ Segment adressable (2028)        │ (Activités, Cours, Espaces)
└──────────────────────────────────┘
         ↓
┌────────────────────────┐
│ SOM: 400M DH           │ Notre objectif Year 3
│ 5% de part de marché   │ GMV (Gross Merchandise Value)
└────────────────────────┘
```

**Left Side - Market Dynamics:**

**Tourism Growth Drivers:**
📈 **+15% Annual Growth**
- Government strategy: 26M tourists by 2030
- New airports: Dakhla, Guelmim
- Rail expansion: TGV cities
- Digital nomad visas (introduced 2023)
- Increased European connectivity

**Demographic Shifts:**
🌍 **Target Segments**
1. **Millennials & Gen Z (45%)**
   - Age 25-40
   - Experience over possessions
   - Instagram-driven travel
   - Remote work lifestyle

2. **Expatriates (20%)**
   - 50,000+ in Morocco
   - Long-term needs
   - Coworking demand
   - Integration services

3. **Business Travelers (20%)**
   - MICE tourism growing
   - Short-term office needs
   - Authentic dining
   - Cultural activities

4. **Retirees & Families (15%)**
   - Educational experiences
   - Cultural immersion
   - Guided tours

**Market Trends:**
✓ Experience Economy boom (+20% CAGR globally)
✓ Sharing Economy normalization (Post-Airbnb era)
✓ Morocco = Hot destination (NYTimes, Lonely Planet top lists)
✓ Digital payments adoption in Morocco (+65% since 2020)
✓ Mobile-first population (72% smartphone penetration)

**Right Side - Competitive Landscape:**

**Comparison Table:**

| Critère | DKHOUL | GetYourGuide | Airbnb Exp. | Facebook Groups |
|---------|---------|---------------|-------------|-----------------|
| Focus Maroc | ✅ 100% | ⚠️ Global | ⚠️ Global | ❌ Non structuré |
| Micro-services | ✅ Oui | ⚠️ Tours only | ⚠️ Limité | ⚠️ Informel |
| Espaces | ✅ Oui | ❌ Non | ❌ Non | ❌ Non |
| Hosts locaux | ✅ Vérifiés | ⚠️ Agences | ⚠️ Peu | ❌ Non vérifiés |
| Langue FR/AR | ✅ Natif | ⚠️ Traduit | ⚠️ Traduit | ⚠️ Variable |
| Paiement DH | ✅ Local | ❌ EUR/USD | ❌ EUR/USD | ❌ Cash |
| Commission | 15% | 20-30% | 20% | 0% |
| Support local | ✅ 24/7 | ❌ Limité | ❌ Limité | ❌ Aucun |

**Competitive Advantages (Icons):**

🎯 **Hyper-Local Focus**
- Deep understanding of Moroccan market
- Culturally adapted UX
- Local payment methods
- Arabic language support

🏆 **Unique Positioning**
- Only platform combining Skills + Space + Connect
- Serving both tourists AND expats AND digital nomads
- Not just tours, but lifestyle services

💪 **First-Mover in Morocco**
- No direct competitor with this model
- Building network effects now
- Establishing brand as category leader

**Bottom - Market Entry Strategy:**

**Phase 1:** Marrakech + Fès (Q1-Q2 2024) ✅
**Phase 2:** Casablanca + Rabat + Essaouira (Q3-Q4 2024) 🔄
**Phase 3:** National coverage (2025) 📅
**Phase 4:** North Africa expansion (Tunisia, Egypt) (2026) 🌍

**Call-out Quote:**
*"Morocco is the next Portugal for digital nomads, and we're building the infrastructure they need."* - Remote Work Hub, 2024

### Slide 6: Traction & Metrics / Product-Market Fit

**Header:** "Croissance Explosive: +120% MoM depuis le Launch"

**Hero Metrics (Top, 4 Large Cards):**

1. **35 Services Actifs** 📊
   - +180% vs mois dernier
   - Across 3 categories
   - 15 Skills • 10 Space • 10 Connect
   - Target: 500 by end Q1 2025

2. **12,000 DH GMV** 💰
   - Gross Merchandise Value (November)
   - +215% MoM growth
   - Average booking: 320 DH
   - On track for 50K DH December

3. **127 Bookings Completed** ✅
   - Since launch (3 months)
   - 89% completion rate
   - 4.93★ average rating
   - 94% would recommend

4. **42 Verified Hosts** 👥
   - Carefully curated
   - 100% ID verified
   - 38% Superhosts
   - Retention: 95%

**Middle - Growth Charts (Side by Side):**

**Chart 1: Monthly Bookings Growth**
- Line chart with sharp upward trajectory
- August: 12 bookings (soft launch)
- September: 28 bookings (+133%)
- October: 56 bookings (+100%)
- November: 127 bookings (+127%)
- December (projected): 280 bookings (+120%)
- Exponential trendline overlay

**Chart 2: Revenue Growth (DH)**
- Bar chart with gradient fills
- August: 3,800 DH
- September: 9,200 DH
- October: 18,500 DH
- November: 42,000 DH
- December (projected): 95,000 DH
- Cumulative: 168,500 DH GMV in 4 months

**Key Performance Indicators (Table):**

| KPI | Current | Industry Benchmark | Status |
|-----|---------|-------------------|--------|
| Conversion Rate | 3.2% | 2-4% | ✅ On target |
| Average Basket | 320 DH | 250-400 DH | ✅ Strong |
| Host Retention | 95% | 80-85% | 🔥 Excellent |
| Customer LTV | 890 DH | 500-800 DH | 🔥 Excellent |
| CAC (Acq. Cost) | 48 DH | 60-100 DH | ✅ Efficient |
| LTV/CAC Ratio | 18.5x | >3x target | 🔥 Outstanding |
| NPS Score | 72 | 50+ good | 🔥 Excellent |
| Repeat Rate | 23% | 15-20% | ✅ Above average |

**Bottom Left - User Testimonials (3 Cards with Photos):**

1. **Sophie M., France** ⭐⭐⭐⭐⭐
   Photo: Woman smiling
   *"J'ai réservé 3 expériences différentes via DKHOUL. Chaque fois, c'était authentique, bien organisé et sécurisé. Je recommande à tous mes amis qui visitent le Maroc!"*
   - Booked: Cooking class, Pottery, Souk tour
   - Spent: 850 DH

2. **Alex T., USA** ⭐⭐⭐⭐⭐
   Photo: Man with laptop
   *"As a digital nomad, DKHOUL has been a game-changer. I found amazing coworking spaces and even a local guide who helped me set up my residency. Worth every dirham!"*
   - Booked: Coworking (15 days), Admin assistance
   - Spent: 1,550 DH

3. **Fatima Z., Host** ⭐⭐⭐⭐⭐
   Photo: Woman in kitchen
   *"Depuis que j'ai rejoint DKHOUL, j'ai accueilli plus de 40 étudiants pour mes cours de cuisine. La plateforme est simple, les paiements sécurisés, et l'équipe est toujours à l'écoute. Merci!"*
   - Hosted: 43 sessions in 2 months
   - Earned: 11,200 DH

**Bottom Right - Press & Recognition:**

**Media Coverage:**
📰 **Médias5** - "La startup qui réinvente le tourisme marocain"
📺 **2M TV** - Interview fondateur au JT (Octobre 2024)
💻 **Medias24** - "DKHOUL lève 500K DH en pre-seed"
🌐 **Morocco Tech News** - Featured in "10 Startups to Watch 2024"

**Awards & Accelerators:**
🏆 **Startup Morocco** - Lauréat 2024
🚀 **Morocco Digital Hub** - Portfolio company
🎓 **UM6P Ventures** - Mentorship program
🇲🇦 **Startup Act** - Certified

**Partnerships:**
✓ Maroc Telecom (payment integration)
✓ Royal Air Maroc (loyalty program discussions)
✓ Riads.com (cross-promotion)
✓ Coworking spaces network

**Social Proof:**
- Instagram: 2,400 followers (+500/month)
- Facebook: 1,800 likes
- Email list: 850 subscribers
- WhatsApp community: 120 active hosts

**Call-out Box:**
"🎯 Target for Q1 2025: 1,000 bookings/month = 320K DH GMV = 50K DH revenue"

### Slide 7: L'Équipe / The Team

**Header:** "Une Équipe Complémentaire avec Track Record Prouvé"

**Top Section - Core Team (3 Cards with Photos):**

1. **Youssef BENNANI** - CEO & Co-Founder
   Photo: Professional headshot (use placeholder or icon)
   
   **Background:**
   - 🎓 MBA from UM6P Business School
   - 💼 12 ans dans tech & tourisme digital
   - 🏢 Ex-Jumia Morocco (Senior Product Manager)
   - 🚀 Founded 2 startups (1 exit to Société Générale)
   - 🌍 Expert marketplace business models
   
   **Expertise:**
   - Product strategy & vision
   - Fundraising (raised 3M DH previously)
   - Growth hacking
   - Moroccan tech ecosystem
   
   **Quote:** *"J'ai vu comment Jumia a digitalisé le commerce au Maroc. DKHOUL fera la même chose pour le tourisme."*

2. **Sarah ALAMI** - CTO & Co-Founder
   Photo: Professional headshot
   
   **Background:**
   - 🎓 Engineering degree from ENSIAS
   - 💻 8 ans développement full-stack
   - 🏢 Ex-OCP Digital (Lead Developer)
   - 🔧 Expert React, Node.js, scalable architecture
   - 🏆 Won National Coding Championship 2018
   
   **Expertise:**
   - Platform architecture
   - Mobile app development
   - Payment systems integration
   - Team leadership (managed 6 devs)
   
   **Quote:** *"We're building enterprise-grade technology with startup speed."*

3. **Mehdi TAZI** - CMO & Co-Founder
   Photo: Professional headshot
   
   **Background:**
   - 🎓 Marketing degree from HEM
   - 📱 10 ans marketing digital & growth
   - 🏢 Ex-Booking.com Morocco (Marketing Manager)
   - 🎯 Grew Moroccan properties from 500 to 5,000
   - 📊 Expert in tourism industry & SEO
   
   **Expertise:**
   - Performance marketing (Google, Meta, TikTok)
   - Tourism industry insights
   - Content creation & branding
   - Community building
   
   **Quote:** *"Le tourisme marocain a besoin d'une transformation digitale. Nous la menons."*

**Middle Section - Extended Team:**

**Tech Team (4 Members):**
- 2 Full-stack Developers (React, Node.js)
- 1 Mobile Developer (React Native)
- 1 DevOps Engineer (AWS, CI/CD)

**Operations Team (3 Members):**
- 1 Host Success Manager (onboarding & support)
- 1 Customer Support (trilingual FR/AR/EN)
- 1 Content Creator (photos, videos, copywriting)

**Advisors & Board:**

1. **Dr. Hassan BENJELLOUN** - Strategic Advisor
   - Former Deputy Minister of Tourism
   - 30+ years in Moroccan tourism
   - Board member of Royal Air Maroc
   - Advising on government relations & partnerships

2. **Sophia ALAMI** - Tech Advisor
   - Founder of successful SaaS startup (exited for $12M)
   - Expert in scaling marketplaces
   - Mentor at Station F Paris
   - Advising on product & fundraising

3. **Karim LAHLOU** - Financial Advisor
   - CFO at major Moroccan VC fund
   - 15+ years in finance & investment
   - CFA charterholder
   - Advising on unit economics & fundraising

4. **Nadia FETTAH** - Marketing Advisor
   - CMO at leading Moroccan e-commerce
   - Expert in Moroccan digital marketing
   - 20 years experience
   - Advising on growth strategy

**Bottom Section - Why This Team?**

**Unique Strengths:**

✅ **Perfect Complementarity**
- Tech + Marketing + Product expertise
- All co-founders know Morocco deeply
- Proven track records in relevant industries
- Already worked together (Jumia alumni)

✅ **Skin in the Game**
- Full-time commitment from all 3 co-founders
- Bootstrapped to traction before fundraising
- Personal investments: 200K DH combined
- Vesting schedule: 4 years with 1-year cliff

✅ **Network & Credibility**
- Connected to all major tourism players
- Relationships with government (Ministère du Tourisme)
- Media access and PR capabilities
- Tech community respect (won awards)

✅ **Execution Proven**
- Launched MVP in 3 months
- Achieved traction in 4 months
- Built team of 10 in 6 months
- Already profitable unit economics

**Team Growth Plan:**

| Role | Q1 2025 | Q3 2025 | Q1 2026 |
|------|---------|---------|---------|
| Tech | 4 | 8 | 12 |
| Operations | 3 | 8 | 15 |
| Marketing | 1 | 3 | 6 |
| Management | 3 | 4 | 6 |
| **Total** | **11** | **23** | **39** |

**Call-out:**
💡 **70% of startup failures are due to team issues. This team has:**
- Worked together before (Jumia)
- Complementary skills with no overlap
- Moroccan market expertise
- Proven execution capability

### Slide 8: Stratégie Go-to-Market
- Phase 1: Marrakech & Fès (Q1-Q2 2024)
- Phase 2: Casablanca, Rabat, Agadir (Q3-Q4 2024)
- Phase 3: Expansion nationale (2025)
- Phase 4: Export du modèle (Tunisie, Égypte) (2026)
- Marketing channels: Instagram, TikTok, Partenariats hôtels

### Slide 9: Demande de Financement
- "Nous levons: 5M DH (Seed Round)"
- Use of funds pie chart:
  - 40% Tech & Product
  - 30% Marketing & Growth
  - 20% Operations
  - 10% Legal & Admin
- Projected milestones with funding
- Expected ROI timeline

### Slide 10: Vision & Impact
- Vision 2028: "#1 plateforme micro-services MENA"
- Social impact:
  - "Créer 10,000+ sources de revenus"
  - "Préserver culture marocaine"
  - "Tourisme durable"
- Call to action: "Rejoignez la révolution DKHOUL"
- Contact: invest@dkhoul.ma

**Navigation:**
- Previous/Next buttons on each slide
- Slide indicator dots at bottom
- "Retour au portail" button (top right)
- Smooth slide transitions

---

## Advanced Features for Production-Ready Platform

### Analytics & Tracking (Visual Only - No Real Implementation)

**Dashboard Metrics to Display:**
- Real-time booking counter
- Revenue tracking charts
- User engagement metrics
- Popular services analytics
- Geographic heat maps
- Conversion funnel visualization

### Multi-Currency Support (Display)

- Primary: Moroccan Dirham (DH / MAD)
- Show conversions: EUR, USD, GBP (with disclaimer)
- Auto-detect based on browser locale
- Currency selector in header

### Advanced Search Features

**Auto-complete:**
- As user types, suggest:
  - Service names
  - Categories
  - Cities  
  - Popular searches

**Smart Filters:**
- Save filter preferences
- "Similar to what you liked"
- "Popular in [Your City]"
- "Available this weekend"

**Search History:**
- Recent searches (stored in localStorage)
- Quick access to previous queries

### Social Features

**Share Functionality:**
- Share service on Facebook, Twitter, WhatsApp
- Copy link with success toast
- QR code generation for services
- Email service to friend

**Wishlist / Favorites:**
- Heart button on all service cards
- Favorites page in profile
- Count badge on header
- Sync across sessions (localStorage)
- Export wishlist as PDF

### Trust & Safety Elements

**Verification Badges:**
- ✓ Email verified
- ✓ Phone verified
- ✓ ID verified (government ID)
- ✓ Address verified
- ⭐ Superhost badge
- 🏆 Top-rated badge (4.9+)

**Safety Information:**
- COVID-19 safety measures
- Cancellation policies clearly displayed
- Insurance information
- Emergency contact numbers
- Report inappropriate content

**Secure Payment Indicators:**
- SSL encryption badge
- Stripe/PayPal logos
- Money-back guarantee
- PCI DSS compliant (displayed)
- "We never share your payment info" message

### Personalization Engine

**User Preferences:**
- Preferred language (FR/EN/AR/ES)
- Preferred currency
- Preferred categories
- Price range preferences
- Accessibility needs

**Recommendations:**
- "Because you viewed..." carousel
- "Guests who booked X also booked Y"
- "Complete your experience" suggestions
- Seasonal recommendations

### Mobile Optimization

**Progressive Web App (PWA) Features:**
- Add to home screen prompt
- Offline mode message
- Install app CTA
- Mobile-specific navigation (bottom tabs)

**Mobile Gestures:**
- Swipe between images
- Pull to refresh
- Swipe to delete (in messages)
- Pinch to zoom (in photos)

### Accessibility (WCAG 2.1 AA)

- Keyboard navigation support
- Screen reader friendly
- Alt text for all images
- Color contrast compliance
- Focus indicators
- Skip to content links
- ARIA labels

### Performance Optimizations

**Loading States:**
- Skeleton screens for content
- Progressive image loading
- Lazy load below fold
- Infinite scroll for search results

**Caching Strategy:**
- Cache service data (localStorage)
- Image optimization
- Debounced search inputs
- Memoized components

### Internationalization (i18n) Display

**Languages:**
- French (primary)
- English (secondary)
- Arabic (محلي)
- Spanish (tourist market)

**Localized Content:**
- Date formats (DD/MM/YYYY for FR, MM/DD/YYYY for EN)
- Time formats (24h vs 12h)
- Number formats (1 000,00 vs 1,000.00)
- Currency symbols

### Email Notifications (Mock Templates Display)

**Transactional Emails:**
- Booking confirmation
- Host acceptance notification
- Payment receipt
- Review reminder
- Cancellation confirmation

**Marketing Emails:**
- Weekly deals
- Personalized recommendations
- Host newsletter
- Seasonal promotions

### Customer Support Features

**Help Center:**
- FAQs (20+ questions)
- How-to guides
- Video tutorials
- Contact form

**Live Chat Widget:**
- Chat bubble (bottom right)
- Auto-responses
- Business hours indicator
- Average response time

### Legal & Compliance

**Required Pages (Links in Footer):**
- Terms of Service
- Privacy Policy
- Cookie Policy
- Refund Policy
- Community Guidelines
- Host Terms
- Insurance Information

**GDPR Compliance:**
- Cookie consent banner
- Data privacy notice
- Right to erasure
- Data export capability

### Gamification Elements

**User Achievements:**
- "First Booking" badge
- "Adventurer" (5 bookings)
- "Culture Enthusiast" (3 Skills experiences)
- "Digital Nomad" (10 coworking days)

**Host Milestones:**
- First review celebration
- 10 bookings milestone
- Superhost achievement
- Revenue milestones

**Referral Program (Display):**
- "Refer a friend, get 50 DH credit"
- Unique referral code
- Tracking dashboard
- Rewards progress bar

### Admin Features (Optional Admin Panel)

**Content Management:**
- Approve/reject new services
- Featured service selection
- Content moderation
- Bulk operations

**User Management:**
- View all users
- Host verification
- Suspend/ban users
- Impersonate for support

**Analytics:**
- Revenue reports
- User growth charts
- Service performance
- Geographic distribution

**System Health:**
- Uptime monitoring display
- Error logs
- Performance metrics
- Database stats

---

## Technical Requirements

### State Management
- Use React useState for local state
- Pass navigation function as props
- Store current page in App.tsx state
- Use localStorage for favorites, search history, user preferences
- Context API for global state (optional enhancement)

### Navigation Flow
```typescript
type Page = 
  | 'gateway' 
  | 'investor-pitch'
  | 'platform-home'
  | 'search'
  | 'service-detail'
  | 'booking'
  | 'host-dashboard'
  | 'profile'
  | 'messages';

const handleNavigate = (page: Page, data?: any) => {
  setCurrentPage(page);
  setPageData(data);
  window.scrollTo(0, 0);
};
```

### Components to Create

**UI Components** (use Shadcn/ui):
- Button, Card, Badge, Input, Select, Checkbox, Slider
- Calendar, Tabs, Avatar, Separator, Switch
- Dialog, Sheet, Dropdown Menu, Tooltip
- Toast notifications (Sonner)

**Custom Components:**
- Navigation.tsx (header with search & user menu)
- Footer.tsx (site footer)
- ServiceCard.tsx (reusable service listing card)
- BookingCard.tsx (booking summary)
- ReviewCard.tsx (review display)
- StatCard.tsx (dashboard statistics)

### Icons
- Use lucide-react for all icons
- Examples: Search, MapPin, Calendar, Star, Heart, Home, User, MessageSquare, etc.

### Images
- Use unsplash_tool for all photos
- Search terms examples:
  - "Moroccan cooking tagine"
  - "Moroccan medina architecture"
  - "coworking space modern"
  - "Moroccan local people craft"
  - "Moroccan traditional pottery"
  - "Moroccan market souk"

### Charts
- Use Recharts library for all charts in Host Dashboard and Investor Pitch
- Line charts, Bar charts, Area charts, Pie charts

### Notifications
- Use toast from 'sonner@2.0.3'
- Show toasts for:
  - Add/remove favorites
  - Filter applications
  - Booking confirmations
  - Form submissions
  - Accept/decline bookings
  - Profile updates

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid adjustments: 1 col mobile → 2-4 cols desktop
- Hamburger menu on mobile
- Stack layouts vertically on mobile

### Data
- Include 20+ services with variety across all categories
- 10+ message conversations
- 10+ bookings in different states
- 20+ reviews with realistic French content
- Transaction history
- Multiple hosts with profiles

### Interactions
- All buttons functional with proper navigation
- Toast notifications on user actions
- Hover effects on cards
- Active states on navigation
- Loading states (optional)
- Form validation (visual feedback)
- Favorite button toggles
- Modal dialogs for confirmations

### Styling Notes
- Use Tailwind utility classes
- No custom font sizes unless critical
- Consistent spacing scale (p-4, p-6, gap-4, gap-6)
- Color classes: bg-primary, text-primary, bg-muted, text-muted-foreground
- Border radius: rounded-lg, rounded-xl
- Shadows: shadow-md, shadow-xl
- Transitions: transition-all, hover:scale-105

---

## File Structure

```
/App.tsx (main router)
/components
  /GatewayLanding.tsx
  /investor
    /InvestorPitch.tsx
  /platform
    /Navigation.tsx
    /Footer.tsx
    /HomePage.tsx
    /SearchPage.tsx
    /ServiceDetailPage.tsx
    /BookingFlow.tsx
    /HostDashboard.tsx
    /ProfilePage.tsx
    /MessagesPage.tsx
  /ui (Shadcn components)
  /figma
    /ImageWithFallback.tsx
/styles
  /globals.css
```

---

## Implementation Priority

1. **Phase 1 - Core Flow:**
   - App.tsx with routing
   - GatewayLanding
   - Navigation & Footer
   - HomePage with search and services
   - SearchPage with filters
   - ServiceDetailPage

2. **Phase 2 - Booking:**
   - BookingFlow (3 steps)
   - Toast notifications throughout

3. **Phase 3 - Host Features:**
   - HostDashboard with all tabs
   - ProfilePage
   - MessagesPage

4. **Phase 4 - Investor:**
   - InvestorPitch with all slides

5. **Phase 5 - Polish:**
   - Responsive refinements
   - Animations
   - Loading states
   - Error handling

---

## Final Checklist

✅ Dual entry point (Gateway)
✅ Complete platform demo (9 pages)
✅ Complete investor pitch (10 slides)
✅ Navigation works between all pages
✅ All buttons functional
✅ Toast notifications on actions
✅ Favorite system works
✅ Filters apply properly
✅ Responsive on mobile/tablet/desktop
✅ 100+ realistic data items
✅ Charts in dashboard
✅ Real-time messaging UI
✅ Multi-step booking flow
✅ Footer on all pages
✅ French language throughout
✅ Moroccan theme/branding
✅ Professional investor presentation

---

## Success Criteria

The final application should be:
1. **Complete**: All 9+ pages fully functional
2. **Interactive**: Every button, link, and form works
3. **Professional**: Production-ready UI/UX
4. **Realistic**: Rich data that feels authentic
5. **Responsive**: Works perfectly on all devices
6. **Engaging**: Smooth animations and feedback
7. **Dual-purpose**: Both demo and pitch are compelling

This is a portfolio-worthy, investor-ready, and fully functional marketplace platform prototype.
