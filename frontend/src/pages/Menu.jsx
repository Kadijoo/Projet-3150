import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { filtrerParTerme } from "../utils/filtrage";

const plats = [
  {
    id: 1,
    nom: "Shakshuka",
    image: "./images/Shakshuka.png",
    description: "Plat chaleureux du Moyen Orient...",
    ingredients: ["Huile d'olive", "Oignons", "Poivrons rouges", "Gousses d'ail", "Café"],
  },
  {
    id: 2,
    nom: "Filet mignon",
    image: "./images/Filet mignon.jpg",
    description: "Un filet mignon tendre et juteux...",
    ingredients: ["Filet mignon porc", "Tomates", "Chorizo", "Oignons", "Poivrons verts"],
  },
  {
    id: 3,
    nom: "Sushi",
    image: "./images/Sushi.jpg",
    description: "Assortiment de sushis frais accompagnés de sauce soja.",
    ingredients: ["Riz", "Saumon", "Avocat", "Algue nori", "Sauce soja"],
  },
  {
    id: 4,
    nom: "Tajine",
    image: "./images/Tajine.png",
    description: "Tajine marocain mijoté aux épices douces et légumes.",
    ingredients: ["Poulet", "Olives", "Citron confit", "Carottes", "Épices"],
  },
];

function Menu() {
  const navigate = useNavigate();
  const { searchTerm } = useOutletContext();
  const role = localStorage.getItem("role");

  if (role === "restaurateur") {
    return (
      <div className="main-content">
        <h2>Menu du Restaurateur</h2>
        <div style={{ display: "flex", gap: "20px" }}>
          <button onClick={() => navigate("/creer-plat")} style={blueButton}>
            Créer un plat
          </button>
          <button onClick={() => navigate("/creer-menu")} style={blueButton}>
            Créer un menu
          </button>
        </div>
      </div>
    );
  }

  const platsVotes = JSON.parse(localStorage.getItem("platsVotes")) || [];
  const platsNonVotes = plats.filter((p) => !platsVotes.includes(p.id));
  const platsFiltres = filtrerParTerme(platsNonVotes, searchTerm, ["nom", "description", "ingredients"]);

  return (
    <div>
      <div className="main-content">
        <h2>Ces plats attendent votre avis</h2>
        {platsFiltres.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            Aucun plat trouvé avec ce terme.
          </p>
        ) : (
          <div
            className="dish-list"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "30px",
              padding: "0 20px",
            }}
          >
            {platsFiltres.map((plat) => (
              <div
                className="dish-section"
                key={plat.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <img
                  src={plat.image}
                  alt={plat.nom}
                  className="dish-image"
                  style={{ width: "100%", height: "180px", objectFit: "cover" }}
                />
                <div style={{ padding: "15px", flex: "1" }}>
                  <p><strong>Description :</strong> {plat.description}</p>
                  <p><strong>Ingrédients :</strong></p>
                  <ul>
                    {plat.ingredients.map((ing, index) => (
                      <li key={index}>{ing}</li>
                    ))}
                  </ul>
                  <button
                    className="opinion-button"
                    onClick={() => navigate(`/avis/${plat.id}`)}
                    style={{
                      marginTop: "10px",
                      backgroundColor: "#61dafb",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Donner mon avis
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const blueButton = {
  backgroundColor: "#61dafb",
  border: "none",
  padding: "12px 20px",
  fontSize: "16px",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default Menu;
