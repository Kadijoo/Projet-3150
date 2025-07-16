// Middlewares de validation

// === 1. AVIS ===
exports.validateAvis = (req, res, next) => {
  const { contenu, note, auteur, cible, cibleModel } = req.body;

  if (!contenu || contenu.length < 3 || contenu.length > 1000) {
    return res.status(400).json({ error: "Le contenu de l'avis doit contenir entre 3 et 1000 caractères." });
  }

  if (note === undefined || typeof note !== "number" || note < 0 || note > 5) {
    return res.status(400).json({ error: "La note doit être un nombre entre 0 et 5." });
  }

  if (!auteur || !cible || !cibleModel) {
    return res.status(400).json({ error: "L'auteur, la cible et le modèle de cible sont requis." });
  }

  if (!["Menu", "Plat"].includes(cibleModel)) {
    return res.status(400).json({ error: "Le champ cibleModel doit être soit 'Menu' soit 'Plat'." });
  }

  next();
};


// === 2. CATEGORIE ===
exports.validateCategorie = (req, res, next) => {
  const { nom } = req.body;

  if (!nom || nom.trim() === "") {
    return res.status(400).json({ error: "Le nom de la catégorie est requis." });
  }

  next();
};


// === 3. INGREDIENT ===
exports.validateIngredient = (req, res, next) => {
  const { nom, categorie } = req.body;

  if (!nom || nom.trim() === "") {
    return res.status(400).json({ error: "Le nom de l'ingrédient est requis." });
  }

  if (!categorie) {
    return res.status(400).json({ error: "La catégorie de l'ingrédient est requise." });
  }

  next();
};


//---- Menu---------------


exports.validateMenu = (req, res, next) => {
  const { titre, statut, restaurant } = req.body;

  if (!titre || titre.trim() === "") {
    return res.status(400).json({ error: "Le titre du menu est requis." });
  }

  if (statut && !["actif", "inactif", "archive"].includes(statut)) {
    return res.status(400).json({ error: "Le statut du menu doit être 'actif', 'inactif' ou 'archive'." });
  }

  if (!restaurant) {
    return res.status(400).json({ error: "Le restaurant associé au menu est requis." });
  }

  next();
};

//--------MenuItem-----


exports.validateMenuItem = (req, res, next) => {
  const { position, nom, statut, section } = req.body;

  if (position === undefined || typeof position !== "number" || position < 0) {
    return res.status(400).json({ error: "La position est requise et doit être un nombre positif." });
  }

  if (!nom || nom.trim() === "") {
    return res.status(400).json({ error: "Le nom du menu item est requis." });
  }

  if (statut && !["actif", "inactif", "en_attente"].includes(statut)) {
    return res.status(400).json({ error: "Le statut doit être 'actif', 'inactif' ou 'en_attente'." });
  }

  if (!section) {
    return res.status(400).json({ error: "La section du menu item est requise." });
  }

  next();
};


//-------Notification------

exports.validateNotification = (req, res, next) => {
  const { message, utilisateur, lu } = req.body;

  // Validation stricte pour les requêtes POST (création)
  if (req.method === "POST") {
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Le message de la notification est requis." });
    }

    if (!utilisateur) {
      return res.status(400).json({ error: "L'utilisateur concerné est requis." });
    }
  }

  // Validation optionnelle pour les mises à jour (PUT)
  if (lu !== undefined && typeof lu !== "boolean") {
    return res.status(400).json({ error: "Le champ 'lu' doit être un booléen." });
  }

  next();
};


//-------Plats-----

exports.validatePlatOnCreate = (req, res, next) => {
  const { nom, prix, menu } = req.body;

  if (!nom || nom.trim() === "") {
    return res.status(400).json({ error: "Le nom du plat est requis." });
  }

  if (prix === undefined || typeof prix !== "number" || prix < 0) {
    return res.status(400).json({ error: "Le prix du plat doit être un nombre positif." });
  }

  if (!menu) {
    return res.status(400).json({ error: "Le menu auquel appartient le plat est requis." });
  }

  next();
};

/*exports.validatePlatOnUpdate = (req, res, next) => {
  const { nom, prix } = req.body;

  if (nom !== undefined && nom.trim() === "") {
    return res.status(400).json({ error: "Le nom du plat ne peut pas être vide." });
  }

  if (prix !== undefined && (typeof prix !== "number" || prix < 0)) {
    return res.status(400).json({ error: "Le prix du plat doit être un nombre positif." });
  }

  next();
};*/
exports.validatePlatOnUpdate = (req, res, next) => {
  const { nom, prix, menu } = req.body;

  if (nom !== undefined && nom.trim() === "") {
    return res.status(400).json({ error: "Le nom du plat ne peut pas être vide." });
  }

  if (prix !== undefined && (typeof prix !== "number" || prix < 0)) {
    return res.status(400).json({ error: "Le prix du plat doit être un nombre positif." });
  }

  // menu est optionnel ici
  next();
};



//-------Proposition-----

exports.validateProposition = (req, res, next) => {
  const { nom, menuItem, utilisateur } = req.body;

  if (!nom || nom.trim() === "") {
    return res.status(400).json({ error: "Le nom de la proposition est requis." });
  }

  if (!menuItem || menuItem.trim() === "") {
    return res.status(400).json({ error: "L'identifiant du plat (menuItem) est requis." });
  }

  if (!utilisateur || utilisateur.trim() === "") {
    return res.status(400).json({ error: "L'identifiant de l'utilisateur est requis." });
  }

  next();
};


//------Restaurant-------

exports.validateRestaurant = (req, res, next) => {
  const { nom, adresse, ville, note } = req.body;

  if (!nom || nom.trim() === "") {
    return res.status(400).json({ error: "Le nom du restaurant est requis." });
  }

  if (!adresse || adresse.trim() === "") {
    return res.status(400).json({ error: "L'adresse du restaurant est requise." });
  }

  if (!ville || ville.trim() === "") {
    return res.status(400).json({ error: "La ville est requise." });
  }

  if (note !== undefined && (typeof note !== "number" || note < 0 || note > 5)) {
    return res.status(400).json({ error: "La note doit être un nombre entre 0 et 5." });
  }

  next();
};

//---------section--------

exports.validateSection = (req, res, next) => {
  const { nom, menu } = req.body;

  if (!nom || nom.trim() === "") {
    return res.status(400).json({ error: "Le nom de la section est requis." });
  }

  if (!menu || menu.trim() === "") {
    return res.status(400).json({ error: "L'identifiant du menu parent est requis." });
  }

  next();
};


//---------user-----------

exports.validateRegisterClient = (req, res, next) => {
  const { nom, email, mot_passe, type_utilisateur } = req.body;

  if (!nom || nom.trim() === "") {
    return res.status(400).json({ error: "Le nom est requis pour un client." });
  }

  if (!email || !/.+\@.+\..+/.test(email)) {
    return res.status(400).json({ error: "Un email valide est requis." });
  }

  if (!mot_passe || mot_passe.length < 6) {
    return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères." });
  }

  if (type_utilisateur !== "client") {
    return res.status(400).json({ error: "Le type d'utilisateur doit être 'client'." });
  }

  next();
};

exports.validateRegisterRestaurateur = (req, res, next) => {
  const { nom_restaurant, email, mot_passe, type_utilisateur } = req.body;

  if (!nom_restaurant || nom_restaurant.trim() === "") {
    return res.status(400).json({ error: "Le nom du restaurant est requis." });
  }

  if (!email || !/.+\@.+\..+/.test(email)) {
    return res.status(400).json({ error: "Un email valide est requis." });
  }

  if (!mot_passe || mot_passe.length < 6) {
    return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères." });
  }

  if (type_utilisateur !== "restaurateur") {
    return res.status(400).json({ error: "Le type d'utilisateur doit être 'restaurateur'." });
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, mot_de_passe, type_utilisateur } = req.body;

  if (!email || !/.+\@.+\..+/.test(email)) {
    return res.status(400).json({ error: "Un email valide est requis." });
  }

  if (!mot_de_passe || mot_de_passe.length < 6) {
    return res.status(400).json({ error: "Le mot de passe est requis (6 caractères min)." });
  }

  if (!["client", "restaurateur"].includes(type_utilisateur)) {
    return res.status(400).json({ error: "Type utilisateur invalide." });
  }

  next();
};



//----------vote------------

exports.validateVote = (req, res, next) => {
  const { type, auteur, cible, cibleModel } = req.body;

  // Vérifie le type de vote
  if (!type || !["UP", "DOWN"].includes(type)) {
    return res.status(400).json({ error: "Le type de vote doit être 'UP' ou 'DOWN'." });
  }

  // Vérifie la présence de l’auteur
  if (!auteur || auteur.trim() === "") {
    return res.status(400).json({ error: "L'auteur du vote est requis." });
  }

  // Vérifie la cible
  if (!cible || cible.trim() === "") {
    return res.status(400).json({ error: "La cible du vote est requise." });
  }

  // Vérifie le modèle cible
  const allowedModels = ["Menu", "Plat", "Avis"];
  if (!cibleModel || !allowedModels.includes(cibleModel)) {
    return res.status(400).json({ error: `Le modèle cible est invalide. Valeurs autorisées : ${allowedModels.join(", ")}` });
  }

  next();
};

