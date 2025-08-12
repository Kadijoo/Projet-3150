# Suivi de projet

## Semaine 1

!!! info "Notes"
    - Il est possible que nous révisions les exigences après le prototypage

!!! warning "Difficultés rencontrées"
    - Le plugin Mermaid n'était pas reconnu : confusion entre `mkdocs-mermaid2-plugin` (pip) et `mermaid2` (plugin name)
        - Résolu après nettoyage et configuration correcte dans `mkdocs.yml`

!!! abstract "Prochaines étapes"
    - Démarrer l’analyse du problème
    - Créer la structure de `etudes_preliminaires.md`

---

## Semaine 2

!!! Recherche
    - Recherche d'une API Google
      Étude de l’API Google Places pour récupérer des informations détaillées sur les restaurants 
    - Analyse fonctionnelle d’Uber Eats:
      Observation des fonctionnalités offertes par Uber Eats ,
      Interaction avec les clients,
      Notifications et suggestions,
      Interface utilisateur pour les deux rôles (client / restaurateur) 
    - usage des formulaire 


## Semaine 3

Analyse, exploration technique et début de conception

    - Exploration technique : Test de l’API Google Places via Postman afin d’examiner les données retournées (informations sur les    restaurants,   avis, coordonnées, etc.) et évaluer son intégration potentielle dans le projet.
    - Analyse fonctionnelle : Début de l’étape d’analyse du projet, identification des besoins utilisateurs et des fonctionnalités clés à développer.
    - Modélisation : Conception du diagramme de classe, représentant les différentes entités (utilisateur, restaurant, menu, message, etc.), leurs attributs, et les relations entre elles.
    - Conception UI/UX : Lancement du prototypage de l’interface utilisateur avec Figma : création des premières maquettes des pages principales (accueil, inscription, espace feedback, espace restaurateur,  menu cote client,menu cote restaurateur, liste des feedback cote restaurateur etc..).

## Semaine 4

Finalisation du prototype, avancée de la conception et recherche d'une nouvelle alternative d'API

    - Finalisation du prototype Figma : Intégration des ajustements et retours reçus afin d’améliorer l’expérience utilisateur. Le prototype couvre désormais les principales interfaces du projet 
    - Poursuite de la modélisation : Affinement du diagramme de classe avec ajout ou révision des relations, méthodes et attributs en fonction des nouvelles exigences identifiées.
    - Début du diagramme de cas d’utilisation : Identification des scénarios principaux entre les différents acteurs (client, restaurateur, système), en préparation de la phase de développement.
    - Exploration d’alternatives à l’API Google Places pour récupérer des informations détaillées sur les menus des restaurants, cette fonctionnalité n’étant pas couverte directement par L'API Places. 
    Des pistes comme l’intégration de bases de données internes, des APIs de gestion de menu, ou des solutions hybrides (scraping autorisé + API privées) sont envisagées.

## Semaine 5

!!! info " Finalisation des spécifications techniques"
    - **Diagramme de classes** :
        - Intégration des dernières modifications (liens entre entités, ajustement des attributs et relations).
        - Ajout de nouveaux éléments en fonction des besoins identifiés : relations supplémentaires, types d’utilisateur, structure des avis et votes.
    - **Prototype Figma** :
        - Mise à jour de l’interface graphique pour refléter les modifications fonctionnelles apportées au diagramme de classes.
        - Prise en compte des **retours utilisateurs et encadrants** pour améliorer l’expérience UI/UX.
    - L’objectif de cette phase était de valider définitivement le **modèle de données** et la **navigation utilisateur** avant de passer à l’implémentation.

---

## Semaine 6

!!! info " Préparation de l’environnement de développement"
    - **Installation des outils** :
        - Mise en place des environnements côté **frontend** et **backend**.
        - Installation de **Node.js**, **Express**, **MongoDB**, **Mongoose**, et de dépendances nécessaires (comme `dotenv`, `cors`, `nodemon`, etc.).
        - Création d’un projet React via **Vite** pour bénéficier d’une structure rapide et optimisée.
    - **Début de l’implémentation** :
        - **Backend** : configuration du serveur Express (`server.js`), mise en place de la connexion à MongoDB, définition des premières routes et contrôle de base.
        - **Frontend** : création de la structure de l’application React, composants de base, configuration des routes avec React Router.
    - Cette semaine marque **la transition entre la conception** et le **début concret du développement technique**.


## Semaine 7

!!! note " Début de l’implémentation Backend & Frontend"
    - **Backend** :
        - Début de l’implémentation avec la stack MERN (MongoDB, Express, React, Node.js).
        - Création du premier **diagramme de classe**.
        - Modélisation des premières entités : `Restaurant`, `Menu`, `Plat`, `Ingrédient`, `Catégorie`, etc.
        - Mise en place des **controllers**, **routes**, et du fichier `server.js` pour connecter le backend à **MongoDB**.
    - **Frontend** :
        - Installation de React avec **Vite** pour une configuration plus rapide et légère.
        - Début de la mise en page de l’**accueil** et des **formulaires de connexion**.

---

## Semaine 8

!!! note " Améliorations structurelles Backend & Frontend"
    - **Backend** :
        - Intégration des retours sur le diagramme de classe : ajustement et ajout de champs aux modèles existants.
        - **Validation des données** ajoutée dans les modèles Mongoose.
        - Modification des `controllers` et `routes` selon le nouveau schéma de données.
    - **Frontend** :
        - Création des pages supplémentaires : **Menu**, **Formulaire de création de plat**, **Feedback utilisateur**.
        - Adaptation du Figma en fonction des nouvelles remarques fonctionnelles.

---

## Semaine 9

!!! note " Finalisation de la structure Backend & validation"
    - **Backend** :
        - Finalisation de la **validation des données** dans les modèles Mongoose.
        - Introduction des **middlewares de validation** pour les routes POST.
        - Réorganisation des routes pour réduire la complexité et favoriser l’imbrication logique (`/menus/:id/plats`...).
        - Début des **tests unitaires** pour les entités clés (`Menu`, `Plat`, `Avis`) afin de vérifier le bon fonctionnement des routes, contrôleurs et réponses.
    - **Frontend** :
        - Implémentation des pages restantes : **page restaurant**, **feedback côté utilisateur**, **interface côté restaurateur**.


## Semaine 10

!!! note "Travail sur les formulaires frontend & design"

-Amélioration des formulaires (création de plat, création de menu, dépôt d’avis).
-Conception et intégration du design de la barre de recherche pour un rendu plus ergonomique et centré.

## Semaine 11

!!! note "Amélioration du design global"

-Optimisation du design des pages pour une meilleure cohérence visuelle.
-Amélioration du footer pour un affichage plus clair et harmonisé sur toutes les pages.

## Semaine 12

!!! note "Début du rapport & connexions frontend–backend"

-Rédaction des premières sections du rapport de projet (introduction, analyse des besoins).
-Mise en place des premières connexions entre le frontend et le backend via API REST.

## Semaine 13

!!! note "Finalisation rapport & connexions"

-Finalisation complète du rapport écrit.
-Finalisation et tests des connexions frontend–backend.
-Vérification du bon fonctionnement des flux entre les formulaires, l’API et la base de données.
