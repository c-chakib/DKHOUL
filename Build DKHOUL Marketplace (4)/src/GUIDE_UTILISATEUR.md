# Guide d'Utilisation - DKHOUL Platform

## 🎯 Vue d'ensemble

DKHOUL est une plateforme marketplace complète et fonctionnelle avec deux expériences distinctes :
1. **Démo de la Plateforme** - Pour découvrir l'expérience utilisateur
2. **Dossier Investisseur** - Pour présenter l'opportunité d'investissement

---

## 📱 Navigation Globale

### Page d'Accueil Gateway

Lorsque vous arrivez sur DKHOUL, vous avez deux choix :

#### Option 1: Explorer la Plateforme (Demo)
- Découvrez comment fonctionne la marketplace
- Parcourez les services disponibles
- Testez le processus de réservation
- Explorez le dashboard Host

#### Option 2: Voir le Pitch Investisseur
- Comprenez le problème et la solution
- Analysez le marché et les opportunités
- Consultez les projections financières
- Évaluez l'impact social

### Navigation Inter-Sections

**Depuis la Plateforme vers le Pitch :**
- Cliquez sur "Investisseurs" dans la navigation
- Ou utilisez le lien dans le footer

**Depuis le Pitch vers la Plateforme :**
- Cliquez sur "Voir la Démo" dans le header
- Ou utilisez le bouton en fin de présentation

**Retour au Gateway :**
- Logo DKHOUL → Retour à la section actuelle
- Menu utilisateur → "Retour à l'accueil"
- Footer → Cliquer sur "DKHOUL"

---

## 🏠 Plateforme Marketplace - Parcours Complet

### 1. Page d'Accueil (Home)

**Fonctionnalités :**
- Barre de recherche avec destination
- 3 catégories principales (Space, Skills, Connect)
- Services populaires avec ratings
- Section "Comment ça marche"
- Témoignages d'utilisateurs

**Actions possibles :**
- Rechercher par destination → Redirige vers la page de recherche
- Cliquer sur une catégorie → Filtre les résultats par catégorie
- Cliquer sur un service → Voir les détails du service

### 2. Page de Recherche (Search)

**Filtres disponibles :**
- **Catégories** : Space, Skills, Connect
- **Prix** : Slider de 0 à 1000 DH
- **Date** : Calendrier avec dates disponibles
- **Notes** : De 1 à 5 étoiles
- **Langues** : Français, Arabe, Anglais, Espagnol

**Options d'affichage :**
- Vue grille (par défaut)
- Vue liste

**Actions :**
- Appliquer les filtres → Mise à jour instantanée des résultats
- Cliquer sur un service → Page de détail
- Sauvegarder en favoris (icône cœur)

### 3. Page de Détail Service

**Contenu :**
- Galerie de 4+ photos navigable
- Titre et catégorie du service
- Note globale avec nombre d'avis
- Localisation exacte
- Profil du Host (nom, note, langues, badges)
- Description complète
- Points forts (4-6 items)
- Ce qui est inclus
- Section avis détaillée (3+ avis visibles)

**Sidebar de Réservation :**
- Prix par personne
- Sélecteur de date (calendrier)
- Sélecteur d'heure (créneaux disponibles)
- Nombre de personnes (min 1, max selon service)
- Calcul automatique du total
- Bouton "Réserver"
- Garanties (annulation, paiement, support)

**Actions :**
- Réserver → Lance le processus de réservation
- Contacter le Host → Ouvre la messagerie
- Partager → Fonction de partage
- Sauvegarder → Ajouter aux favoris

### 4. Processus de Réservation (Booking Flow)

#### Étape 1 : Détails de la Réservation

**Informations à renseigner :**
- Date (calendrier interactif, dates futures uniquement)
- Heure (sélection parmi créneaux disponibles)
- Nombre de participants (+ / -)
- Message au Host (optionnel, textarea)

**Affichage :**
- Politique d'annulation complète
- Barre de progression des étapes
- Récapitulatif permanent dans sidebar

**Validation :**
- Bouton "Continuer vers le paiement"
- Vérification que tous les champs requis sont remplis

#### Étape 2 : Paiement

**Formulaire de paiement :**
- Nom sur la carte
- Numéro de carte (format 16 chiffres)
- Date d'expiration (MM/YY)
- CVV (3 chiffres, masqué)

**Sécurité :**
- Badge de paiement sécurisé
- Explication sur le cryptage
- Certification PCI-DSS

**Validation :**
- Vérification de tous les champs
- Bouton "Confirmer et payer" activé uniquement si formulaire complet

#### Étape 3 : Confirmation

**Affichage :**
- Icône de succès (checkmark vert)
- Message de confirmation
- Numéro de réservation unique
- Récapitulatif complet :
  - Date et heure
  - Nombre de participants
  - Montant payé

**Actions :**
- "Contacter le Host" → Ouvre la messagerie
- "Retour à l'accueil" → Page d'accueil de la plateforme
- Email de confirmation envoyé (mention affichée)

### 5. Dashboard Host

**Vue d'ensemble :**
- 4 cartes de statistiques principales :
  - Revenus du mois (avec % de croissance)
  - Réservations du mois
  - Note moyenne
  - Taux de réponse

**Graphiques :**
- Évolution des revenus (courbe sur 6 mois)
- Répartition par catégorie (diagramme circulaire)
- Filtres par période (semaine/mois/année)

**Onglets :**

#### Mes Services
Pour chaque service :
- Image, titre, catégorie, statut
- Prix par session
- Statistiques : réservations, revenus, note, vues
- Bouton "Modifier"

#### Réservations
Pour chaque réservation :
- Avatar et nom du voyageur
- Service réservé
- Date, heure, nombre de participants
- Montant
- Statut (confirmé / en attente)
- Actions : Message, Accepter/Refuser (si en attente)

#### Avis
Pour chaque avis :
- Avatar et nom du voyageur
- Service concerné
- Date de l'avis
- Note (étoiles)
- Commentaire
- Bouton "Répondre à cet avis"

**Actions globales :**
- "Nouveau Service" → Créer une annonce
- Navigation entre les onglets
- Export de données (futur)

### 6. Profil Utilisateur

**En-tête :**
- Photo de profil (avatar)
- Bouton "Changer la photo"
- Nom complet
- Localisation et date d'inscription
- 4 statistiques : Note, Avis, En tant que Host, En tant que Voyageur
- Badges de vérification (Super Host, Email, Téléphone, Identité)
- Bio personnelle (éditable)
- Langues parlées

**Onglets :**

#### À propos
- **Informations personnelles** :
  - Email, Téléphone, Localisation, Site web
  - Mode édition activable
- **Centres d'intérêt** : Tags éditables
- **Performance Host** : Taux de réponse, temps moyen
- **Historique des réservations** : Liste avec possibilité de laisser un avis

#### Avis (38 avis)
- Liste complète des avis reçus
- Avatar du reviewer
- Service concerné
- Date
- Note en étoiles
- Commentaire

#### Favoris
- Grille de services sauvegardés
- Chaque carte affiche : image, titre, host, localisation, note, prix
- Icône cœur pour retirer des favoris

#### Paramètres
- **Notifications** :
  - Email, Réservations, Messages, Newsletter
  - Switches on/off pour chaque type
- **Confidentialité** :
  - Profil public
  - Affichage des avis
- **Sécurité** :
  - Changer le mot de passe
  - Vérifier l'identité
- **Zone de danger** :
  - Supprimer le compte (bouton rouge)

**Mode édition :**
- Bouton "Modifier" → Active les champs éditables
- Bouton "Enregistrer" → Sauvegarde les modifications
- Tous les champs texte deviennent des inputs

### 7. Messagerie

**Layout :**
- Colonne gauche : Liste des conversations
- Colonne droite : Chat actif

#### Liste des Conversations

**Affichage :**
- Barre de recherche
- Pour chaque conversation :
  - Avatar du participant
  - Nom + badge "Host" si applicable
  - Service concerné
  - Dernier message (preview)
  - Horodatage
  - Badge de messages non lus

**Actions :**
- Rechercher par nom ou service
- Cliquer pour ouvrir la conversation
- Indicateur visuel de la conversation active

#### Zone de Chat

**Header :**
- Avatar et nom du participant
- Service concerné
- Boutons : Téléphone, Vidéo, Plus d'options
- Badge de réservation si applicable (date confirmée)

**Messages :**
- Bulles différenciées (envoyé vs reçu)
- Avatar pour les messages reçus
- Horodatage pour chaque message
- Support de différents types :
  - Texte standard
  - Confirmation de réservation (carte spéciale)
  - Images (futur)

**Zone de saisie :**
- Bouton pièce jointe
- Bouton image
- Input texte
- Bouton emoji
- Bouton envoyer (actif seulement si texte saisi)
- Envoi par "Entrée"

**Données réelles :**
- Conversation 1 : Dialogue complet avec Sophie (8 messages + booking)
- Conversation 2 : Échange avec John (3 messages)
- Autres conversations : Données d'exemple

---

## 💼 Dossier Investisseur - Sections Détaillées

### Navigation Sticky

**Header permanent :**
- Logo DKHOUL
- Menu avec ancres : Problème, Solution, Marché, Business Model, Financials
- Boutons : "Voir la Démo", "Contact"

### 1. Hero Section

**Contenu :**
- Badge "Opportunité d'Investissement"
- Titre principal : Démocratiser le Tourisme Marocain
- Sous-titre explicatif
- 3 cartes de stats :
  - 500K DH recherchés
  - 15% equity proposée
  - 100M+ DH revenus 2030
- Bouton "Télécharger le Pitch Deck"

### 2. Le Problème

**Structure :**
- Introduction au problème
- 2 cartes principales :
  - **Concentration des Revenus** : 85% aux grands groupes
  - **Marocains Exclus** : Millions ne profitent pas du tourisme

**Impact sur l'économie locale :**
- 3 points d'impact négatif
- Design avec icônes X rouges
- Fond dégradé destructive

### 3. Notre Solution

**Les 3 catégories :**

Chaque catégorie affiche :
- Icône et couleur distinctive
- Nom et description
- 3 exemples de services avec icônes checkmark
- Fourchette de prix

**Catégories :**
1. **DKHOUL Space** (Bleu)
   - Coworking, Stockage, Douche
   - 50-100 DH/heure

2. **DKHOUL Skills** (Vert)
   - Cuisine, Darija, Artisanat
   - 150-400 DH/session

3. **DKHOUL Connect** (Ambre)
   - Guide, Conseils, Transport
   - 100-300 DH/heure

**Comment ça marche :**
- 3 étapes numérotées
- Processus clair et visuel

### 4. Opportunité de Marché

**4 cartes de stats :**
- 15M touristes/an
- +12% croissance annuelle
- 2030 Coupe du Monde
- 100B DH marché touristique

**Événements majeurs :**
- Coupe du Monde 2030
- CAN 2025
- Croissance du tourisme expérientiel

### 5. Business Model

**Revenus :**
- 20% de commission
- Frais Host Premium
- Publicité pour Hosts

**Coûts principaux :**
- Tech & maintenance
- Marketing
- Support client

**Graphique de répartition :**
- Pie chart interactif
- 3 catégories avec couleurs
- Pourcentages : Space 35%, Skills 45%, Connect 20%

### 6. Projections Financières

**Graphique de croissance :**
- Line chart sur 5 ans
- De 720K DH (An 1) à 100M+ DH (An 5)
- 5 cartes résumant chaque année :
  - Revenus
  - Nombre de Hosts

**Hypothèses clés :**
- Croissance 200% Hosts/an (An 1-3)
- Panier moyen 180 DH
- 12 transactions/mois par Host
- Pic en 2030 (Coupe du Monde)

**Utilisation des fonds (500K DH) :**
- Développement Tech : 40%
- Marketing & Acquisition : 30%
- Opérations & Support : 20%
- Légal & Admin : 10%

### 7. Impact Social

**3 cartes de stats :**
- 5000 DH revenu mensuel moyen par Host
- 2000+ Hosts actifs en 2030
- 60% des revenus restent dans communautés locales

**6 bénéfices sociaux :**
- Revenus complémentaires familles
- Valorisation compétences traditionnelles
- Échanges culturels authentiques
- Création emplois indirects
- Tourisme durable
- Réduction inégalités économiques

### 8. CTA Final

**Appel à l'action :**
- Titre engageant
- Description de l'opportunité
- 2 boutons :
  - "Demander un RDV" (blanc)
  - "Explorer la Plateforme" (outline)

---

## 📊 Données et Contenus

### Services (12 au total)

Toutes les cartes de service incluent :
- Image haute qualité (Unsplash)
- Titre descriptif
- Catégorie (badge coloré)
- Nom du Host
- Note sur 5 étoiles
- Nombre d'avis
- Prix avec unité
- Localisation

### Hosts (8 profils)

Chaque Host a :
- Nom marocain authentique
- Avatar (Dicebear ou initiales)
- Note entre 4.7 et 5.0
- Nombre d'avis réalistes
- Langues parlées
- Année d'inscription
- Badge Super Host (certains)

### Avis (38+ avis au total)

Chaque avis contient :
- Nom du reviewer
- Avatar
- Service noté
- Note en étoiles (4-5)
- Commentaire détaillé en français
- Date récente

### Messages (5 conversations)

Données complètes pour :
- Conversation active avec Sophie : 8 messages + booking confirmation
- Conversation avec John : 3 messages
- 3 autres conversations avec previews

---

## 🎨 Design System

### Couleurs

**Primaires :**
- Primary (Bleu) : `#2563EB`
- Secondary (Vert) : `#059669`
- Accent (Ambre) : `#F59E0B`

**Utilisation :**
- Primary : Boutons principaux, liens, éléments interactifs
- Secondary : Badges, éléments de confiance, success states
- Accent : Notes, highlights, call-to-actions secondaires

### Composants shadcn/ui Utilisés

**Navigation & Layout :**
- Card, Badge, Button, Avatar
- Navigation, Tabs, Separator

**Forms :**
- Input, Textarea, Label
- Calendar, Select, Switch
- Checkbox, Radio Group

**Feedback :**
- Alert, Toast (Sonner)
- Progress, Skeleton

**Data Display :**
- Table, Chart (Recharts)
- Tooltip, Popover

**Communication :**
- Dialog, Sheet, Dropdown Menu
- Scroll Area

### Typographie

**Hiérarchie :**
- H1 : 32-48px (Hero titles)
- H2 : 24-32px (Section titles)
- H3 : 20-24px (Card titles)
- Body : 16px (Paragraphs)
- Small : 14px (Metadata)
- XS : 12px (Captions)

**Polices :**
- Titres : Poppins (Bold/Semi-Bold)
- Texte : Inter (Regular/Medium)

---

## ✅ Checklist de Test

### Navigation Générale
- [ ] Gateway → Platform fonctionne
- [ ] Gateway → Pitch fonctionne
- [ ] Platform → Pitch fonctionne
- [ ] Retour au Gateway depuis n'importe où
- [ ] Logo ramène à la home de la section

### Plateforme
- [ ] Recherche depuis home fonctionne
- [ ] Filtres search page s'appliquent
- [ ] Clic sur service ouvre détail
- [ ] Booking flow 3 étapes complètes
- [ ] Dashboard affiche les stats
- [ ] Profil éditable
- [ ] Messages affichent conversations
- [ ] Toutes les images chargent

### Pitch Investisseur
- [ ] Ancres de navigation fonctionnent
- [ ] Graphiques s'affichent correctement
- [ ] Données visibles et cohérentes
- [ ] Bouton "Voir la Démo" fonctionne
- [ ] Responsive sur mobile

### Données
- [ ] Tous les services ont images + infos
- [ ] Hosts ont noms + avatars + ratings
- [ ] Avis sont réalistes et variés
- [ ] Messages ont conversations complètes
- [ ] Stats Dashboard sont cohérentes
- [ ] Projections financières calculées

---

## 🚀 Prochaines Étapes

### Améliorations UX
1. Ajouter des animations de transition
2. Implémenter le système de favoris persistant
3. Ajouter des tooltips informatifs
4. Améliorer les messages d'erreur

### Fonctionnalités Supplémentaires
1. Créer le formulaire "Nouveau Service" pour Hosts
2. Implémenter le système de notifications
3. Ajouter le support multilingue (FR/AR/EN)
4. Créer l'Admin Dashboard
5. Intégrer un vrai système de paiement
6. Ajouter l'authentification utilisateur

### Backend (Futur)
1. Connexion à Supabase pour persistance
2. API pour les réservations
3. Système de messagerie en temps réel
4. Upload d'images pour Hosts
5. Notifications push
6. Analytics et tracking

---

## 📞 Support

Pour toute question sur l'utilisation de la plateforme DKHOUL :
- **Email** : support@dkhoul.ma
- **Documentation** : Ce guide + README_DKHOUL.md
- **Feedback** : Utilisez la fonctionnalité de contact

---

**Dernière mise à jour** : 1 novembre 2025
**Version** : 1.0 - Production Ready
