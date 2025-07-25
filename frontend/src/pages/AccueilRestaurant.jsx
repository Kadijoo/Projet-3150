// AccueilRestaurant.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AccueilRestaurant.css";

function AccueilRestaurant() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOuvert, setMenuOuvert] = useState(false);

  const notifications = [];

  const suggestions = [
    {
      nom: "Chez Habib",
      specialite: "Orientale",
      image: "/images/chezhabib.jpg",
    },
    {
      nom: "Tajine Express",
      specialite: "Marocaine",
      image: "/images/tajineexpress.jpg",
    },
    {
      nom: "Le Palais Indien",
      specialite: "Indienne",
      image: "/images/palaisindien.jpg",
    },
    {
      nom: "Sakura Japonais",
      specialite: "Japonaise",
      image: "/images/sakura.jpg",
    },
  ];

  const resultatsFiltres = suggestions.filter(
    (r) =>
      r.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.specialite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      
      
      <main className="main-content">
        <h2>Bienvenue Restaurateur</h2>

        <section className="actions-restaurateur">
          <h3>🛠️ Actions du restaurateur</h3>
          <div className="action-buttons">
            <div className="dropdown" tabIndex={0}>
              <button className="dropdown-toggle">🍽️ Créer plat/menu ▾</button>
              <div className="dropdown-menu">
                <button onClick={() => navigate("/creer-plat-menu?type=plat")}>
                  Créer un plat
                </button>
                <button onClick={() => navigate("/creer-plat-menu?type=menu")}>
                  Créer un menu
                </button>
              </div>
            </div>

            <div className="dropdown" tabIndex={0}>
              <button className="dropdown-toggle">👁️ Voir plat/menu ▾</button>
              <div className="dropdown-menu">
                <button onClick={() => navigate("/voir-plat-menu?type=plat")}>Voir les plats</button>
                <button onClick={() => navigate("/voir-plat-menu?type=menu")}>Voir les menus</button>
              </div>
            </div>
          </div>
        </section>

        <section className="suggestions">
          <h3>🍽️ Restaurants similaires</h3>
          <div className="suggestion-grid">
            {resultatsFiltres.map((r, i) => (
              <div key={i} className="suggestion-card">
                <img src={r.image} alt={r.nom} className="suggestion-image" />
                <div className="suggestion-info">
                  <h4>{r.nom}</h4>
                  <p>{r.specialite}</p>
                </div>
                <button
                  className="opinion-button"
                  onClick={() =>
                    navigate(`/avis-restaurant/${encodeURIComponent(r.nom)}`)
                  }
                >
                  Donner un avis
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      
    </div>
  );
}

export default AccueilRestaurant;
