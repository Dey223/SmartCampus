# 🚀 Guide de Collaboration - Smart Campus Platform

Bienvenue dans le projet **Smart Campus Platform** ! Ce guide vous aidera à configurer votre environnement de développement et à collaborer efficacement avec l'équipe.

---

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Lancement du projet](#lancement-du-projet)
5. [Architecture du projet](#architecture-du-projet)
6. [Workflow Git](#workflow-git)
7. [Docker](#docker)
8. [Déploiement](#déploiement)
9. [Ressources](#ressources)

---

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (v20 ou supérieur) - [Télécharger](https://nodejs.org/)
- **pnpm** (gestionnaire de paquets) - [Installation](https://pnpm.io/installation)
- **Git** - [Télécharger](https://git-scm.com/)
- **PostgreSQL** (v15+) ou accès à une base de données Neon - [Neon](https://neon.tech/)
- **Docker** (optionnel, pour la containerisation) - [Télécharger](https://www.docker.com/)

---

## 📥 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/Dey223/SmartCampus.git
cd SmartCampus
```

### 2. Installer les dépendances

```bash
pnpm install
```

---

## ⚙️ Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
cp .env.example .env.local
```

Remplissez les variables suivantes :

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Authentication
JWT_SECRET="votre-secret-jwt-tres-securise-ici"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Initialiser la base de données

Exécutez les migrations SQL dans l'ordre :

```bash
# Depuis la racine du projet
pnpm migrate
```

Ou manuellement :

```bash
psql $DATABASE_URL < scripts/001-create-tables.sql
psql $DATABASE_URL < scripts/002-add-indexes.sql
psql $DATABASE_URL < scripts/003-seed-data.sql
psql $DATABASE_URL < scripts/004-add-students-table.sql
psql $DATABASE_URL < scripts/005-add-announcements-table.sql
```

---

## 🚀 Lancement du projet

### Mode développement

```bash
pnpm dev
```

L'application sera accessible sur :
- **Admin** : http://localhost:3000 (ou http://localhost:3000/admin)
- **Staff** : http://localhost:3000/staff
- **Student** : http://localhost:3000/student

### Mode production

```bash
pnpm build
pnpm start
```

---

## 🏗️ Architecture du projet

```
smart-campus-platform/
├── app/                      # Pages Next.js (App Router)
│   ├── admin/               # Portail Admin
│   ├── staff/               # Portail Staff
│   ├── student/             # Portail Étudiant
│   ├── login/               # Page de connexion
│   └── api/                 # API Routes
├── components/              # Composants réutilisables
│   ├── dashboard/           # Composants Admin
│   ├── staff/               # Composants Staff
│   └── ui/                  # Composants UI (shadcn)
├── lib/                     # Utilitaires et configuration
│   ├── auth.ts              # Logique d'authentification
│   └── db.ts                # Configuration PostgreSQL
├── scripts/                 # Scripts SQL de migration
├── middleware.ts            # Middleware Next.js (routing multi-portail)
└── public/                  # Assets statiques
```

### Portails disponibles

| Portail   | URL (local)              | Rôle                          | Authentification |
|-----------|--------------------------|-------------------------------|------------------|
| **Admin** | `localhost:3000`         | Gestion complète du campus    | ✅ Requise       |
| **Staff** | `localhost:3000/staff`   | Gestion pédagogique           | ✅ Requise       |
| **Student** | `localhost:3000/student` | Pointage de présence         | ❌ Publique      |

---

## 🔀 Workflow Git

### Branches

- `main` : Branche de production (protégée)
- `develop` : Branche de développement
- `feature/nom-feature` : Nouvelles fonctionnalités
- `fix/nom-bug` : Corrections de bugs

### Workflow recommandé

1. **Créer une branche de feature**

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
```

2. **Faire vos modifications et commits**

```bash
git add .
git commit -m "feat: ajout de la fonctionnalité X"
```

3. **Pousser votre branche**

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

4. **Créer une Pull Request** sur GitHub

5. **Après validation, merger dans `main`**

### Convention de commits

Utilisez les préfixes suivants :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage, style
- `refactor:` Refactorisation
- `test:` Ajout de tests
- `chore:` Maintenance

---

## 🐳 Docker

### Construction de l'image

```bash
docker build -t smart-campus-platform .
```

### Lancement du conteneur

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="votre-url-database" \
  -e JWT_SECRET="votre-secret" \
  smart-campus-platform
```

### Docker Compose (recommandé)

Créez un fichier `docker-compose.yml` :

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    restart: unless-stopped
```

Puis lancez :

```bash
docker-compose up -d
```

---

## 🌐 Déploiement

### Vercel (Recommandé pour Next.js)

1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement à chaque push sur `main`

### Variables d'environnement Vercel

```
DATABASE_URL=postgresql://...
JWT_SECRET=...
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
```

### Configuration des sous-domaines (Production)

Pour activer les sous-domaines en production :

1. Configurez vos DNS :
   - `admin.votredomaine.com` → Vercel
   - `staff.votredomaine.com` → Vercel
   - `student.votredomaine.com` → Vercel

2. Le middleware gérera automatiquement le routing

---

## 📚 Ressources

### Documentation technique

- [TECHNOLOGIES_STACK.md](./TECHNOLOGIES_STACK.md) - Stack technique détaillée
- [IOT_REALTIME.md](./IOT_REALTIME.md) - Architecture IoT et temps réel
- [README.md](./README.md) - Documentation principale

### Technologies utilisées

- **Framework** : Next.js 16 (App Router)
- **UI** : Tailwind CSS 4, Radix UI, shadcn/ui
- **Base de données** : PostgreSQL (Neon)
- **Authentification** : JWT avec `jose`
- **Charts** : Recharts
- **Icons** : Lucide React

### Comptes de test

#### Admin
- Email : `admin@smartcampus.com`
- Mot de passe : `admin`

#### Staff
- Email : `staff@smartcampus.com`
- Mot de passe : `staff`

---

## 🤝 Contribution

### Avant de commencer

1. Assurez-vous que votre branche est à jour :
   ```bash
   git pull origin main
   ```

2. Vérifiez que les tests passent :
   ```bash
   pnpm lint
   pnpm build
   ```

3. Testez vos modifications localement

### Besoin d'aide ?

- Ouvrez une **Issue** sur GitHub
- Contactez l'équipe sur le canal Slack/Discord du projet
- Consultez la documentation technique

---

## 📝 Notes importantes

> [!IMPORTANT]
> - Ne commitez **jamais** le fichier `.env.local`
> - Testez toujours vos migrations SQL sur une base de développement avant la production
> - Respectez les conventions de code (ESLint, Prettier)

> [!TIP]
> - Utilisez `pnpm dev` avec le flag `--turbo` pour un rechargement plus rapide
> - Activez les extensions VSCode recommandées (ESLint, Prettier, Tailwind CSS IntelliSense)

---

**Bon développement ! 🚀**
