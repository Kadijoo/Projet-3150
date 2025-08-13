import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Plats = () => {
  const [plats, setPlats] = useState([]);
  const [restaurants, setRestaurants] = useState([]); // FIX: ajout pour avoir la liste restos
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Récupérer la liste d'IDs exclus (depuis state OU query)
  const excludedIds = useMemo(() => {
    const fromState = location.state?.exclude || [];
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get("exclude")
      ? params.get("exclude").split(",").filter(Boolean)
      : [];
    return Array.from(new Set([...(fromState || []), ...(fromQuery || [])]));
  }, [location.state, location.search]);

  // FIX: index ownerId -> nom_restaurant
  const restoNameByOwner = useMemo(() => {
    const map = new Map();
    for (const r of restaurants) {
      const ownerId = r?.proprietaire?._id || r?.proprietaire || r?.owner;
      const rName = r?.nom_restaurant || r?.nom;
      if (ownerId && rName) map.set(String(ownerId), rName);
    }
    return map;
  }, [restaurants]);

  useEffect(() => {
    const fetchAllPlats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/plats");
        const data = Array.isArray(res.data) ? res.data : [];
        const excluded = new Set(excludedIds);
        const filtered = data.filter((p) => !excluded.has(p._id));
        setPlats(filtered);
      } catch (err) {
        console.error("Erreur chargement plats :", err);
      }
    };

    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/restaurants");
        setRestaurants(res.data || []);
      } catch (err) {
        console.error("Erreur chargement restaurants :", err);
      }
    };

    fetchAllPlats();
    fetchRestaurants();
    setLoading(false);
  }, [excludedIds]);

  const donnerAvis = (platId) => {
    navigate(`/avis/plat/${platId}`);
  };

  const renderIngredients = (ings = []) => {
    if (!Array.isArray(ings) || ings.length === 0) return <em>Aucun ingrédient</em>;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {ings.map((ing) => {
          const catNom = ing?.categorie?.nom || "—";
          return (
            <span
              key={ing._id || `${ing.nom}-${catNom}`}
              style={{
                border: "1px solid #ddd",
                borderRadius: "20px",
                padding: "6px 10px",
                fontSize: "12px",
                background: "#f9f9f9",
              }}
            >
              {ing.nom} — {catNom}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "left", color: "green", marginBottom: "20px" }}>
        Ces plats attendent vos avis 
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Chargement…</p>
      ) : plats.length === 0 ? (
        <p style={{ textAlign: "center" }}>Aucun plat supplémentaire disponible.</p>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {plats.map((plat) => (
            <div
              key={plat._id}
              style={{
                width: "320px",
                border: "1px solid #ccc",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                overflow: "hidden",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* En-tête : nom du restaurant */}
              <div
                style={{
                  background: "#e8f5e9",
                  padding: "10px 15px",
                  fontWeight: "bold",
                  color: "#2e7d32",
                }}
              >
                {(() => {
                  const direct = plat?.auteur?.nom_restaurant || plat?.auteur?.nom;
                  if (direct) return direct;
                  const auteurId = plat?.auteur?._id || plat?.auteur;
                  const viaIndex = auteurId ? restoNameByOwner.get(String(auteurId)) : null;
                  return viaIndex || "Nom du restaurant";
                })()}
              </div>

              {/* Image du plat */}
              {plat?.image ? (
                <img
                  src={`http://localhost:5000${plat.image}`}
                  alt={plat.nom}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
              ) : null}

              {/* Contenu */}
              <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3 style={{ margin: 0 }}>{plat.nom}</h3>
                  <span style={{ fontWeight: "bold", color: "#333" }}>
                    {typeof plat.prix === "number" ? `${plat.prix.toFixed(2)} $` : "--"}
                  </span>
                </div>
                <p style={{ margin: 0, color: "#555" }}>{plat.description || "—"}</p>
                {plat?.categorie?.nom && (
                  <p style={{ margin: 0, color: "#666" }}>
                    <strong>Catégorie du plat :</strong> {plat.categorie.nom}
                  </p>
                )}
                <div>
                  <p style={{ margin: "6px 0 8px 0" }}><strong>Ingrédients</strong></p>
                  {renderIngredients(plat.ingredients)}
                </div>
                <button
                  onClick={() => donnerAvis(plat._id)}
                  style={{
                    marginTop: "12px",
                    backgroundColor: "green",
                    color: "#fff",
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    alignSelf: "flex-end",
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
  );
};

export default Plats;
