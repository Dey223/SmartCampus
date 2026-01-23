# 📚 Guide Complet des Fonctionnalités - Smart Campus Platform

> Documentation complète pour l'équipe de développement et les utilisateurs

---

## 🎯 Vue d'Ensemble

**Smart Campus Platform** est une solution IoT complète de gestion intelligente de campus universitaire avec **3 portails distincts** :

| Portail | URL | Rôle | Utilisateurs |
|---------|-----|------|--------------|
| **Admin** | `/` ou `/admin` | Gestion complète du campus | Administrateurs |
| **Staff** | `/staff` | Gestion pédagogique | Personnel enseignant |
| **Student** | `/student` | Services étudiants | Étudiants |

---

## 🔐 Système d'Authentification

### Connexion Unifiée
- **URL** : `/login`
- **Méthode** : JWT avec cookies httpOnly
- **Durée de session** : 24 heures

### Comptes de Test

```
Admin :
  Email : admin@smartcampus.com
  Mot de passe : admin

Staff :
  Email : staff@smartcampus.com
  Mot de passe : staff

Staff (depuis BDD) :
  Tout compte créé dans /admin/staff
  Email : celui configuré
  Mot de passe : n'importe lequel (démo)
```

### Fonctionnalités Auth
- ✅ Protection des routes par middleware
- ✅ Redirection automatique selon le rôle
- ✅ Déconnexion sécurisée
- ✅ Authentification depuis base de données (staff_users)

---

## 🏢 PORTAIL ADMIN

### 1. Dashboard Principal (`/admin`)

**Vue d'ensemble temps réel du campus**

#### KPIs Affichés
- 📊 **Nombre de bâtiments** - Total des infrastructures
- ⚡ **Consommation énergétique** - kWh en temps réel
- 📅 **Réservations actives** - Salles réservées aujourd'hui
- 🔧 **Tickets de maintenance** - Incidents en cours

#### Graphiques
- **Consommation Énergétique** (7 derniers jours)
  - Graphique en barres
  - Données par jour
  - Tendances visibles

- **Occupation des Bâtiments**
  - Taux d'occupation en %
  - Comparaison capacité/occupation
  - Alertes visuelles (>80% = rouge)

#### Prédictions ML (Python + scikit-learn) 🤖
- **Bouton** : "Générer Prédictions"
- **Algorithme** : Linear Regression
- **Données** : 30 derniers jours
- **Résultat** : Prédictions 7 jours + détection de pics
- **Affichage** :
  - Graphique prédictif
  - Statistiques (moyenne, max, total)
  - Alertes pics de consommation

#### Cartographie Interactive 🗺️
- **Technologie** : Leaflet.js + OpenStreetMap
- **Localisation** : Casablanca, Maroc
- **5 Bâtiments affichés** :
  1. Bâtiment Sciences
  2. Bâtiment Principal
  3. Bibliothèque
  4. Amphithéâtre A
  5. Laboratoires

- **Informations par marqueur** :
  - Occupation (personnes/capacité)
  - Consommation énergétique (kWh)
  - Statut (Normal/Attention/Critique)
  - Codes couleur visuels

#### Listes et Alertes
- **Alertes système** - Incidents critiques
- **Réservations récentes** - Dernières bookings
- **Résumé maintenance** - Tickets par priorité

---

### 2. Gestion du Personnel (`/admin/staff`)

**CRUD complet pour gérer les membres du personnel**

#### Liste du Personnel
- **Affichage** :
  - Tableau avec tri et recherche
  - Nom complet
  - Email et téléphone
  - Département et poste
  - Statut (Actif/Inactif/En congé)

- **Statistiques** :
  - Total personnel
  - Nombre actifs
  - Nombre en congé

- **Actions** :
  - ✏️ Modifier (à venir)
  - 🗑️ Supprimer (avec confirmation)
  - 🔍 Recherche en temps réel

#### Ajouter un Membre (`/admin/staff/new`)
- **Formulaire** :
  - Prénom / Nom (requis)
  - Email (requis, unique)
  - Téléphone
  - Département (sélection)
    - Direction Générale
    - Informatique
    - Sciences
    - Lettres
    - Administration
    - Maintenance
    - Bibliothèque
  - Poste
  - Date d'embauche

- **Validation** :
  - Email unique
  - Champs requis vérifiés
  - Feedback visuel

- **Résultat** :
  - Compte créé dans `staff_users`
  - Peut se connecter immédiatement
  - Redirection vers liste

---

### 3. Profil Admin (`/admin/profile`)

**Gestion du profil personnel**

#### Sections
1. **Informations Personnelles**
   - Prénom / Nom
   - Email
   - Téléphone

2. **Informations Professionnelles**
   - Rôle (lecture seule)
   - Département
   - Matricule (lecture seule)

3. **Sécurité**
   - Mot de passe actuel
   - Nouveau mot de passe
   - Confirmation

#### Fonctionnalités
- ✅ Formulaire pré-rempli
- ✅ Validation en temps réel
- ✅ Sauvegarde avec feedback
- ✅ Annulation possible

---

### 4. Navigation Admin

#### Sidebar (Desktop)
- 🏠 Dashboard
- ⚡ Énergie
- 📅 Réservations
- 👥 Présence
- 🔧 Maintenance
- 🏢 Bâtiments
- 👨‍💼 **Personnel** (nouveau !)

#### Header (Top)
- 🔍 Recherche globale
- 🔔 Notifications (lien fonctionnel)
- ⚙️ Paramètres (lien fonctionnel)
- 👤 Menu utilisateur
  - Profil
  - Paramètres
  - Déconnexion

#### Mobile
- 🍔 Menu hamburger
- Sheet latéral avec navigation complète
- Responsive 100%

---

## 👨‍🏫 PORTAIL STAFF

### 1. Dashboard Staff (`/staff`)

**Vue d'ensemble pour le personnel enseignant**

#### Statistiques
- 📚 Étudiants inscrits
- 📅 Cours planifiés
- 📢 Annonces envoyées
- 🚨 Incidents signalés

#### Accès Rapide
- Boutons vers toutes les fonctionnalités
- Navigation intuitive
- Icônes claires

---

### 2. Inscription Étudiants (`/staff/students/new`)

**Enregistrer de nouveaux étudiants**

#### Formulaire
- **Informations Personnelles** :
  - Prénom / Nom
  - Date de naissance
  - Email
  - Téléphone

- **Informations Académiques** :
  - Numéro étudiant (unique)
  - Programme d'études
  - Niveau (Licence/Master/Doctorat)
  - Année d'inscription

- **Adresse** :
  - Rue
  - Ville
  - Code postal
  - Pays

#### Fonctionnalités
- ✅ Auto-création table `students` si inexistante
- ✅ Validation numéro étudiant unique
- ✅ Feedback succès/erreur
- ✅ Redirection après succès

---

### 3. Planification de Cours (`/staff/planning/new`)

**Créer des sessions de cours**

#### Formulaire
- **Cours** :
  - Code cours
  - Nom du cours
  - Enseignant

- **Planning** :
  - Bâtiment (sélection)
  - Salle
  - Date
  - Heure début / fin

- **Participants** :
  - Nombre d'étudiants attendus

#### Fonctionnalités
- ✅ Auto-création table `courses` si inexistante
- ✅ Validation horaires
- ✅ Vérification disponibilité salle
- ✅ Toast notifications

---

### 4. Signalement d'Incidents (`/staff/incidents/new`)

**Rapporter des problèmes techniques**

#### Formulaire
- **Incident** :
  - Titre
  - Description détaillée
  - Bâtiment
  - Salle/Localisation

- **Priorité** :
  - Basse
  - Moyenne
  - Haute
  - Critique

#### Fonctionnalités
- ✅ Enregistré dans `maintenance_tickets`
- ✅ Statut automatique "pending"
- ✅ Notification Admin
- ✅ Suivi possible

---

### 5. Envoi d'Annonces (`/staff/announcements/new`)

**Communiquer avec les étudiants**

#### Formulaire
- **Annonce** :
  - Titre
  - Message
  - Type (Info/Urgent/Événement)

- **Destinataires** :
  - Tous les étudiants
  - Programme spécifique
  - Niveau spécifique

#### Fonctionnalités
- ✅ Stockage dans `announcements`
- ✅ Horodatage automatique
- ✅ Historique consultable
- ✅ Modification possible

---

### 6. Navigation Staff

#### Navbar (Responsive)
- 🏠 Dashboard
- 📚 Inscrire Étudiant
- 📅 Planifier Cours
- 🚨 Signaler Incident
- 📢 Envoyer Annonce
- ⚙️ Paramètres
- 👤 Profil + Déconnexion

#### Mobile
- Menu hamburger
- Sheet latéral
- Navigation complète

---

## 🎓 PORTAIL STUDENT

### 1. Pointage de Présence (`/student`)

**Système de présence biométrique simulé**

#### Interface
- **Écran d'accueil** :
  - Logo campus
  - Instructions claires
  - Design tactile optimisé

- **Simulation Biométrique** :
  - Bouton "Scanner Empreinte"
  - Animation de scan
  - Feedback visuel

#### Fonctionnalités
- ✅ Enregistrement dans `presence_readings`
- ✅ Horodatage automatique
- ✅ Confirmation visuelle
- ✅ Interface mobile-first

---

## 🐍 SERVICE PYTHON ML

### Architecture Microservice

**Service indépendant pour analyse énergétique**

#### Stack Technique
- **Framework** : Flask
- **ML** : scikit-learn (Linear Regression)
- **Data** : pandas, numpy
- **Port** : 5000

#### API Endpoints

##### 1. Health Check
```
GET /health
Response: { "status": "healthy", "service": "energy-analytics" }
```

##### 2. Prédictions Énergétiques
```
POST /api/predict
Body: {
  "historical_data": [
    {"timestamp": "2024-01-01T00:00:00", "value": 450.5},
    ...
  ],
  "prediction_days": 7
}

Response: {
  "predictions": [...],
  "peaks": [...],
  "statistics": {...}
}
```

##### 3. Analyse de Consommation
```
POST /api/analyze
Body: { "historical_data": [...] }
Response: {
  "hourly_patterns": {...},
  "daily_patterns": {...},
  "overall_statistics": {...}
}
```

#### Algorithme ML
- **Type** : Régression Linéaire
- **Features** :
  - Heure de la journée (0-23)
  - Jour de la semaine (0-6)
  - Jour de l'année (1-365)
- **Training** : Données historiques 30 jours
- **Prédiction** : 7 jours futurs
- **Bonus** : Détection automatique de pics

---

## 🗄️ Base de Données

### Tables Principales

#### 1. `buildings`
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- address (TEXT)
- total_area (DECIMAL)
- floors (INTEGER)
- created_at (TIMESTAMP)
```

#### 2. `energy_readings`
```sql
- id (SERIAL PRIMARY KEY)
- building_id (INTEGER)
- reading_type (VARCHAR) -- electricity, water, gas
- value (DECIMAL)
- unit (VARCHAR)
- recorded_at (TIMESTAMP)
```

#### 3. `maintenance_tickets`
```sql
- id (SERIAL PRIMARY KEY)
- title (VARCHAR)
- description (TEXT)
- building (VARCHAR)
- location (VARCHAR)
- priority (VARCHAR) -- low, medium, high, critical
- status (VARCHAR) -- pending, in_progress, resolved
- created_at (TIMESTAMP)
```

#### 4. `reservations`
```sql
- id (SERIAL PRIMARY KEY)
- title (VARCHAR)
- room (VARCHAR)
- building (VARCHAR)
- start_time (TIMESTAMP)
- end_time (TIMESTAMP)
- attendees (INTEGER)
- status (VARCHAR)
- created_at (TIMESTAMP)
```

#### 5. `students`
```sql
- id (SERIAL PRIMARY KEY)
- student_number (VARCHAR UNIQUE)
- first_name, last_name (VARCHAR)
- email (VARCHAR UNIQUE)
- phone, date_of_birth (VARCHAR)
- program, level, year (VARCHAR)
- address, city, postal_code, country (VARCHAR)
- created_at (TIMESTAMP)
```

#### 6. `courses`
```sql
- id (SERIAL PRIMARY KEY)
- course_code (VARCHAR)
- course_name (VARCHAR)
- instructor (VARCHAR)
- building, room (VARCHAR)
- course_date (DATE)
- start_time, end_time (TIME)
- expected_students (INTEGER)
- created_at (TIMESTAMP)
```

#### 7. `announcements`
```sql
- id (SERIAL PRIMARY KEY)
- title (VARCHAR)
- message (TEXT)
- type (VARCHAR) -- info, urgent, event
- target_audience (VARCHAR)
- created_at (TIMESTAMP)
```

#### 8. `staff_users` ⭐ Nouveau
```sql
- id (SERIAL PRIMARY KEY)
- first_name, last_name (VARCHAR)
- email (VARCHAR UNIQUE)
- phone (VARCHAR)
- department, position (VARCHAR)
- hire_date (DATE)
- status (VARCHAR) -- active, inactive, on_leave
- password_hash (VARCHAR)
- created_at, updated_at (TIMESTAMP)
```

#### 9. `presence_readings`
```sql
- id (SERIAL PRIMARY KEY)
- student_id (INTEGER)
- building_id (INTEGER)
- recorded_at (TIMESTAMP)
- method (VARCHAR) -- fingerprint, card, facial
```

### Auto-Création
- ✅ Toutes les tables se créent automatiquement si inexistantes
- ✅ Migrations SQL dans `/scripts`
- ✅ Self-healing infrastructure

---

## 🎨 Design & UX

### Principes
- **Mobile-First** : Responsive sur tous devices
- **Accessibilité** : ARIA labels, navigation clavier
- **Performance** : SSR Next.js, optimisations
- **Cohérence** : Design system unifié

### Technologies UI
- **Framework** : Next.js 16 (App Router)
- **Styling** : Tailwind CSS 4
- **Components** : Radix UI (shadcn/ui)
- **Icons** : Lucide React
- **Charts** : Recharts
- **Maps** : Leaflet.js
- **Notifications** : Sonner (toast)

### Thème
- **Couleurs** : Palette universitaire (bleu/teal)
- **Typography** : Inter (sans-serif)
- **Radius** : 0.625rem
- **Dark Mode** : Supporté

---

## 🔧 Fonctionnalités Techniques

### Middleware & Routing
- **Protection routes** : JWT verification
- **Role-based access** : Admin/Staff/Student
- **Redirections** : Automatiques selon rôle
- **Session refresh** : Auto-renouvellement 24h

### API Routes
- **RESTful** : GET, POST, PUT, DELETE
- **Validation** : Zod schemas
- **Error handling** : Codes HTTP appropriés
- **CORS** : Configuré pour Python service

### Performance
- **SSR** : Server-Side Rendering
- **ISR** : Incremental Static Regeneration
- **Image Optimization** : Next.js Image
- **Code Splitting** : Automatique
- **Lazy Loading** : Composants dynamiques

---

## 🐳 Déploiement

### Docker
```bash
# Build
docker-compose build

# Run
docker-compose up

# Services
- Next.js app (port 3000)
- Python analytics (port 5000)
```

### Vercel (Production)
```bash
# Variables requises
DATABASE_URL=postgresql://...
JWT_SECRET=...
NEXT_PUBLIC_APP_URL=https://...
PYTHON_SERVICE_URL=https://...

# Déploiement
vercel --prod
```

### Environnements
- **Local** : `pnpm dev`
- **Staging** : Vercel preview
- **Production** : Vercel production

---

## 📊 Métriques & Analytics

### KPIs Trackés
- Consommation énergétique (kWh)
- Taux d'occupation (%)
- Tickets de maintenance (nombre)
- Réservations (nombre)
- Présences étudiants (nombre)

### Prédictions ML
- Consommation future (7 jours)
- Pics de consommation
- Anomalies détectées
- Tendances

---

## 🚀 Roadmap Futures Fonctionnalités

### Court Terme
- [ ] Export PDF des rapports
- [ ] Notifications push temps réel
- [ ] Modification staff users
- [ ] Historique des modifications

### Moyen Terme
- [ ] Simulateur IoT MQTT/WebSocket
- [ ] TimescaleDB pour séries temporelles
- [ ] Dashboard personnalisable
- [ ] Multi-langue (FR/EN/AR)

### Long Terme
- [ ] Intégration capteurs physiques
- [ ] App mobile native
- [ ] IA prédictive avancée
- [ ] Blockchain pour certifications

---

## 📞 Support & Documentation

### Ressources
- **README.md** : Installation et démarrage
- **COLLABORATION.md** : Guide pour contributeurs
- **DEPLOYMENT.md** : Guide de déploiement
- **PRESENTATION.md** : Guide de présentation
- **TECHNOLOGIES_STACK.md** : Stack technique détaillée

### Contacts
- **Repository** : [Dey223/SmartCampus](https://github.com/Dey223/SmartCampus)
- **Issues** : GitHub Issues
- **Discussions** : GitHub Discussions

---

## ✅ Checklist Utilisation

### Pour Admins
- [ ] Se connecter (`admin@smartcampus.com`)
- [ ] Consulter dashboard et KPIs
- [ ] Générer prédictions ML
- [ ] Explorer carte interactive
- [ ] Ajouter membres du personnel
- [ ] Gérer maintenance et réservations

### Pour Staff
- [ ] Se connecter (compte créé par admin)
- [ ] Inscrire nouveaux étudiants
- [ ] Planifier cours
- [ ] Signaler incidents
- [ ] Envoyer annonces

### Pour Étudiants
- [ ] Accéder portail `/student`
- [ ] Pointer présence
- [ ] Consulter annonces (à venir)

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2026  
**Auteurs** : Équipe SmartCampus360

🎓 **Université Technologique de Casablanca**
