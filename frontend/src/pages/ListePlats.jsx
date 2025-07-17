// src/pages/ListePlats.jsx
import React, { useEffect, useState } from "react";

function ListePlats() {
  const [plats, setPlats] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("plats")) || [];
    setPlats(data);
  }, []);

  return (
    <div>
      <h2>Mes Plats</h2>
      {plats.map((plat) => (
        <div key={plat.id} className="plat-card">
          <img src={plat.image} alt={plat.nom} className="plat-image" />
          <h4>{plat.nom}</h4>
          <p><strong>Description:</strong> {plat.description}</p>
          <ul>
            {plat.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ListePlats;
