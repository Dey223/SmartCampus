# 🎓 Guide de Collaboration - Smart Campus Platform

Bienvenue sur le projet **Smart Campus** ! Ce guide vous aidera à configurer votre environnement de développement, que vous préfériez travailler en local ou avec Docker.

## 🚀 Prérequis

*   **Node.js** (v18 ou supérieur) `node -v`
*   **pnpm** (Gestionnaire de paquets) `npm install -g pnpm`
*   **Git** `git --version`
*   **(Optionnel) Docker Desktop** pour la conteneurisation

## 📥 Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/Dey223/SmartCampus.git
cd SmartCampus

# 2. Installer les dépendances
pnpm install
```

## ⚙️ Configuration (.env)

Créez un fichier `.env.local` à la racine du projet. Copiez-y les clés nécessaires (demandez à l'admin pour les valeurs de prod).

```env
# Exemple de configuration (NE PAS COMMITER LES VRAIS SECRETS)
DATABASE_URL="postgres://user:password@host:port/dbname"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 💻 Développement Local

Pour lancer le serveur de développement avec rechargement à chaud :

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

*   **Admin** : `localhost:3000/admin`
*   **Staff** : `localhost:3000/staff`
*   **Student** : `localhost:3000/student` (accès direct)

---

## 🐳 Utilisation avec Docker

Nous utilisons un build multi-stage pour optimiser la taille de l'image.

### 1. Construire l'image

```bash
docker build -t smart-campus-app .
```

### 2. Lancer le conteneur

```bash
docker run -p 3000:3000 smart-campus-app
```

L'application sera accessible sur `http://localhost:3000`.

> **Note** : Si vous avez besoin de la base de données en local, assurez-vous que votre conteneur peut accéder à votre réseau local ou à votre base de données cloud (via les variables d'environnement).

---

## 🤝 Workflow Git

1.  Assurez-vous d'être sur la branche principale à jour : `git checkout main && git pull`
2.  Créez une branche pour votre feature : `git checkout -b feature/ma-super-feature`
3.  Commitez vos changements : `git commit -m "feat: ajout de la super feature"`
4.  Poussez et créez une PR : `git push origin feature/ma-super-feature`

## 🛠️ Structure du Projet

*   `/app` : Pages et API (Next.js App Router)
*   `/components` : Composants Réutilisables (UI, Dashboard, etc.)
*   `/lib` : Utilitaires (Auth, DB, Utils)
*   `/scripts` : Scripts SQL pour la base de données

Bon code ! 🚀
