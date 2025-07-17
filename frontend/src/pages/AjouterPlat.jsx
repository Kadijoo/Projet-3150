// src/pages/AjouterPlat.jsx
import React, { useState } from "react";

function AjouterPlat() {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState("");

  const handleAjout = () => {
    const nouveauPlat = {
      id: Date.now(),
      nom,
      description,
      image,
      ingredients: ingredients.split(",").map((i) => i.trim()),
    };

    const plats = JSON.parse(localStorage.getItem("plats")) || [];
    plats.push(nouveauPlat);
    localStorage.setItem("plats", JSON.stringify(plats));

    alert("Plat ajouté !");
    setNom("");
    setDescription("");
    setImage("");
    setIngredients("");
  };

  return (
    <div className="form-container">
      <h2>Ajouter un plat</h2>
      <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="text" placeholder="Chemin de l’image" value={image} onChange={(e) => setImage(e.target.value)} />
      <textarea placeholder="Ingrédients séparés par des virgules" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
      <button onClick={handleAjout}>Ajouter</button>
    </div>
  );
}

export default AjouterPlat;
