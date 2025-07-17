import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreerPlat() {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ nom: "" }]);
  const navigate = useNavigate();

  const handleChangeIngredient = (index, value) => {
    const nouveaux = [...ingredients];
    nouveaux[index].nom = value;
    setIngredients(nouveaux);
  };

  const ajouterIngredient = () => {
    setIngredients([...ingredients, { nom: "" }]);
  };

  const supprimerIngredient = (index) => {
    const nouveaux = [...ingredients];
    nouveaux.splice(index, 1);
    setIngredients(nouveaux);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nouveauPlat = {
      id: Date.now(),
      nom,
      description,
      ingredients: ingredients.map((i) => i.nom).filter((i) => i.trim() !== ""),
    };

    const anciens = JSON.parse(localStorage.getItem("plats")) || [];
    localStorage.setItem("plats", JSON.stringify([...anciens, nouveauPlat]));

    alert("✅ Plat enregistré !");
    navigate("/afficher-plats");
  };

  const supprimerTout = () => {
    if (window.confirm("❌ Supprimer ce plat en cours de création ?")) {
      setNom("");
      setDescription("");
      setIngredients([{ nom: "" }]);
    }
  };

  return (
    <div className="page-container">
      <h2>Créer un nouveau plat</h2>
      <form onSubmit={handleSubmit}>
        <label>Nom du plat :</label>
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <label>Description :</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />

        <label>Ingrédients :</label>
        {ingredients.map((ingredient, index) => (
          <div key={index} style={{ display: "flex", marginBottom: "8px" }}>
            <input
              type="text"
              value={ingredient.nom}
              onChange={(e) => handleChangeIngredient(index, e.target.value)}
              placeholder={`Ingrédient ${index + 1}`}
              required
            />
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => supprimerIngredient(index)}
                style={{ marginLeft: "8px" }}
              >
                ❌
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={ajouterIngredient}>
          ➕ Ajouter un ingrédient
        </button>

        <div style={{ marginTop: "20px" }}>
          <button type="submit" style={{ marginRight: "10px" }}>
            ✅ Enregistrer le plat
          </button>
          <button type="button" onClick={supprimerTout}>
            🗑️ Supprimer ce plat
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreerPlat;
