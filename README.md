# 🍔 Snack Dyali

Application fullstack de gestion du menu d'un snack à Béni Mellal.  
**Backend** Node.js/Express/PostgreSQL + **Mobile** React Native (Expo).

---

## 📁 Structure du projet

```
snack-dyali/
├── backend/          # API REST Node.js + Express + Sequelize
│   ├── config/       # Configuration base de données
│   ├── controllers/  # Logique métier (CRUD plats)
│   ├── docs/         # Spécification OpenAPI
│   ├── models/       # Modèle Sequelize (Plat)
│   ├── routes/       # Routes Express
│   └── server.js     # Point d'entrée
├── mobile/           # Application Expo (React Native)
│   └── src/
│       ├── api/          # Instance Axios configurée
│       ├── app/          # Écrans (Expo Router)
│       ├── components/   # Composants réutilisables
│       ├── hooks/        # Custom hooks (usePlats, usePlatMutations)
│       ├── schemas/      # Validation Zod
│       ├── services/     # Tâche de fond (background sync)
│       ├── styles/       # Design tokens (couleurs)
│       ├── types/        # Interfaces TypeScript
│       └── utils/        # Utilitaires (formatage dates)
└── README.md
```

---

## 🛠️ Installation

### Prérequis

- Node.js v18+
- PostgreSQL 14+
- Expo CLI (`npm install -g expo-cli`)
- Un émulateur Android/iOS ou l'app Expo Go

### 1. Base de données

Créer une base PostgreSQL nommée `snack_dyali` :

```sql
CREATE DATABASE snack_dyali;
```

La table `plats` est créée automatiquement par Sequelize au démarrage du serveur. Schéma :

```sql
CREATE TABLE plats (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prix NUMERIC(6,2) NOT NULL,
  categorie VARCHAR(50) NOT NULL,
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Backend

```bash
cd backend
npm install
```

Configurer le fichier `.env` :

```env
PORT=3000
DB_NAME=snack_dyali
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

Lancer le serveur :

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`.

### 3. Mobile

```bash
cd mobile
npm install
npm start
```

Scanner le QR code avec Expo Go ou lancer sur un émulateur (`a` pour Android, `i` pour iOS).

---

## 📖 Documentation API

La documentation interactive est disponible sur **http://localhost:3000/docs** (Scalar UI).

### Endpoints

| Méthode | Route            | Description          | Code |
|---------|------------------|----------------------|------|
| GET     | /api/plats       | Liste des plats      | 200  |
| GET     | /api/plats/:id   | Détail d'un plat     | 200  |
| POST    | /api/plats       | Créer un plat        | 201  |
| PUT     | /api/plats/:id   | Modifier un plat     | 200  |
| DELETE  | /api/plats/:id   | Supprimer un plat    | 204  |

### Gestion d'erreurs

- `404` : Plat introuvable
- `400` : Données invalides (nom vide, prix négatif)
- `500` : Erreur serveur

---

## ⭐ Tâche de fond — Synchronisation

C'est la fonctionnalité principale du projet.

### Fonctionnement

1. **Enregistrement** : Au démarrage de l'app, une tâche de fond est enregistrée via `expo-task-manager` + `expo-background-task`.
2. **Exécution** : L'OS décide quand exécuter la tâche (intervalle minimum ~15 min). La tâche appelle `GET /api/plats` avec Axios et sauvegarde le résultat + un timestamp dans `AsyncStorage`.
3. **Mode hors-ligne** : Si le réseau échoue au lancement de l'app, les données du cache `AsyncStorage` sont affichées avec un bandeau "Mode hors-ligne".
4. **Dernière synchro** : La date de dernière synchronisation est affichée sur l'écran Liste ("il y a X min").
5. **Forcer la synchro** : Un bouton permet de déclencher manuellement la synchronisation (pull-to-refresh ou bouton refresh).
6. **Notifications** : Si la synchro détecte un changement dans le menu, une notification locale est envoyée.
7. **NetInfo** : L'indicateur de connectivité en temps réel utilise `@react-native-community/netinfo`.

### Fichier clé

`mobile/src/services/backgroundTask.ts` contient toute la logique :
- `defineTask()` pour définir ce que fait la tâche
- `registerBackgroundSync()` pour l'enregistrer auprès de l'OS

---

## 🎯 Fonctionnalités

### Must Have
- ✅ F1 — Lister les plats (useQuery + cache AsyncStorage)
- ✅ F2 — Ajouter un plat (useMutation + invalidation)
- ✅ F3 — Modifier un plat (formulaire pré-rempli)
- ✅ F4 — Supprimer un plat (avec confirmation Alert)
- ✅ F5 — Toggle disponibilité (optimistic update)
- ✅ F6 — Sync en arrière-plan (expo-task-manager + AsyncStorage)
- ✅ F7 — Documentation API (/docs avec Scalar UI)

### Bonus
- ✅ Notification locale quand la synchro détecte un changement
- ✅ Optimistic update sur le toggle disponibilité
- ✅ Filtre par catégorie + barre de recherche
- ✅ Pull-to-refresh branché sur refetch()
- ✅ Indicateur de connectivité en temps réel (NetInfo)

---

## 🧪 Démo (5 minutes)

1. Lancer le backend (`cd backend && npm run dev`)
2. Lancer le mobile (`cd mobile && npm start`)
3. Parcours CRUD : créer un plat → modifier → toggle disponibilité → supprimer
4. Couper le backend (Ctrl+C) → ouvrir l'app → bandeau "Mode hors-ligne" visible, données du cache affichées
5. Relancer le backend → appuyer sur "Forcer la synchro" (pull down) → données mises à jour
