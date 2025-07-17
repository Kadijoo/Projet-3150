// src/pages/AfficherMenus.jsx
import React, { useState, useEffect } from "react";

function AfficherMenus() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const donnees = JSON.parse(localStorage.getItem("menus")) || [];
    setMenus(donnees);
  }, []);

  const supprimerMenu = (id) => {
    const confirm = window.confirm("Supprimer ce menu ?");
    if (!confirm) return;

    const nouveau = menus.filter((m) => m.id !== id);
    setMenus(nouveau);
    localStorage.setItem("menus", JSON.stringify(nouveau));
  };

  return (
    <div className="page-container">
      <h2>Mes menus</h2>
      {menus.length === 0 ? (
        <p>Aucun menu créé.</p>
      ) : (
        menus.map((menu) => (
          <div key={menu.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
            <h3>{menu.nom}</h3>
            {menu.plats.length === 0 ? (
              <p>Aucun plat</p>
            ) : (
              menu.plats.map((plat, i) => (
                <div key={i} style={{ marginLeft: "20px", marginBottom: "10px" }}>
                  <strong>{plat.nom}</strong>
                  <p>{plat.description}</p>
                  <ul>
                    {plat.ingredients.map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                  {plat.publie ? <span style={{ color: "green" }}>Publié</span> : <span>Non publié</span>}
                </div>
              ))
            )}
            <button onClick={() => supprimerMenu(menu.id)}>🗑️ Supprimer menu</button>
          </div>
        ))
      )}
    </div>
  );
}

export default AfficherMenus;
