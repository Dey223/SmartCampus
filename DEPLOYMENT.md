# 🚀 Guide de Déploiement Vercel - Smart Campus Platform

## Étape 1 : Préparation

### Variables d'environnement nécessaires

Vous aurez besoin de ces variables :

```env
# Base de données PostgreSQL (Neon)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Authentification JWT
JWT_SECRET="votre-secret-jwt-minimum-32-caracteres-tres-securise"

# URL de l'application
NEXT_PUBLIC_APP_URL="https://votre-app.vercel.app"

# Service Python (optionnel pour démo)
PYTHON_SERVICE_URL="http://localhost:5000"
```

---

## Étape 2 : Déploiement sur Vercel

### Option A : Via l'interface web (Recommandé)

1. **Allez sur [vercel.com](https://vercel.com)**
2. **Connectez-vous** avec votre compte GitHub
3. **Cliquez sur "Add New Project"**
4. **Importez votre repository** : `Dey223/SmartCampus`
5. **Configurez les variables d'environnement** :
   - Cliquez sur "Environment Variables"
   - Ajoutez chaque variable (voir ci-dessus)
6. **Déployez** : Cliquez sur "Deploy"

### Option B : Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Suivez les instructions :
# - Link to existing project? No
# - Project name: smart-campus-platform
# - Directory: ./
# - Override settings? No

# Ajouter les variables d'environnement
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_APP_URL

# Redéployer avec les variables
vercel --prod
```

---

## Étape 3 : Configuration de la Base de Données

### Si vous n'avez pas encore de base Neon :

1. **Allez sur [neon.tech](https://neon.tech)**
2. **Créez un compte gratuit**
3. **Créez un nouveau projet** : "SmartCampus"
4. **Copiez la connection string**
5. **Exécutez les migrations** :

```bash
# Depuis votre machine locale
export DATABASE_URL="votre-connection-string"
pnpm migrate
```

Ou manuellement via l'interface Neon SQL Editor :
- Copiez le contenu de `scripts/001-create-tables.sql`
- Exécutez dans l'éditeur SQL
- Répétez pour les autres scripts

---

## Étape 4 : Vérification du Déploiement

Une fois déployé, testez :

1. ✅ **Page d'accueil** : `https://votre-app.vercel.app`
2. ✅ **Login Admin** : `https://votre-app.vercel.app/login`
3. ✅ **Portail Staff** : `https://votre-app.vercel.app/staff`
4. ✅ **Portail Student** : `https://votre-app.vercel.app/student`

**Comptes de test :**
- Admin : `admin@smartcampus.com` / `admin`
- Staff : `staff@smartcampus.com` / `staff`

---

## Étape 5 : Service Python (Optionnel)

> [!NOTE]
> Le service Python ML ne peut pas tourner sur Vercel (serverless).
> Pour la démo, vous avez 2 options :

### Option 1 : Désactiver temporairement
Le bouton "Générer Prédictions" ne fonctionnera pas, mais tout le reste oui.

### Option 2 : Déployer Python séparément

**Sur Render.com (gratuit) :**

1. Allez sur [render.com](https://render.com)
2. Créez un "Web Service"
3. Connectez votre repo GitHub
4. Configuration :
   - **Root Directory** : `python-services/energy-analytics`
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `python app.py`
   - **Port** : `5000`
5. Déployez
6. Copiez l'URL (ex: `https://smart-campus-ml.onrender.com`)
7. Ajoutez dans Vercel :
   ```
   PYTHON_SERVICE_URL=https://smart-campus-ml.onrender.com
   ```

---

## 🎯 Checklist Déploiement

- [ ] Repository GitHub à jour
- [ ] Base de données Neon créée
- [ ] Migrations SQL exécutées
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Projet déployé sur Vercel
- [ ] Tests de connexion (Admin/Staff/Student)
- [ ] (Optionnel) Service Python déployé sur Render

---

## 🐛 Problèmes Courants

### "Database connection failed"
→ Vérifiez que `DATABASE_URL` est bien configuré dans Vercel

### "JWT secret missing"
→ Ajoutez `JWT_SECRET` dans les variables d'environnement

### "Prédictions ML ne marchent pas"
→ Normal si `PYTHON_SERVICE_URL` n'est pas configuré (service Python non déployé)

### "Build failed"
→ Vérifiez les logs Vercel, souvent un problème de dépendances

---

## 📝 Notes Importantes

> [!IMPORTANT]
> - Vercel gratuit : 100 GB bandwidth/mois (largement suffisant pour démo)
> - Neon gratuit : 0.5 GB storage (suffisant pour projet)
> - Render gratuit : Service s'endort après 15 min d'inactivité (premier appel lent)

> [!TIP]
> Pour la présentation, déployez 24h avant pour vérifier que tout fonctionne !

---

**Votre app sera accessible publiquement !** 🌍

Partagez le lien avec vos profs et collaborateurs : `https://votre-app.vercel.app`
