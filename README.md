# Smart Campus Platform 🏫

Une plateforme intelligente et complète pour la gestion intégrée des campus universitaires et d'entreprise. Suivez en temps réel l'énergie, les espaces, la maintenance et les réservations avec un dashboard intuitif et performant.

## 🎯 Fonctionnalités Principales

### 📊 Dashboard Centralisé
- **KPIs en temps réel** : Nombre de bâtiments, salles, consommation d'énergie et occupancy
- **Visualisations interactives** : Graphiques de consommation d'énergie et d'occupation
- **Alertes intelligentes** : Détection automatique des anomalies et problèmes
- **Résumés de maintenance** : État des tickets et équipements

### ⚡ Gestion de l'Énergie
- **Suivi multi-sources** : Électricité, eau, gaz, énergie solaire
- **Analyse par bâtiment** : Consommation détaillée et comparaisons
- **Alertes énergétiques** : Détection des sur-consommations
- **Données en temps réel** : Température, production solaire, métriques par m²

### 🏢 Gestion des Espaces
- **Occupancy tracking** : Suivi en direct de l'occupation des salles
- **Tendances d'utilisation** : Analyse historique des patterns
- **Heatmaps** : Visualisation de la répartition des présences
- **Capacité vs occupation** : Optimisation de l'utilisation des espaces

### 🔧 Gestion de la Maintenance
- **Système de tickets** : Signalement, suivi et résolution des problèmes
- **Priorités et statuts** : Open, In Progress, Pending Parts, Resolved
- **Équipements** : Gestion du parc d'équipements par bâtiment
- **Assignation** : Distribution des tâches aux techniciens
- **Dashboard maintenance** : Statistiques et tendances

### 📅 Gestion des Réservations
- **Calendrier intuitif** : Vue visuelle des réservations
- **Sélecteur de salles** : Filtrage par bâtiment et type
- **Réservations récurrentes** : Support des événements répétés
- **Gestion d'accès** : Attribution des salles aux utilisateurs
- **Capacité garantie** : Respect des limites de chaque salle

## 🛠️ Stack Technique

**Frontend:**
- **Framework**: Next.js 16 (React 19)
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS + PostCSS
- **Charts**: Recharts (graphiques interactifs)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

**Backend:**
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: PostgreSQL (Neon serverless)
- **Query Client**: Neon serverless SDK

**Deployment:**
- **Platform**: Vercel (optimisé pour Next.js)
- **Analytics**: Vercel Analytics

## 📦 Installation

### Prérequis
- Node.js 18+
- pnpm (gestionnaire de paquets)
- PostgreSQL (ou Neon Database)

### Étapes

1. **Cloner le projet**
```bash
git clone https://github.com/votre-username/smart-campus-platform.git
cd smart-campus-platform
```

2. **Installer les dépendances**
```bash
pnpm install
```

3. **Configurer l'environnement**
Créer un fichier `.env.local` :
```env
DATABASE_URL=postgresql://user:password@host/database
```

4. **Initialiser la base de données**
```bash
# Créer le schéma
psql -f scripts/001-create-smartcampus-schema.sql

# Importer les bâtiments et salles
psql -f scripts/002-seed-buildings-rooms.sql

# Ajouter des données de démonstration
psql -f scripts/003-seed-sample-data.sql
```

5. **Démarrer le serveur de développement**
```bash
pnpm dev
```

Accéder à l'application sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
smart-campus-platform/
├── app/                          # Application Next.js
│   ├── page.tsx                 # Dashboard principal
│   ├── energy/                  # Module énergie
│   ├── maintenance/             # Module maintenance
│   ├── reservations/            # Module réservations
│   ├── presence/                # Module occupancy
│   ├── buildings/               # Module bâtiments
│   └── api/
│       └── simulate/            # Endpoints de simulation
├── components/                   # Composants React réutilisables
│   ├── dashboard/               # Composants du dashboard
│   ├── energy/                  # Composants du module énergie
│   ├── maintenance/             # Composants du module maintenance
│   ├── reservations/            # Composants du module réservations
│   ├── presence/                # Composants du module occupancy
│   └── ui/                      # Composants d'interface (Radix UI)
├── hooks/                        # Hooks React personnalisés
│   ├── use-mobile.ts            # Détection responsive
│   └── use-toast.ts             # Notifications
├── lib/
│   ├── db.ts                    # Configuration PostgreSQL
│   └── utils.ts                 # Fonctions utilitaires
├── public/                       # Fichiers statiques
├── scripts/                      # Scripts SQL
├── styles/                       # Styles globaux
└── [configs]                     # next.config.mjs, tsconfig.json, etc.
```

## 🚀 Démarrage Rapide

### Mode Développement
```bash
pnpm dev
```
L'application démarre sur [http://localhost:3000](http://localhost:3000)

### Build Production
```bash
pnpm build
pnpm start
```

### Linting
```bash
pnpm lint
```

## 🎨 Pages et Routes

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Vue d'ensemble du campus |
| Énergie | `/energy` | Suivi de la consommation énergétique |
| Maintenance | `/maintenance` | Gestion des tickets et équipements |
| Réservations | `/reservations` | Calendrier et gestion des salles |
| Présence | `/presence` | Occupancy et heatmaps |
| Bâtiments | `/buildings` | Liste et détails des bâtiments |

## 📊 Modèle de Données

### Entités Principales
- **Buildings**: Bâtiments du campus avec surface totale
- **Rooms**: Salles avec capacité et type
- **Energy Readings**: Consommations énergétiques (électricité, eau, gaz, solaire)
- **Presence Readings**: Données d'occupation en temps réel
- **Maintenance Tickets**: Tickets d'intervention technique
- **Equipment**: Équipements et actifs du campus
- **Reservations**: Réservations de salles avec calendrier

## 🔌 API Endpoints

### Simulation (pour tests)
- `POST /api/simulate` - Génère des données de test

## 🌐 Déploiement

### Déployer sur Vercel (Recommandé)

1. **Push sur GitHub**
```bash
git push origin main
```

2. **Connecter Vercel**
- Aller sur [vercel.com](https://vercel.com)
- Importer le repository GitHub
- Ajouter la variable d'environnement `DATABASE_URL`
- Cliquer sur "Deploy"

### Variables d'Environnement Requises
```
DATABASE_URL        # Chaîne de connexion PostgreSQL
```

## 🔒 Sécurité

- ✅ Validation des données avec Zod
- ✅ Parameterized SQL queries (prévention SQL injection)
- ✅ HTTPS enforced en production
- ✅ TypeScript pour la sécurité des types
- ✅ Input sanitization

## 📈 Performance

- 🚀 **Server-side rendering** (SSR) pour SEO
- ⚡ **Incremental Static Regeneration** (ISR)
- 📦 **Code splitting** automatique
- 🖼️ **Image optimization** avec Next.js
- 🔄 **Caching stratégique** des données

## 🐛 Dépannage

### Port 3000 déjà utilisé
```bash
pnpm dev -- -p 3001
```

### Erreur de connexion à la base
- Vérifier la variable `DATABASE_URL`
- S'assurer que PostgreSQL est accessible
- Vérifier les scripts de migration

### Problèmes TypeScript
```bash
pnpm build  # Affiche les erreurs de type
```

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📧 Contact & Support

Pour toute question ou support :
- Créer une issue sur GitHub
- Envoyer un email : support@smartcampus.dev

## 🙏 Remerciements

- **Next.js** - Framework React moderne
- **Radix UI** - Composants accessibles de haute qualité
- **Tailwind CSS** - Utility-first CSS framework
- **Neon** - Database PostgreSQL serverless
- **Vercel** - Plateforme de déploiement

---

**Dernière mise à jour** : Janvier 2026  
**Statut** : En développement actif 🚀

