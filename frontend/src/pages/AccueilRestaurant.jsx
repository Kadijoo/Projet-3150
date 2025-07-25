// AccueilRestaurant.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AccueilRestaurant.css";

function AccueilRestaurant() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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

        <section className="notifications">
          <h3>🔔 Notifications</h3>
          <ul>
            {notifications.length > 0 ? (
              notifications.map((msg, i) => <li key={i}>{msg}</li>)
            ) : (
              <li>Aucune notification pour l'instant.</li>
            )}
          </ul>
        </section>

        <section className="actions-restaurateur">
          <h3>🛠️ Actions du restaurateur</h3>
          <div className="action-buttons">
            <button onClick={() => navigate("/creer-plat")}>Créer un plat</button>
            <button onClick={() => navigate("/creer-menu")}>Créer un menu</button>
            <button onClick={() => navigate("/afficher-plats")}>Afficher les plats</button>
            <button onClick={() => navigate("/afficher-menus")}>📋 Afficher mes menus</button>
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
