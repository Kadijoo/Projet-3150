// PlatsAutres.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PlatsAutres() {
  const [plats, setPlats] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // User connecté
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);
  const currentUserId = user?.id || user?._id || null;

  // IDs à exclure (depuis AccueilRestaurant -> state + query ?exclude=)
  const excludedIds = useMemo(() => {
    const fromState = location.state?.exclude || [];
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get("exclude")
      ? params.get("exclude").split(",").filter(Boolean)
      : [];
    return Array.from(new Set([...(fromState || []), ...(fromQuery || [])]));
  }, [location.state, location.search]);

  // index ownerId -> nom_restaurant
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
    (async () => {
      try {
        setLoading(true);
        const [resPlats, resRestos] = await Promise.all([
          fetch("http://localhost:5000/api/plats"),
          fetch("http://localhost:5000/api/restaurants"),
        ]);
        const dataPlats = (await resPlats.json()) || [];
        const dataRestos = (await resRestos.json()) || [];

        const excluded = new Set(excludedIds);
        const filtered = (Array.isArray(dataPlats) ? dataPlats : []).filter((p) => {
          const auteurId = String(p?.auteur?._id || p?.auteur || "");
          const isMine = currentUserId && auteurId === String(currentUserId);
          const isExcluded = excluded.has(p?._id);
          return !isMine && !isExcluded;
        });

        setPlats(filtered);
        setRestaurants(Array.isArray(dataRestos) ? dataRestos : []);
      } catch (e) {
        console.error("Erreur chargement PlatsAutres:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [excludedIds, currentUserId]);

  const donnerAvis = (platId) => navigate(`/avis/plat/${platId}`);

  const renderIngredients = (ings = []) => {
    if (!Array.isArray(ings) || ings.length === 0) return <em>Aucun ingrédient</em>;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {ings.map((ing) => {
          const catNom = ing?.categorie?.nom || "—";
          return (
            <span
              key={ing._id || `${ing.nom}-${catNom}`}
              style={{
                border: "1px solid #ddd",
                borderRadius: 20,
                padding: "6px 10px",
                fontSize: 12,
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

  const styles = {
    card: {
      width: 320,
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #eef2f0",
      boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    btnPrimary: {
      marginTop: 12,
      backgroundColor: "#2e7d32",
      color: "#fff",
      padding: "10px 15px",
      border: "none",
      borderRadius: 10,
      cursor: "pointer",
      fontSize: 14,
      alignSelf: "flex-end",
      fontWeight: 600,
    },
  };

  return (
    <div style={{ padding: 30 }}>
      <h2 style={{ color: "green", marginBottom: 20 }}>
        Plats des autres restaurateurs
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Chargement…</p>
      ) : plats.length === 0 ? (
        <p style={{ textAlign: "center" }}>Aucun plat supplémentaire disponible.</p>
      ) : (
        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {plats.map((plat) => (
            <div key={plat._id} style={styles.card}>
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

              {/* Image */}
              {plat?.image && (
                <img
                  src={
                    String(plat.image).startsWith("http")
                      ? plat.image
                      : `http://localhost:5000${plat.image}`
                  }
                  alt={plat?.nom || "Plat"}
                  style={{ width: "100%", height: 200, objectFit: "cover" }}
                />
              )}

              {/* Contenu */}
              <div style={{ padding: 15, display: "grid", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3 style={{ margin: 0 }}>{plat?.nom || "Plat"}</h3>
                  <span style={{ fontWeight: "bold", color: "#333" }}>
                    {typeof plat?.prix === "number" ? `${plat.prix.toFixed(2)} $` : "—"}
                  </span>
                </div>

                <p style={{ margin: 0, color: "#555" }}>{plat?.description || "—"}</p>

                {plat?.categorie?.nom && (
                  <p style={{ margin: 0, color: "#666" }}>
                    <strong>Catégorie du plat :</strong> {plat.categorie.nom}
                  </p>
                )}

                <div>
                  <p style={{ margin: "6px 0 8px 0" }}>
                    <strong>Ingrédients</strong>
                  </p>
                  {renderIngredients(plat.ingredients)}
                </div>

                <button
                  onClick={() => donnerAvis(plat._id)}
                  style={styles.btnPrimary}
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
}
