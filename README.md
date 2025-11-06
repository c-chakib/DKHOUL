# 🏛️ DKHOUL - Plateforme Marketplace de Micro-Services Touristiques

<div align="center">

![DKHOUL Logo](https://img.shields.io/badge/DKHOUL-Marketplace-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-purple?style=for-the-badge)

**Démocratiser l'accès aux revenus du tourisme marocain** 🇲🇦

[Demo](#demo) • [Features](#features) • [Installation](#installation) • [Documentation](#documentation)

</div>

---

## 📋 Table des Matières

- [À Propos](#à-propos)
- [Problématique](#problématique)
- [Solution DKHOUL](#solution-dkhoul)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [API Documentation](#api-documentation)
- [Base de Données](#base-de-données)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Roadmap](#roadmap)
- [Contribution](#contribution)
- [License](#license)

---

## 🎯 À Propos

**DKHOUL** est une plateforme marketplace innovante qui connecte **voyageurs** et **Marocains ordinaires** pour des **micro-services touristiques authentiques et abordables**. Le projet répond à un double objectif :

### Pour les Voyageurs 🧳
- ✅ **Prix 50-70% moins chers** : 50-300 DH vs 400-2000 DH (Airbnb/GetYourGuide)
- ✅ **Expériences authentiques** chez l'habitant
- ✅ **Micro-services pratiques** : stockage bagages (20 DH), douche (30 DH), wifi (50 DH)
- ✅ **Flexibilité totale** : réservation J ou J-1, durée 1-3h

### Pour les Hôtes Marocains 💰
- ✅ **80% des revenus** (vs 20-30% sur autres plateformes)
- ✅ **Revenus complémentaires** sans investissement initial
- ✅ **Valorisation** de leurs espaces, compétences et temps
- ✅ **Inclusion économique** : femmes, jeunes, retraités

### Statistiques Clés 📊
- 🎯 **580+ hôtes** actifs
- 🌍 **10,000+ voyageurs** aidés
- ⭐ **5,000+ services** fournis
- 💰 **80%** des revenus redistribués
- 🇲🇦 **10 villes** marocaines couvertes

---

## ❓ Problématique

Le **tourisme marocain** (15,9M visiteurs, 80Mds DH de recettes) bénéficie principalement aux grands groupes. Les problèmes identifiés :

### 1. Concentration Géographique
- 80% des touristes visitent uniquement Marrakech/Agadir/Casablanca
- Communautés locales exclues des retombées économiques

### 2. Expériences Standardisées
- Circuits touristiques uniformes et prévisibles
- Absence d'interactions authentiques avec les locaux

### 3. Distribution Inégale des Revenus
- Commissions élevées (30-70%) pour agences/plateformes
- Marocains ordinaires exclus de l'économie touristique

### 4. Absence de Micro-Services Pratiques
- Aucune solution pour bagages, wifi, douche express
- Services ponctuels inexistants

---

## 💡 Solution DKHOUL

### Les 3 Catégories Uniques

#### 🏠 DKHOUL Space - "Monétise ton espace"
**Prix:** 20-150 DH | **Hôtes:** 250+

| Service | Prix | Description |
|---------|------|-------------|
| 🎒 Stockage bagages | 20-30 DH/bagage | Garde sécurisée de valises |
| 🚿 Douche express | 30-50 DH | Salle de bain + serviette propre |
| 📶 Wifi/Coworking | 50-100 DH/h | Travaillez dans un salon confortable |
| 🚗 Stationnement | 50 DH/jour | Garage/cour sécurisée |

#### 🎓 DKHOUL Skills - "Vends ton savoir-faire"
**Prix:** 150-400 DH | **Hôtes:** 180+

| Service | Prix | Description |
|---------|------|-------------|
| 🍽️ Cuisine marocaine | 200-400 DH | Tajine/Couscous chez l'habitant |
| 🗣️ Cours de darija | 150-250 DH | Arabe marocain conversationnel |
| 🎨 Artisanat | 200-350 DH | Poterie, zellige, calligraphie |
| 🎵 Musique | 200-300 DH | Rythmes gnaoua, oud |

#### 🤝 DKHOUL Connect - "Loue ton temps"
**Prix:** 50-300 DH | **Hôtes:** 150+

| Service | Prix | Description |
|---------|------|-------------|
| 🛍️ Accompagnement souk | 100-150 DH/h | Shopping + traduction + conseils |
| 💡 Conseils locaux | 50 DH/appel | Restos, sorties, bons plans |
| 🚕 Transport | Variable | Aéroport, trajets personnalisés |
| 👶 Baby-sitting | 80-120 DH/h | Garde enfants bilingue |

### Avantages Compétitifs

| Critère | **DKHOUL** | Airbnb Exp. | GetYourGuide |
|---------|-----------|-------------|--------------|
| **Prix moyen** | **50-300 DH** | 400-1500 DH | 600-2000 DH |
| **Durée** | **1-3h flexible** | 3-8h fixe | Demi-journée |
| **Micro-services** | **✅ Oui** | ❌ Non | ❌ Non |
| **Revenus hôtes** | **80%** | 70% | 20-30% |
| **Authenticité** | **⭐⭐⭐⭐⭐** | ⭐⭐⭐ | ⭐ |
| **Réservation** | **J ou J-1** | J-3 minimum | J-3 minimum |

---

## 🚀 Technologies

### Backend
```
- Node.js 20 LTS
- Express.js 4.x + TypeScript
- MongoDB 8.0.13 + Mongoose
- JWT Authentication
- Socket.io (Real-time messaging)
- Bcrypt (Password hashing)
- Redis 7 (Caching & sessions)
```

### Frontend
```
- Angular 19.2.15
- Angular Material 19
- RxJS (Reactive programming)
- TypeScript 5.9
- SCSS (Styling)
- Socket.io-client
```

### DevOps & Infrastructure
```
- Docker + Docker Compose
- MongoDB Atlas (Production DB)
- AWS S3 (Image storage)
- GitHub Actions (CI/CD)
- Nginx (Reverse proxy)
```

### Development Tools
```
- VS Code
- Postman (API testing)
- MongoDB Compass
- Git/GitHub
- Draw.io (UML diagrams)
```

---

## 🏗️ Architecture

### Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Angular)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Home    │  │ Services │  │ Bookings │  │ Messages │   │
│  │ Landing  │  │  List    │  │  Create  │  │   Chat   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│         │              │              │              │       │
│         └──────────────┴──────────────┴──────────────┘       │
│                         │                                    │
│                    HTTP/REST API                             │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
┌─────────────────────────┼────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                 │
│  ┌──────────────────────┴─────────────────────────────┐     │
│  │               API Routes Layer                      │     │
│  │  /api/auth  /api/services  /api/bookings /api/...  │     │
│  └──────────────────────┬─────────────────────────────┘     │
│                         │                                    │
│  ┌──────────────────────┴─────────────────────────────┐     │
│  │            Controllers Layer                        │     │
│  │  AuthCtrl  ServiceCtrl  BookingCtrl  PaymentCtrl   │     │
│  └──────────────────────┬─────────────────────────────┘     │
│                         │                                    │
│  ┌──────────────────────┴─────────────────────────────┐     │
│  │            Services/Business Logic                  │     │
│  │  AuthService  EmailService  PaymentService          │     │
│  └──────────────────────┬─────────────────────────────┘     │
│                         │                                    │
│  ┌──────────────────────┴─────────────────────────────┐     │
│  │            Models/Data Access Layer                 │     │
│  │  User  Service  Booking  Payment  Review  Message  │     │
│  └──────────────────────┬─────────────────────────────┘     │
└─────────────────────────┼────────────────────────────────────┘
                          │
┌─────────────────────────┼────────────────────────────────────┐
│                    DATABASE LAYER                            │
│  ┌──────────────────────┴─────────────────────────────┐     │
│  │              MongoDB 8.0.13                         │     │
│  │  Users | Services | Bookings | Payments | Reviews  │     │
│  └─────────────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Redis 7 (Cache & Sessions)              │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Flux de Réservation

```
Tourist                    DKHOUL Platform                  Host
  │                              │                            │
  │  1. Browse Services          │                            │
  ├─────────────────────────────>│                            │
  │                              │                            │
  │  2. Select Service + Date    │                            │
  ├─────────────────────────────>│                            │
  │                              │                            │
  │  3. Confirm Booking          │                            │
  ├─────────────────────────────>│                            │
  │                              │                            │
  │  4. Payment (Escrow)         │                            │
  ├─────────────────────────────>│                            │
  │                              │  5. Notify Host            │
  │                              ├───────────────────────────>│
  │                              │                            │
  │                              │  6. Accept/Reject          │
  │                              │<───────────────────────────┤
  │  7. Confirmation             │                            │
  │<─────────────────────────────┤                            │
  │                              │                            │
  │  8. Service Delivered        │                            │
  │<────────────────────────────────────────────────────────>│
  │                              │                            │
  │  9. Complete Booking         │                            │
  ├─────────────────────────────>│                            │
  │                              │ 10. Release Payment (80%)  │
  │                              ├───────────────────────────>│
  │                              │                            │
  │ 11. Leave Review             │                            │
  ├─────────────────────────────>│                            │
```

---

## 🛠️ Installation

### Prérequis

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **MongoDB** 8.0+ ([Download](https://www.mongodb.com/try/download/community))
- **Git** ([Download](https://git-scm.com/))
- **Angular CLI** 19+ (`npm install -g @angular/cli`)

### 1. Cloner le Projet

```bash
git clone https://github.com/c-chakib/DKHOUL.git
cd DKHOUL
```

### 2. Backend Setup

```bash
# Naviguer vers backend
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Modifier .env avec vos configurations
# MONGODB_URI=mongodb://localhost:27017/dkhoul
# JWT_SECRET=your_secret_key
# PORT=5000

# Lancer MongoDB (dans un terminal séparé)
mongod

# Seed la base de données avec des données de test
npm run seed

# Démarrer le serveur backend
npm run dev
```

Le backend sera accessible sur **http://localhost:5000**

### 3. Frontend Setup

```bash
# Naviguer vers frontend (nouveau terminal)
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur Angular
ng serve
```

Le frontend sera accessible sur **http://localhost:4200**

### 4. Vérification

- ✅ Backend : http://localhost:5000/api/health
- ✅ Frontend : http://localhost:4200
- ✅ MongoDB : mongodb://localhost:27017/dkhoul

---

## 📖 Utilisation

### Comptes de Test (après seed)

#### Admin
```
Email: admin@dkhoul.ma
Password: password123
```

#### Tourist
```
Email: user1@dkhoul.ma
Password: password123
```

#### Host
```
Email: host1@dkhoul.ma
Password: password123
```

### Parcours Utilisateur

#### 1. Voyageur (Tourist)
1. **S'inscrire** : `/auth/register`
2. **Explorer services** : `/services` (filtres par catégorie, prix, ville)
3. **Voir détails** : `/services/:id`
4. **Réserver** : Sélectionner date/heure, confirmer
5. **Payer** : Paiement sécurisé (escrow)
6. **Messagerie** : Contacter l'hôte
7. **Recevoir service** : À la date convenue
8. **Évaluer** : Laisser un avis

#### 2. Hôte (Host)
1. **S'inscrire comme hôte** : `/auth/register?type=host`
2. **Créer service** : `/services/create` (3 catégories)
3. **Gérer calendrier** : Définir disponibilités
4. **Recevoir réservations** : Notifications en temps réel
5. **Accepter/Rejeter** : Dashboard
6. **Fournir service** : À la date convenue
7. **Recevoir paiement** : 80% du montant
8. **Évaluer client** : Système bilatéral

#### 3. Admin
1. **Dashboard** : Statistiques globales
2. **Gérer utilisateurs** : Validation, suspension
3. **Modérer services** : Approbation
4. **Résoudre litiges** : Système de dispute
5. **Exporter données** : Excel/CSV

---

## 📡 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "profile": {
    "firstName": "Ahmed",
    "lastName": "Bennani"
  },
  "role": "tourist"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": { ... }
}
```

### Services

#### Get All Services
```http
GET /api/services?category=Space&city=Marrakech&minPrice=50&maxPrice=300
```

#### Get Service by ID
```http
GET /api/services/:id
```

#### Create Service (Host only)
```http
POST /api/services
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Stockage bagages sécurisé",
  "description": "...",
  "category": "Space",
  "pricing": {
    "amount": 25,
    "currency": "MAD",
    "priceType": "per_day"
  },
  "location": {
    "city": "Marrakech",
    "coordinates": [-7.9811, 31.6295]
  },
  "capacity": 10,
  "photos": ["url1", "url2", "url3"]
}
```

### Bookings

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "serviceId": "507f1f77bcf86cd799439011",
  "bookingDate": "2025-11-15",
  "timeSlot": {
    "startTime": "09:00",
    "endTime": "11:00"
  },
  "numberOfGuests": 2
}
```

#### Get My Bookings
```http
GET /api/bookings
Authorization: Bearer {token}
```

#### Accept/Reject Booking (Host)
```http
PUT /api/bookings/:id/accept
PUT /api/bookings/:id/reject
Authorization: Bearer {token}
```

### Reviews

#### Create Review
```http
POST /api/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": "507f1f77bcf86cd799439011",
  "ratings": {
    "overall": 5,
    "communication": 5,
    "accuracy": 5,
    "value": 5
  },
  "comment": "Expérience exceptionnelle!"
}
```

### Payments

#### Initialize Payment
```http
POST /api/payments/init
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": "507f1f77bcf86cd799439011",
  "amount": 250,
  "currency": "MAD"
}
```

### Complete API Reference

For complete API documentation including all endpoints, request/response schemas, and error codes, see:
- [API Documentation](./backend/README.md)
- [Postman Collection](./DKHOUL.postman_collection.json)

---

## 🗄️ Base de Données

### Collections MongoDB

#### users
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  role: "admin" | "tourist" | "host",
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    photo: String,
    bio: String,
    languages: [String]
  },
  verified: Boolean,
  createdAt: Date
}
```

#### services
```javascript
{
  _id: ObjectId,
  hostId: ObjectId (ref: User),
  category: "Space" | "Skills" | "Connect",
  title: String,
  description: String,
  photos: [String] (3-10),
  pricing: {
    amount: Number,
    currency: "MAD",
    priceType: "per_hour" | "per_day" | "fixed"
  },
  location: {
    type: "Point",
    coordinates: [longitude, latitude],
    city: String,
    region: String
  },
  capacity: Number,
  languages: [String],
  availability: [{
    date: Date,
    timeSlots: [{
      startTime: String,
      endTime: String,
      available: Boolean
    }]
  }],
  rating: {
    average: Number,
    count: Number
  },
  status: "active" | "pending" | "rejected",
  createdAt: Date
}
```

#### bookings
```javascript
{
  _id: ObjectId,
  serviceId: ObjectId (ref: Service),
  touristId: ObjectId (ref: User),
  hostId: ObjectId (ref: User),
  bookingDate: Date,
  timeSlot: {
    startTime: String,
    endTime: String
  },
  numberOfGuests: Number,
  pricing: {
    baseAmount: Number,
    serviceFee: Number,
    totalAmount: Number,
    currency: "MAD"
  },
  status: "pending" | "confirmed" | "completed" | "cancelled",
  createdAt: Date
}
```

#### reviews
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId (ref: Booking),
  reviewerId: ObjectId (ref: User),
  revieweeId: ObjectId (ref: User),
  serviceId: ObjectId (ref: Service),
  reviewerType: "tourist" | "host",
  ratings: {
    overall: Number (1-5),
    communication: Number (1-5),
    accuracy: Number (1-5),
    value: Number (1-5),
    cleanliness: Number (1-5)
  },
  comment: String,
  photos: [String],
  expiresAt: Date,
  createdAt: Date
}
```

#### payments
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId (ref: Booking),
  touristId: ObjectId (ref: User),
  hostId: ObjectId (ref: User),
  amount: Number,
  currency: "MAD",
  status: "pending" | "completed" | "refunded",
  escrowReleaseDate: Date,
  createdAt: Date
}
```

### Indexes

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// Services
db.services.createIndex({ location: "2dsphere" }) // Geospatial queries
db.services.createIndex({ category: 1, status: 1 })
db.services.createIndex({ "pricing.amount": 1 })
db.services.createIndex({ hostId: 1 })

// Bookings
db.bookings.createIndex({ touristId: 1, createdAt: -1 })
db.bookings.createIndex({ hostId: 1, status: 1 })
db.bookings.createIndex({ serviceId: 1 })

// Reviews
db.reviews.createIndex({ serviceId: 1, createdAt: -1 })
db.reviews.createIndex({ revieweeId: 1 })
```

### Données de Seed

Le projet inclut un script de seed qui insère des données réalistes marocaines :

```bash
npm run seed
```

**Données générées :**
- ✅ **60 services** (20 par catégorie)
- ✅ **21 utilisateurs** (1 admin, 10 tourists, 10 hosts)
- ✅ **15 bookings** avec différents statuts
- ✅ **15 reviews** (4-5 étoiles)
- ✅ **Coordonnées GPS** réelles (Marrakech, Casablanca, Fès, etc.)
- ✅ **Noms marocains** authentiques
- ✅ **Descriptions en français/arabe**

---

## ✅ Tests

### Tests Backend (Jest)

```bash
cd backend
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

**Test Coverage:**
- Controllers: 85%
- Services: 90%
- Models: 95%

### Tests Frontend (Jasmine/Karma)

```bash
cd frontend
ng test                 # Run unit tests
ng test --code-coverage # Coverage report
```

### Tests E2E (Cypress)

```bash
cd frontend
npm run e2e
```

**Test Scenarios:**
- ✅ User registration & login
- ✅ Service creation flow
- ✅ Booking flow (end-to-end)
- ✅ Payment integration
- ✅ Review submission
- ✅ Real-time messaging

---

## 🚀 Déploiement

### Option 1: Docker Compose (Recommandé)

```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d

# Services lancés:
# - Frontend: http://localhost:80
# - Backend: http://localhost:5000
# - MongoDB: mongodb://localhost:27017
```

### Option 2: AWS Deployment

#### Backend (EC2)
```bash
# 1. Launch EC2 instance (t2.medium)
# 2. Install Node.js 20
# 3. Clone repository
# 4. Install dependencies
npm install --production

# 5. Set environment variables
export MONGODB_URI=mongodb+srv://...
export JWT_SECRET=...
export AWS_S3_BUCKET=...

# 6. Start with PM2
pm2 start npm --name "dkhoul-backend" -- start
pm2 save
pm2 startup
```

#### Frontend (S3 + CloudFront)
```bash
# 1. Build production
cd frontend
ng build --configuration production

# 2. Deploy to S3
aws s3 sync dist/frontend s3://dkhoul-frontend/

# 3. Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id XYZ --paths "/*"
```

#### Database (MongoDB Atlas)
```bash
# 1. Create cluster on MongoDB Atlas
# 2. Configure network access
# 3. Create database user
# 4. Get connection string
# 5. Update MONGODB_URI in .env
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Backend
        run: |
          ssh user@server 'cd /app && git pull && npm install && pm2 restart all'
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          ng build --prod
          aws s3 sync dist/ s3://dkhoul-frontend/
```



---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment participer :

### 1. Fork le Projet

```bash
git clone https://github.com/your-username/DKHOUL.git
cd DKHOUL
```

### 2. Créer une Branche

```bash
git checkout -b feature/AmazingFeature
```

### 3. Commit vos Changements

```bash
git add .
git commit -m "Add: Amazing new feature"
```

**Convention de commit :**
- `Add:` Nouvelle fonctionnalité
- `Fix:` Correction de bug
- `Update:` Modification existante
- `Remove:` Suppression
- `Docs:` Documentation

### 4. Push vers la Branche

```bash
git push origin feature/AmazingFeature
```

### 5. Ouvrir une Pull Request

Décrivez clairement :
- Ce que vous avez ajouté/modifié
- Pourquoi c'est nécessaire
- Comment tester vos changements

### Guidelines

- ✅ Suivre le style de code existant
- ✅ Ajouter des tests pour nouvelles fonctionnalités
- ✅ Mettre à jour la documentation
- ✅ Une PR = Une fonctionnalité
- ✅ Code en anglais, commentaires en français
- ✅ Respecter l'architecture MVC

### Rapporter un Bug

Utiliser les [GitHub Issues](https://github.com/c-chakib/DKHOUL/issues) avec :
- Description claire du problème
- Étapes pour reproduire
- Comportement attendu vs actuel
- Screenshots si pertinent
- Environnement (OS, Node version, etc.)

---

## 📝 License

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](./LICENSE) pour plus de détails.

```
MIT License

Copyright (c) 2024-2025 DKHOUL Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

### Équipe DKHOUL

**Développeur Principal**
- 👤 Chakib C.
- 📧 c-chakib@github.com
- 💼 [LinkedIn](https://linkedin.com/in/chakib)
- 🐙 [GitHub](https://github.com/c-chakib)

**Encadrant Académique**
- 🎓 Pr. [Nom de l'encadrant]
- 🏫 École Supérieure de Technologie
- 📧 encadrant@est.ma

### Liens Utiles

- 🌐 **Site Web:** [dkhoul.ma](https://dkhoul.ma) (En développement)
- 📦 **GitHub:** [github.com/c-chakib/DKHOUL](https://github.com/c-chakib/DKHOUL)
- 📄 **Documentation:** [docs.dkhoul.ma](https://docs.dkhoul.ma)
- 🐛 **Issues:** [github.com/c-chakib/DKHOUL/issues](https://github.com/c-chakib/DKHOUL/issues)
- 💬 **Discord:** [discord.gg/dkhoul](https://discord.gg/dkhoul)

### Réseaux Sociaux

- 🐦 **Twitter:** [@DkhoulMaroc](https://twitter.com/DkhoulMaroc)
- 📘 **Facebook:** [facebook.com/DkhoulMaroc](https://facebook.com/DkhoulMaroc)
- 📸 **Instagram:** [@dkhoul.ma](https://instagram.com/dkhoul.ma)
- 🎥 **YouTube:** [Démos & Tutoriels](https://youtube.com/@DkhoulMaroc)

---

## 🙏 Remerciements

Ce projet a été rendu possible grâce à :

- 🎓 **École Supérieure de Technologie** pour le support académique
- 👨‍🏫 **Pr. [Nom]** pour l'encadrement et les conseils précieux
- 🇲🇦 **Hôtes marocains** qui ont inspiré ce projet
- 🌍 **Communauté open-source** pour les technologies utilisées
- 💻 **Contributors** pour leurs contributions
- ☕ **Café marocain** pour les longues nuits de code

### Technologies Utilisées

Merci aux créateurs et mainteneurs de :
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Web framework
- [Angular](https://angular.io/) - Frontend framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Socket.io](https://socket.io/) - Real-time engine
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Docker](https://www.docker.com/) - Containerization
- [GitHub](https://github.com/) - Version control & CI/CD

---

< align="center">

**Made with ❤️ in Morocco 🇲🇦**

⭐ **Star this project** if you find it useful!

[⬆ Retour en haut](#-dkhoul---plateforme-marketplace-de-micro-services-touristiques)

<