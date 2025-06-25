import React from "react";
import "./App.css";

function App() {

  const plats = [
    {
      id: 1,
      image: "/Shakshuka.png",
      description: "Plat chaleureux du Moyen Orient, le Shakshuka est composee d'oeufs poches dans une sauce tomate mijotee aux oignons, poivrons et epices. Parfumee et reconfortante, elle se deguste souvent avec du pain frais",
      ingredients: ["Huile d'olive", "Oignons", "Poivrons rouges", "Gousses d'ail", "Cafe"],
    },
    {
    id: 2,
    image: "/Filet mignon.jpg",
    description: "Un filet mignon tendre et juteuse, marine puis grille a la perfection, servi avec une sauce legerement relevee aux inspirations portugaises, souvent accompagnee de pommes de terre et de legumes.",
    ingredients: ["Filet mignon porc", "Tomates", "Chorizo", "Oignons", "Poivrons verts"],
  },
  ];

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">TestMyMenu</div>
        <div className="nav-buttons">
          <button>Accueil</button>
          <button>Menu</button>
          <button>Se connecter</button>
        </div>
      </nav>
      
      <main className="main-content">
        <h2>Ces plats attendent votre avis</h2>
        <div className="dish-list">
        {plats.map((plat) => (
          <div className="dish-section" key={plat.id}>
            <img src={plat.image} alt="Plat" className="dish-image" />

            <div className="dish-info">
              <p><strong>Description :</strong> {plat.description}</p>
              <p><strong>Ingrédients :</strong></p>
              <ul>
                {plat.ingredients.map((ing, index) => (
                  <li key={index}>{ing}</li>
                ))}
              </ul>
              <button className="opinion-button">Donner mon avis sur ce plat</button>
            </div>
          </div>
        ))}
      </div>
      </main>
    </div>
  );
}

export default App;

