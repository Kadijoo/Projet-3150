# Études préliminaires

## Analyse du problème

- Aujourd’hui, les clients n’ont souvent aucun moyen direct d’interagir avec un restaurant avant qu’un menu ne soit officiellement mis en ligne. Les restaurateurs, de leur côté, n’ont pas toujours la possibilité de tester leurs idées ou d’obtenir des retours concrets avant de lancer un nouveau plat. Cela crée un décalage entre l’offre et les attentes réelles des clients.
Le projet vise donc à créer un espace d’échange entre restaurants et clients autour des propositions de menus avant leur publication, favorisant la co-création, la fidélisation et une meilleure adaptation aux goûts locaux.

## Exigences

- Lister les exigences fonctionnelles: 
. Inscription et connexion des utilisateurs (clients et restaurateurs)
. Publication de menus en phase de test (non publics).
. Notification aux clients pour recueillir leurs avis. 
. Système de filtrage des messages selon les tags de connaissance, mots cles, score totale.
. Affichage des restaurants (récupérés via une API)
. Interface pour que le restaurateur puisse consulter, filtrer et répondre

- Liste des exigences non fonctionnelles.
. Interface responsive (adaptée mobile et desktop).
. Système sécurisé d’authentification (JWT ou Firebase Auth).
. Disponibilité et performance : réponse rapide aux requêtes.
. Base de données structurée pour gérer les utilisateurs, menus, avis, et discussions.
. Accessibilité simple et intuitive pour les utilisateurs.

## Recherche de solutions

- Uber Eats / Doordash : proposent une vitrine de restaurants avec commande en ligne, mais pas de système collaboratif en amont des menus.
Choix retenu :
Créer une plateforme centrée sur l’échange client-restaurateur autour des idées de menus. Le concept se différencie par son approche participative et la mise en place de filtres permettant aux restaurateurs de cibler les retours utiles.
Ce projet ne vise pas à concurrencer Uber Eats, mais à combler un vide en amont de la publication de menus.

## Méthodologie
- Prototypage avec Figma : Création des interfaces pour valider l’expérience utilisateur.
- Architecture MVC : Séparation claire entre les données (MongoDB), la logique (Node/Express) et l’interface (React).
- Développement agile : Avancement par étapes avec des versions fonctionnelles intermédiaires.
- Tests utilisateurs (si possible) : pour recueillir des retours sur l’ergonomie et l’efficacité du système d'echange.
- Itérations : Amélioration continue à partir des retours et tests.

