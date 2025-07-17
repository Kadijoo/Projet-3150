import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { filtrerParTerme } from "../utils/filtrage";

const restaurants = [
  {
    id: 1,
    nom: "Restaurant L’amrit",
    image: "./images/amrit.jpg",
    adresse: "922 Mont-Royal Ave E, Montreal, Quebec H2J 1X1, Canada",
    description: "Cuisine riche et parfumée, mêlant recettes traditionnelles et modernes.",
  },
  {
    id: 2,
    nom: "Restaurant Palomar",
    image: "./images/palomar.jpg",
    adresse: "406 Rue Saint-Jacques, Montréal, QC H2Y 1S1, Canada",
    description: "Cuisine méditerranéenne raffinée, saveurs du Moyen-Orient et d’Israël.",
  },
  {
    id: 3,
    nom: "Chez Momo",
    image: "./images/chezmomo.jpg",
    adresse: "5201 Saint-Laurent Blvd, Montreal, QC H2T 1S4, Canada",
    description: "Spécialités marocaines servies dans un cadre chaleureux et coloré.",
  },
  {
    id: 4,
    nom: "Sakura Japonais",
    image: "./images/sakura.jpg",
    adresse: "201 Rue Milton, Montréal, QC H2X 1V5, Canada",
    description: "Cuisine japonaise moderne avec sushis, ramen et grillades authentiques.",
  },
];

function Restaurants() {
  const navigate = useNavigate();
  const { searchTerm } = useOutletContext();
  const filteredRestaurants = filtrerParTerme(restaurants, searchTerm, ["nom", "description", "adresse"]);

  return (
    <div className="page-container">
      <main className="main-content">
        <h2 style={{ color: "green", marginBottom: "30px" }}>
          Explorez nos restaurants partenaires
        </h2>
        <div className="restaurant-list" style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          {filteredRestaurants.map((r) => (
            <div key={r.id} style={{ border: "1px solid #ddd", borderRadius: "10px", width: "300px", overflow: "hidden", backgroundColor: "#f9f9f9" }}>
              <img src={r.image} alt={r.nom} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              <div style={{ padding: "15px" }}>
                <h3>{r.nom} <span style={{ color: "green", float: "right" }}>ouvert</span></h3>
                <p style={{ color: "red", margin: "5px 0" }}>📍 {r.adresse}</p>
                <p>{r.description}</p>
                <button
                  style={{
                    marginTop: "15px",
                    backgroundColor: "green",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/menu-restaurant/${r.id}`)}
                >
                  Consulter Menu
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Restaurants;
