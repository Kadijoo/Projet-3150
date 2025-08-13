import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AccueilRestaurant.css";

function AccueilRestaurant() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [plats, setPlats] = useState([]);
  const [restaurants, setRestaurants] = useState([]); // <- pour afficher le nom du resto
  const [loading, setLoading] = useState(true);

  // Utilisateur connecté (restaurateur)
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);
  const currentUserId = user?.id || user?._id || null;

  // Map: ownerId -> nom_restaurant (même logique que AccueilClient/Plats)
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
    const fetchAll = async () => {
      try {
        // Plats
        const resPlats = await fetch("http://localhost:5000/api/plats");
        const dataPlats = await resPlats.json();

        // Exclure mes propres plats
        const list = Array.isArray(dataPlats) ? dataPlats : [];
        const others = currentUserId
          ? list.filter(
              (p) => String(p?.auteur?._id || p?.auteur || "") !== String(currentUserId)
            )
          : list;
        setPlats(others);

        // Restaurants (pour header au-dessus des plats)
        const resRestos = await fetch("http://localhost:5000/api/restaurants");
        const dataRestos = await resRestos.json();
        setRestaurants(Array.isArray(dataRestos) ? dataRestos : []);
      } catch (err) {
        console.error("Erreur chargement accueil restaurateur:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [currentUserId]);

  // Recherche (nom + description)
  const platsFiltres = plats.filter((p) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      p?.nom?.toLowerCase().includes(q) ||
      p?.description?.toLowerCase().includes(q)
    );
  });

  // Limiter à 4 plats
  const platsAffiches = platsFiltres.slice(0, 4);

  // "Parcourir plus" : exclure ceux de l'accueil
  const decouvrirPlusPlats = () => {
    const excludeIds = platsAffiches.map((p) => p._id);
    navigate(`/plats-autres?exclude=${excludeIds.join(",")}`, { state: { exclude: excludeIds } });
  };

  // Helpers UI (repris de tes pages)
  const RestoHeaderForPlat = (plat) => {
    const direct = plat?.auteur?.nom_restaurant || plat?.auteur?.nom;
    if (direct) return direct;
    const auteurId = plat?.auteur?._id || plat?.auteur;
    const viaIndex = auteurId ? restoNameByOwner.get(String(auteurId)) : null;
    return viaIndex || "Nom du restaurant";
  };

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

  // Styles
  const styles = {
    card: {
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      border: "1px solid #eef2f0",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    btnPrimary: {
      padding: "10px 14px",
      borderRadius: 10,
      border: "none",
      background: "#2e7d32",
      color: "#fff",
      cursor: "pointer",
      width: "100%",
      fontWeight: 600,
    },
  };

  const gridStyle =
    platsAffiches.length === 1
      ? {
          display: "grid",
          gridTemplateColumns: "minmax(300px, 560px)",
          justifyContent: "center",
          gap: 20,
        }
      : {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        };

  return (
    <div className="page-container">
      <main className="main-content">
        {/* Actions */}
        <section className="actions-restaurateur">
          <div className="action-buttons">
            <button onClick={() => navigate("/creer-restaurant")}>Créer mon restaurant</button>
            <button onClick={() => navigate("/creer-plat-menu?type=plat")}>Créer un plat</button>
            <button onClick={() => navigate("/creer-menu")}>Créer un menu</button>
            <button onClick={() => navigate("/liste-plats")}>Voir les plats</button>
            <button onClick={() => navigate("/liste-menus")}>Voir les menus</button>
            <button onClick={() => navigate("/mes-avis")}>Voir les avis reçus</button>
          </div>
        </section>

        {/* Recherche */}
        <section className="search-section" style={{ margin: "20px 0" }}>
          <input
            type="text"
            placeholder="Rechercher un plat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: 10,
              width: "100%",
              borderRadius: 8,
              marginBottom: 16,
              border: "1px solid #c8e6c9",
              outline: "none",
            }}
          />
        </section>

        {/* Liste des plats (autres restaurateurs) */}
        <section>
          {loading ? (
            <p>Chargement...</p>
          ) : platsAffiches.length > 0 ? (
            <div style={gridStyle}>
              {platsAffiches.map((plat) => (
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
                    {RestoHeaderForPlat(plat)}
                  </div>

                  {/* Image */}
                  {plat?.image && (
                    <div style={{ position: "relative", height: 170 }}>
                      <img
                        src={
                          String(plat.image).startsWith("http")
                            ? plat.image
                            : `http://localhost:5000${plat.image}`
                        }
                        alt={plat?.nom || "Plat"}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}

                  {/* Contenu */}
                  <div style={{ padding: 14, display: "grid", gap: 8 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 8,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 18,
                          fontWeight: 800,
                          lineHeight: 1.2,
                          color: "#1b5e20",
                        }}
                      >
                        {plat?.nom || "Plat"}
                      </h3>
                      <div style={{ fontWeight: 700 }}>
                        {typeof plat?.prix === "number" ? `${plat.prix.toFixed(2)} $` : "—"}
                      </div>
                    </div>

                    {plat?.description && (
                      <div
                        style={{
                          fontSize: 14,
                          opacity: 0.9,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {plat.description}
                      </div>
                    )}

                    {/* Catégorie du plat */}
                    {plat?.categorie?.nom && (
                      <p style={{ margin: 0, color: "#666" }}>
                        <strong>Catégorie du plat :</strong> {plat.categorie.nom}
                      </p>
                    )}

                    {/* Ingrédients (chips) */}
                    <div>
                      <p style={{ margin: "6px 0 8px 0" }}>
                        <strong>Ingrédients</strong>
                      </p>
                      {renderIngredients(plat.ingredients)}
                    </div>

                    {/* Bouton avis */}
                    <div style={{ marginTop: 4 }}>
                      <button
                        onClick={() => navigate(`/avis/plat/${plat._id}`)}
                        style={styles.btnPrimary}
                        className=""
                      >
                        Donner mon avis
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Aucun plat trouvé.</p>
          )}

          {/* Bouton parcourir plus (affiché s'il y a plus que 4 plats) */}
          {platsFiltres.length > platsAffiches.length && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button
                onClick={decouvrirPlusPlats}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Parcourir plus
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AccueilRestaurant;
