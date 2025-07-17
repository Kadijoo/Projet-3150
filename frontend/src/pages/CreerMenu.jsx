// src/pages/CreerMenu.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreerMenu() {
  const [nomMenu, setNomMenu] = useState("");
  const [plats, setPlats] = useState([]);
  const navigate = useNavigate();

  const ajouterPlat = () => {
    setPlats([
      ...plats,
      {
        id: Date.now(),
        nom: "",
        description: "",
        ingredients: [""],
        publie: false,
      },
    ]);
  };

  const supprimerPlat = (id) => {
    setPlats(plats.filter((p) => p.id !== id));
  };

  const modifierChampPlat = (id, champ, valeur) => {
    setPlats(
      plats.map((p) =>
        p.id === id ? { ...p, [champ]: valeur } : p
      )
    );
  };

  const modifierIngredient = (platId, index, valeur) => {
    setPlats(
      plats.map((p) =>
        p.id === platId
          ? {
              ...p,
              ingredients: p.ingredients.map((ing, i) =>
                i === index ? valeur : ing
              ),
            }
          : p
      )
    );
  };

  const ajouterIngredient = (platId) => {
    setPlats(
      plats.map((p) =>
        p.id === platId
          ? { ...p, ingredients: [...p.ingredients, ""] }
          : p
      )
    );
  };

  const publierPlat = (id) => {
    setPlats(
      plats.map((p) => (p.id === id ? { ...p, publie: true } : p))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const menu = {
      id: Date.now(),
      nom: nomMenu,
      plats,
    };

    const anciensMenus = JSON.parse(localStorage.getItem("menus")) || [];
    localStorage.setItem("menus", JSON.stringify([...anciensMenus, menu]));

    alert("Menu créé avec succès");
    navigate("/menus-restaurateur");
  };

  return (
    <div className="page-container">
      <h2>Créer un menu</h2>
      <form onSubmit={handleSubmit}>
        <label>Nom du menu :</label>
        <input value={nomMenu} onChange={(e) => setNomMenu(e.target.value)} required />

        <h3>Plats :</h3>
        {plats.map((plat, i) => (
          <div key={plat.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
            <label>Nom du plat :</label>
            <input
              type="text"
              value={plat.nom}
              onChange={(e) => modifierChampPlat(plat.id, "nom", e.target.value)}
              required
            />

            <label>Description :</label>
            <textarea
              value={plat.description}
              onChange={(e) => modifierChampPlat(plat.id, "description", e.target.value)}
              required
            />

            <label>Ingrédients :</label>
            {plat.ingredients.map((ing, idx) => (
              <input
                key={idx}
                type="text"
                value={ing}
                onChange={(e) => modifierIngredient(plat.id, idx, e.target.value)}
                required
              />
            ))}
            <button type="button" onClick={() => ajouterIngredient(plat.id)}>
              ➕ Ajouter ingrédient
            </button>

            <div style={{ marginTop: "10px" }}>
              <button type="button" onClick={() => supprimerPlat(plat.id)}>
                🗑️ Supprimer ce plat
              </button>
              {!plat.publie && (
                <button type="button" onClick={() => publierPlat(plat.id)} style={{ marginLeft: "10px" }}>
                  ✅ Publier
                </button>
              )}
              {plat.publie && <span style={{ marginLeft: "10px", color: "green" }}>Publié</span>}
            </div>
          </div>
        ))}

        <button type="button" onClick={ajouterPlat}>
          ➕ Ajouter un plat
        </button>
        <br />
        <button type="submit">Créer le menu</button>
      </form>
    </div>
  );
}

export default CreerMenu;