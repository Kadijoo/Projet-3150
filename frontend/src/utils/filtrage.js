// utils/filtrage.js

/**
 * Filtre une liste d’objets selon un terme de recherche et une liste de champs.
 * 
 * @param {Array<Object>} donnees - Les données à filtrer
 * @param {string} searchTerm - Le terme de recherche
 * @param {string[]} champs - Les champs à inspecter dans chaque objet
 * @returns {Array<Object>} Les objets filtrés
 */
export function filtrerParTerme(donnees, searchTerm, champs) {
  const terme = searchTerm.toLowerCase();

  return donnees.filter((item) =>
    champs.some((champ) => {
      const valeur = item[champ];

      if (!valeur) return false;

      // Si c’est un tableau (ex: ingrédients), on le joint
      if (Array.isArray(valeur)) {
        return valeur.join(" ").toLowerCase().includes(terme);
      }

      // Sinon, on traite comme une chaîne
      return valeur.toLowerCase().includes(terme);
    })
  );
}
