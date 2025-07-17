// src/pages/AfficherPlats.jsx
import React, { useEffect, useState } from "react";

function AfficherPlats() {
  const [plats, setPlats] = useState([]);

  useEffect(() => {
    const donneesMenus = JSON.parse(localStorage.getItem("menus")) || [];
    // Extraire tous les plats de tous les menus dans un seul tableau
    const tousPlats = donneesMenus.flatMap((menu) =>
      menu.plats.map((p) => ({ ...p, menuId: menu.id }))
    );
    setPlats(tousPlats);
  }, []);

  const supprimerPlat = (id) => {
    const donneesMenus = JSON.parse(localStorage.getItem("menus")) || [];
    const menusModifies = donneesMenus.map((menu) => ({
      ...menu,
      plats: menu.plats.filter((p) => p.id !== id),
    }));
    localStorage.setItem("menus", JSON.stringify(menusModifies));
    const platsRestants = plats.filter((p) => p.id !== id);
    setPlats(platsRestants);
  };

  return (
    <div className="page-container">
      <h2>Mes plats</h2>
      {plats.length === 0 ? (
        <p>Aucun plat créé.</p>
      ) : (
        plats.map((plat) => (
          <div key={plat.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "15px" }}>
            <h4>{plat.nom}</h4>
            <p>{plat.description}</p>
            <ul>
              {plat.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
            {plat.publie ? <span style={{ color: "green" }}>Publié</span> : <span>Non publié</span>}
            <div>
              <button onClick={() => supprimerPlat(plat.id)}>🗑️ Supprimer</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AfficherPlats;
