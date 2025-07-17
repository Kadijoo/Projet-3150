import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import "../styles/MenuRestaurant.css";

const plats = [
  {
    id: 1,
    nom: "Shakshuka",
    image: "/images/Shakshuka.png",
    description: "Plat chaleureux du Moyen Orient...",
    ingredients: ["Huile d'olive", "Oignons", "Poivrons rouges", "Gousses d'ail", "Café"],
  },
  {
    id: 2,
    nom: "Filet mignon",
    image: "/images/Filet mignon.jpg",
    description: "Un filet mignon tendre et juteux...",
    ingredients: ["Filet mignon porc", "Tomates", "Chorizo", "Oignons", "Poivrons verts"],
  },
  {
    id: 3,
    nom: "Sushi",
    image: "/images/Sushi.jpg",
    description: "Assortiment de sushis frais accompagnés de sauce soja.",
    ingredients: ["Riz", "Saumon", "Avocat", "Algue nori", "Sauce soja"],
  },
  {
    id: 4,
    nom: "Tajine",
    image: "/images/Tajine.png",
    description: "Tajine marocain mijoté aux épices douces et légumes.",
    ingredients: ["Poulet", "Olives", "Citron confit", "Carottes", "Épices"],
  },
];

const restaurants = [
  { id: 1, nom: "Restaurant L’amrit", platIds: [1, 2, 3, 4] },
  { id: 2, nom: "Palomar", platIds: [2, 3, 1, 4] },
  { id: 3, nom: "Chez Momo", platIds: [3, 4, 2, 1] },
  { id: 4, nom: "Sakura", platIds: [4, 1, 2, 3] },
];

function MenuRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const resto = restaurants.find((r) => r.id === parseInt(id));

  if (!resto) return <p>Restaurant introuvable.</p>;

  const platsAssocies = plats.filter((p) => resto.platIds.includes(p.id));

  const redirectToAvis = (platId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login", { state: { from: `/avis/${platId}` } });
    } else {
      navigate(`/avis/${platId}`);
    }
  };

  return (
    <div className="page-container">
      <SearchBar searchTerm="" setSearchTerm={() => {}} />
      <main className="main-content">
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          Plats proposés par <strong>{resto.nom}</strong>
        </h2>

        <div className="plat-grid">
          {platsAssocies.map((plat) => (
            <div className="plat-card" key={plat.id}>
              <img src={plat.image} alt={plat.nom} className="plat-image" />
              <h4>{plat.nom}</h4>
              <p className="plat-description">
                <strong>Description :</strong> {plat.description}
              </p>
              <p><strong>Ingrédients :</strong></p>
              <ul className="plat-ingredients">
                {plat.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
              <button className="button-avis" onClick={() => redirectToAvis(plat.id)}>
                Donner mon avis
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MenuRestaurant;
