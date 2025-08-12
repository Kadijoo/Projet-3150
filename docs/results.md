# Résultats

## Fonctionnalités

Les fonctionnalités mises en œuvre dans TestMyMenu couvrent l’ensemble des besoins définis lors de l’analyse :

*Gestion des comptes utilisateurs

 - Création de comptes distincts pour les clients et les restaurateurs.

 - Authentification sécurisée avec JWT et gestion des rôles.

*Gestion des menus et plats (côté restaurateur)

 - Création, modification, publication et suppression de plats et menus.

 - Possibilité d’ajouter une description, des ingrédients et des images.

 - Possibilité de donner des avis.

*Consultation et interaction (côté client)

 - Accès aux menus et plats en attente de validation.

 - Soumission d’avis avec note et commentaire.

## Démonstration

Le système a été testé et validé à travers plusieurs scénarios:

1. Interface de création de plat/menu

    - Formulaire intuitif avec champs obligatoires et validation en temps réel.

2. Page d’avis côté client

    - Affichage clair des plats, possibilité de voter et de commenter.

3. Tableau de bord restaurateur

   - Vue synthétique des menus/plats créés, avec accès direct à la modification ou la suppression.

4. Barre de recherche

   - Recherche dynamique filtrant les résultats au fur et à mesure de la saisie.

## Bilan

L’ensemble des objectifs définis en début de projet a été atteint :

   - Les clients peuvent donner leur avis avant la mise en vente d’un plat, permettant aux restaurateurs de réduire le risque d’échec commercial.

   - L’interface est intuitive, rapide et responsive.

   - Les interactions entre restaurateurs et clients sont facilitées, encourageant un échange constructif.

Points forts atteints :

   - Respect du planning de développement.

   - Application fonctionnelle et stable.

   - Séparation claire du frontend et du backend pour faciliter les évolutions futures.

Perspectives d’amélioration :

   - Intégration d’analyses plus poussées grâce au traitement du langage naturel (NLP) pour analyser les avis.

   - Mise à jour en temps réel des avis grâce aux WebSockets.

   - Filtrage des avis
