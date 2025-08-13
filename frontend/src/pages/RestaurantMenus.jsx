import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function RestaurantMenus() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeType, setActiveType] = useState(null);

  // owner(User) -> restaurantId
  const ownerToRestaurantId = useMemo(() => {
    const map = new Map();
    for (const r of restaurants) {
      const owner = r?.proprietaire?._id || r?.proprietaire;
      if (owner && r?._id) map.set(String(owner), String(r._id));
    }
    return map;
  }, [restaurants]);

  // Filtrer menus du restaurant courant (en gérant les 2 cas: restaurantId ou ownerId)
  const menusDuRestaurant = useMemo(() => {
    return menus.filter((m) => {
      const r = m.restaurant;
      const val = typeof r === "object" && r !== null ? (r._id || r.proprietaire) : r;
      const asString = String(val || "");
      if (asString === String(restaurantId)) return true; // cas où m.restaurant === restaurantId
      // cas où m.restaurant === ownerId
      const viaOwner = ownerToRestaurantId.get(asString);
      return viaOwner && String(viaOwner) === String(restaurantId);
    });
  }, [menus, ownerToRestaurantId, restaurantId]);

  // Types présents
  const typesDisponibles = useMemo(() => {
    const set = new Set(menusDuRestaurant.map(m => m.type).filter(Boolean));
    return Array.from(set);
  }, [menusDuRestaurant]);

  // Menus du type actif
  const menusFiltres = useMemo(() => {
    return activeType ? menusDuRestaurant.filter(m => m.type === activeType) : menusDuRestaurant;
  }, [menusDuRestaurant, activeType]);

  useEffect(() => {
    const run = async () => {
      try {
        const [menusRes, restosRes] = await Promise.all([
          axios.get("http://localhost:5000/api/menus/with-plats"),
          axios.get("http://localhost:5000/api/restaurants"),
        ]);
        setMenus(Array.isArray(menusRes.data) ? menusRes.data : []);
        setRestaurants(Array.isArray(restosRes.data) ? restosRes.data : []);
      } catch (err) {
        console.error("Erreur chargement menus/restaurants:", err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  useEffect(() => {
    if (!activeType && typesDisponibles.length > 0) {
      setActiveType(typesDisponibles[0]);
    }
  }, [typesDisponibles, activeType]);

  const donnerAvisMenu = (menu) => {
  navigate(`/avis/menu/${menu._id}`, { state: { menu } });
};

  const renderIngredients = (ings = []) => {
    if (!Array.isArray(ings) || ings.length === 0) return <em>Aucun ingrédient</em>;
    const grouped = ings.reduce((acc, ing) => {
      const cat = ing?.categorie?.nom || "Autres";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(ing.nom);
      return acc;
    }, {});
    return (
      <div style={{ marginTop: 6 }}>
        {Object.entries(grouped).map(([cat, noms]) => (
          <div key={cat} style={{ marginTop: 6 }}>
            <p style={{ margin: "0 0 4px 0" }}><strong>Catégorie :</strong> {cat}</p>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {noms.map((n, i) => <li key={`${cat}-${i}`}>{n}</li>)}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <p style={{ textAlign: "center" }}>Chargement…</p>;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      {/* Header + retour */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "gray", color: "#fff", padding: "8px 16px", border: "none", borderRadius: 6, fontWeight: "bold", cursor: "pointer" }}
        >
          ← Retour
        </button>
        <h2 style={{ margin: 0, color: "green" }}>Menus du restaurant</h2>
        <div />
      </div>

      {/* Onglets Type */}
      {typesDisponibles.length > 0 ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {typesDisponibles.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              style={{
                border: "1px solid #2e7d32",
                background: activeType === t ? "#2e7d32" : "#fff",
                color: activeType === t ? "#fff" : "#2e7d32",
                padding: "8px 14px",
                borderRadius: 24,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => setActiveType(null)}
            style={{
              border: "1px solid #aaa",
              background: activeType === null ? "#aaa" : "#fff",
              color: activeType === null ? "#fff" : "#333",
              padding: "8px 14px",
              borderRadius: 24,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Tous les types
          </button>
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>Aucun menu pour ce restaurant.</p>
      )}

      {/* Liste des menus du type sélectionné */}
      {menusFiltres.length === 0 ? (
        <p style={{ textAlign: "center" }}>Aucun menu pour ce type.</p>
      ) : (
        menusFiltres.map((menu) => (
          <div key={menu._id} style={{ marginBottom: 28 }}>
            {/* En-tête menu */}
            <div
              style={{
                background: "linear-gradient(90deg, #4CAF50, #81C784)",
                borderRadius: 12,
                padding: 20,
                color: "#fff",
                marginBottom: 12,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>{menu.titre}</h3>
              <div style={{ background: "#fff", color: "#333", borderRadius: 8, padding: 12 }}>
                {menu.description && <p style={{ margin: "0 0 6px 0" }}><strong>Description :</strong> {menu.description}</p>}
                <p style={{ margin: "0 0 6px 0" }}><strong>Type :</strong> {menu.type || "—"}</p>
                <p style={{ margin: "0 0 6px 0" }}><strong>Statut :</strong> {menu.statut}</p>
                <p style={{ margin: 0 }}>
                  <strong>Date création :</strong> {menu.date_creation ? new Date(menu.date_creation).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>

            {/* Plats du menu */}
            {Array.isArray(menu.plats) && menu.plats.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {menu.plats.map((plat) => (
                  <div
                    key={plat._id}
                    style={{
                      display: "flex",
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Image */}
                    {plat.image && (
                      <img
                        src={`http://localhost:5000${plat.image}`}
                        alt={plat.nom}
                        style={{ width: 220, height: "auto", objectFit: "cover", flexShrink: 0 }}
                      />
                    )}

                    {/* Détails */}
                    <div style={{ padding: 14, flex: 1 }}>
                      <h4 style={{ margin: "0 0 6px 0", color: "green" }}>{plat.nom}</h4>
                      <p style={{ margin: "0 0 6px 0" }}><strong>Description :</strong> {plat.description || "—"}</p>
                      <p style={{ margin: "0 0 6px 0" }}>
                        <strong>Prix :</strong> {typeof plat.prix === "number" ? `${plat.prix.toFixed(2)} $` : "—"}
                      </p>
                      {plat?.categorie?.nom && (
                        <p style={{ margin: "0 0 6px 0" }}>
                          <strong>Catégorie :</strong> {plat.categorie.nom}
                        </p>
                      )}

                      {/* Ingrédients groupés par catégorie */}
                      <div>
                        <p style={{ margin: "6px 0 6px 0" }}><strong>Ingrédients :</strong></p>
                        {renderIngredients(plat.ingredients)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Aucun plat associé à ce menu.</p>
            )}

            {/* Bouton avis menu */}
            <div style={{ textAlign: "right", marginTop: 12 }}>
              <button
                onClick={() => donnerAvisMenu(menu)}
                style={{
                  backgroundColor: "#2e7d32",
                  color: "#fff",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Donner mon avis sur ce menu
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
