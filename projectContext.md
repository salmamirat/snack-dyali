Contexte du projet
Hamid vient d'ouvrir un petit snack à Béni Mellal. Il change souvent ses plats et ses prix, mais il note encore tout sur un carnet. Il vous demande une petite application mobile pour gérer le menu de son snack : ajouter un plat, modifier son prix, le retirer quand il n'est plus disponible.

Problème : la connexion internet du snack est instable. Hamid veut que l'application synchronise automatiquement le menu en arrière-plan pour toujours afficher des données à jour, même quand il ouvre l'app sans réseau.

Votre mission : construire une application CRUD complète avec un backend Node.js documenté, et une application mobile Expo dont la fonctionnalité principale est la synchronisation en tâche de fond (background task).

⚠️ Le CRUD reste volontairement simple (une seule table). La vraie difficulté du projet, c'est la qualité : documentation de l'API, gestion du cache avec TanStack Query, et tâche de fond fiable.
2. Objectifs pédagogiques
À la fin de ce projet, vous serez capable de :

Créer une API REST avec Express (routes, contrôleurs, codes HTTP)
Connecter une base de données PostgreSQL et écrire des requêtes SQL de base
Documenter une API avec une spécification OpenAPI et l'exposer avec Scalar UI
Consommer une API avec Axios (instance configurée, gestion d'erreurs)
Gérer les données serveur avec TanStack Query : useQuery, useMutation, invalidation du cache
Mettre en place une tâche de fond avec expo-task-manager + expo-background-task pour synchroniser des données
Persister un cache local avec AsyncStorage (mode hors-ligne simple)
3. Fonctionnalités demandées
Must Have (obligatoire)
F1 — Lister les plats : écran d'accueil affichant tous les plats via useQuery
F2 — Ajouter un plat : formulaire (nom, prix, catégorie) via useMutation + invalidation
F3 — Modifier un plat : réutiliser le formulaire pré-rempli
F4 — Supprimer un plat : avec confirmation avant suppression
F5 — Disponibilité : marquer un plat disponible / non disponible (toggle)
F6 — Sync en arrière-plan ⭐ : tâche de fond qui récupère le menu et le stocke dans AsyncStorage. L'écran Liste affiche « Dernière synchro : il y a X min »
F7 — Documentation API : page /docs sur le backend avec Scalar UI décrivant les 5 endpoints
⭐ F6 — La fonctionnalité principale, en détail
Enregistrer une tâche avec expo-task-manager
La planifier avec expo-background-task (intervalle minimum autorisé par l'OS)
Dans la tâche : appeler GET /api/plats avec Axios → sauvegarder le JSON + un timestamp dans AsyncStorage
Au démarrage de l'app : si le réseau échoue, afficher les données du cache AsyncStorage avec un bandeau « Mode hors-ligne »
Afficher la date de dernière synchronisation sur l'écran Liste
💡 Les tâches de fond ne s'exécutent pas à la seconde près — c'est l'OS qui décide. Pour la démo, prévoyez aussi un bouton « Forcer la synchro » qui exécute la même fonction manuellement.
4. Stack technique
Backend : Node.js + Express
Base de données : PostgreSQL ( Sequelize ORM )
Documentation API : spécification OpenAPI + Scalar UI (@scalar/express-api-reference)
Mobile : React Native + Expo
Navigation : Expo Router .
Requêtes HTTP : Axios (instance avec baseURL)
Données serveur : TanStack Query (@tanstack/react-query)
Tâche de fond : expo-task-manager + expo-background-task
Cache local : @react-native-async-storage/async-storage
Test API : Postman, Thunder Client ou directement Scalar
5. Modèle de données
Une seule table : plats

id — SERIAL, PRIMARY KEY
nom — VARCHAR(100), NOT NULL
prix — NUMERIC(6,2), NOT NULL
categorie — VARCHAR(50), NOT NULL
disponible — BOOLEAN, DEFAULT true
created_at — TIMESTAMP, DEFAULT NOW()
6. API — Endpoints attendus
GET /api/plats — liste de tous les plats → 200
GET /api/plats/:id — détail d'un plat → 200
POST /api/plats — créer un plat → 201
PUT /api/plats/:id — modifier un plat → 200
DELETE /api/plats/:id — supprimer un plat → 204
GET /docs — documentation interactive Scalar UI → 200
Règles :

Toute réponse est en JSON
Un plat introuvable → 404 avec un message clair
Données invalides (nom vide, prix négatif) → 400
Chaque endpoint est décrit dans la spécification OpenAPI (résumé, paramètres, exemple de réponse)
7. Écrans de l'application mobile
Écran Liste — tous les plats (nom, prix, catégorie, badge disponible/indisponible), bouton flottant « + », bandeau « Dernière synchro » + bouton « Forcer la synchro »
Écran Formulaire — utilisé pour l'ajout ET la modification (même composant, pré-rempli en mode édition)
(Optionnel) Écran Détail — infos complètes d'un plat + boutons Modifier / Supprimer
💡 Règle d'or : ne commencez pas le mobile tant que votre API n'est pas testée et documentée sur `/docs`.
8. Bonus (uniquement si tout le Must Have fonctionne)
🔔 Notification locale (expo-notifications) quand la synchro détecte un changement dans le menu
⚡ Optimistic update sur le toggle disponibilité avec TanStack Query (onMutate / onError / rollback)
🔍 Filtre par catégorie + barre de recherche par nom
🔄 Pull-to-refresh branché sur refetch() de TanStack Query
🌐 Indicateur de connectivité en temps réel avec @react-native-community/netinfo
📄 Pagination de la liste (limit / offset côté API + useInfiniteQuery)
Bon courage ! 💪