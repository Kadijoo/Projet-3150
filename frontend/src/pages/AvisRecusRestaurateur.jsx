// src/pages/AvisRecusRestaurateur.jsx
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AvisRecusRestaurateur() {
  const navigate = useNavigate();

  // -- Restaurateur connecté (différents schémas possibles dans localStorage)
  const sessionRaw = localStorage.getItem("user");
const session = sessionRaw ? JSON.parse(sessionRaw) : null;

// many apps save either the server response or just the user object.
// unify it here:
const currentUser =
  (session && (session.utilisateur || session.user || session.account)) || // whole server response
  session ||                                                               // already a user object
  {};

const userId =
  currentUser.id ||
  currentUser._id ||
  currentUser.userId ||
  (currentUser.user && (currentUser.user.id || currentUser.user._id)) ||
  null;

  // UI
  const [tab, setTab] = useState("menus"); // "menus" | "plats"
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // pour menus: type ; pour plats: catégorie
  const [loading, setLoading] = useState(true);

  // Données
  const [avis, setAvis] = useState([]);
  const [menus, setMenus] = useState([]);
  const [plats, setPlats] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  // Fetch
  useEffect(() => {
    const run = async () => {
      try {
        const [avisRes, menusRes, platsRes, restosRes] = await Promise.all([
          axios.get("http://localhost:5000/api/avis"),
          axios.get("http://localhost:5000/api/menus/with-plats"),
          axios.get("http://localhost:5000/api/plats"),
          axios.get("http://localhost:5000/api/restaurants"),
        ]);
        setAvis(Array.isArray(avisRes.data) ? avisRes.data : []);
        setMenus(Array.isArray(menusRes.data) ? menusRes.data : []);
        setPlats(Array.isArray(platsRes.data) ? platsRes.data : []);
        setRestaurants(Array.isArray(restosRes.data) ? restosRes.data : []);
      } catch (err) {
        console.error("Erreur chargement données avis:", err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // IDs des restaurants appartenant au restaurateur (si menu.restaurant est un Restaurant)
  const myRestaurantIds = useMemo(() => {
    if (!userId) return new Set();
    const ids = restaurants
      .filter((r) => String(r?.proprietaire?._id || r?.proprietaire) === String(userId))
      .map((r) => String(r._id));
    return new Set(ids);
  }, [restaurants, userId]);

  // Menus du restaurateur (robuste)
  const menusDuRestaurateur = useMemo(() => {
    if (!userId) return [];
    const mine = menus.filter((m) => {
      const r = m.restaurant;
      const rId = typeof r === "object" && r ? (r._id || r.proprietaire) : r;

      const isByUser = String(rId || "") === String(userId); // menu.restaurant = User
      const isByMyRestaurant = myRestaurantIds.has(String(rId || "")); // menu.restaurant = Restaurant
      const hasMyPlat =
        Array.isArray(m.plats) &&
        m.plats.some((p) => {
          const a = p?.auteur;
          const aId = typeof a === "object" && a ? a._id : a;
          return String(aId || "") === String(userId);
        });

      return isByUser || isByMyRestaurant || hasMyPlat;
    });

    // filet de sécurité : si rien ne matche, on montre tout (pour debug)
    return mine.length ? mine : menus;
  }, [menus, userId, myRestaurantIds]);

  // Plats du restaurateur
  const platsDuRestaurateur = useMemo(() => {
    if (!userId) return [];
    const mine = plats.filter((p) => {
      const a = p.auteur;
      const ref = typeof a === "object" && a ? a._id : a;
      return String(ref || "") === String(userId);
    });
    return mine.length ? mine : plats;
  }, [plats, userId]);

  // Index par id
  const menuById = useMemo(() => {
    const map = new Map();
    for (const m of menusDuRestaurateur) map.set(String(m._id), m);
    return map;
  }, [menusDuRestaurateur]);

  const platById = useMemo(() => {
    const map = new Map();
    for (const p of platsDuRestaurateur) map.set(String(p._id), p);
    return map;
  }, [platsDuRestaurateur]);

  // Avis ciblant MES menus/plats uniquement
  const avisMenus = useMemo(
    () =>
      avis
        .filter((a) => a?.cibleModel === "Menu" && menuById.has(String(a.cible)))
        .map((a) => ({ ...a, cibleDoc: menuById.get(String(a.cible)) })),
    [avis, menuById]
  );

  const avisPlats = useMemo(
    () =>
      avis
        .filter((a) => a?.cibleModel === "Plat" && platById.has(String(a.cible)))
        .map((a) => ({ ...a, cibleDoc: platById.get(String(a.cible)) })),
    [avis, platById]
  );

  // Recherche / filtre
  const q = search.trim().toLowerCase();

  const menusGroupes = useMemo(() => {
    // group by menuId
    const grouped = new Map();
    for (const a of avisMenus) {
      const id = String(a.cible);
      if (!grouped.has(id)) grouped.set(id, []);
      grouped.get(id).push(a);
    }

    const rows = Array.from(grouped.entries()).map(([id, arr]) => {
      const menu = menuById.get(id);
      let match = true;

      if (typeFilter !== "all" && menu?.type !== typeFilter) match = false;

      if (q) {
        const fields = [
          menu?.titre,
          menu?.description,
          menu?.type,
          ...arr.map((x) => x?.contenu || ""),
          ...arr.map((x) => String(x?.note ?? "")),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!fields.includes(q)) match = false;
      }

      return {
        menu,
        avis: arr.sort((a, b) => new Date(b.date_avis || 0) - new Date(a.date_avis || 0)),
        match,
      };
    });

    return rows.filter((r) => r.match);
  }, [avisMenus, menuById, typeFilter, q]);

  const platsGroupes = useMemo(() => {
    const grouped = new Map();
    for (const a of avisPlats) {
      const id = String(a.cible);
      if (!grouped.has(id)) grouped.set(id, []);
      grouped.get(id).push(a);
    }

    const rows = Array.from(grouped.entries()).map(([id, arr]) => {
      const plat = platById.get(id);
      let match = true;

      if (typeFilter !== "all") {
        const cat = plat?.categorie?.nom || "";
        if (cat.toLowerCase() !== typeFilter.toLowerCase()) match = false;
      }

      if (q) {
        const ingredientsText = Array.isArray(plat?.ingredients)
          ? plat.ingredients.map((i) => `${i?.nom || ""} ${i?.categorie?.nom || ""}`).join(" ")
          : "";
        const fields = [
          plat?.nom,
          plat?.description,
          String(plat?.prix ?? ""),
          plat?.categorie?.nom,
          ingredientsText,
          ...arr.map((x) => x?.contenu || ""),
          ...arr.map((x) => String(x?.note ?? "")),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!fields.includes(q)) match = false;
      }

      return {
        plat,
        avis: arr.sort((a, b) => new Date(b.date_avis || 0) - new Date(a.date_avis || 0)),
        match,
      };
    });

    return rows.filter((r) => r.match);
  }, [avisPlats, platById, typeFilter, q]);

  // Filtres disponibles
  const menuTypes = useMemo(
    () => ["all", ...new Set(menusDuRestaurateur.map((m) => m.type).filter(Boolean))],
    [menusDuRestaurateur]
  );
  const platCats = useMemo(
    () => ["all", ...new Set(platsDuRestaurateur.map((p) => p?.categorie?.nom).filter(Boolean))],
    [platsDuRestaurateur]
  );

  // Actions
  const publishMenu = async (menuId) => {
    try {
      await axios.put(`http://localhost:5000/api/menus/${menuId}`, {
        statut: "actif",
        disponible: true,
      });
      setMenus((prev) =>
        prev.map((m) => (m._id === menuId ? { ...m, statut: "actif", disponible: true } : m))
      );
      alert("Menu publié !");
    } catch (err) {
      console.error("Erreur publication menu:", err);
      alert("Impossible de publier le menu.");
    }
  };

  const goEditMenu = (menuId) => navigate(`/voir-menu/${menuId}`);
  const goEditPlat = (platId, menuId) => navigate(`/plats-restaurateur/${menuId || ""}`);

  const renderAvisList = (list) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {list.map((a) => (
        <div
          key={a._id}
          style={{ border: "1px dashed #ddd", borderRadius: 8, padding: 10, background: "#fafafa" }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{a.note}/5</div>
          <div style={{ whiteSpace: "pre-wrap" }}>{a.contenu}</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
            {a.date_avis ? new Date(a.date_avis).toLocaleString() : ""}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) return <p style={{ textAlign: "center" }}>Chargement…</p>;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>Avis reçus</h2>

      {/* Onglets */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button
          onClick={() => {
            setTab("menus");
            setTypeFilter("all");
          }}
          style={{
            padding: "8px 14px",
            borderRadius: 20,
            border: `2px solid ${tab === "menus" ? "#2e7d32" : "#ddd"}`,
            background: tab === "menus" ? "#e8f5e9" : "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Menus
        </button>
        <button
          onClick={() => {
            setTab("plats");
            setTypeFilter("all");
          }}
          style={{
            padding: "8px 14px",
            borderRadius: 20,
            border: `2px solid ${tab === "plats" ? "#2e7d32" : "#ddd"}`,
            background: tab === "plats" ? "#e8f5e9" : "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Plats
        </button>
      </div>

      {/* Barre recherche + filtre */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          background:
            "linear-gradient(135deg, rgba(237,247,237,0.9) 0%, rgba(255,255,255,0.95) 100%)",
          border: "1px solid #e6e6e6",
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          borderRadius: 16,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            tab === "menus"
              ? "Rechercher (titre, type, avis…)"
              : "Rechercher (nom de plat, catégorie, avis…)"
          }
          style={{ flex: 1, padding: "10px 12px", borderRadius: 12, border: "1px solid #ddd" }}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #ddd" }}
        >
          {(tab === "menus" ? menuTypes : platCats).map((opt) => (
            <option key={opt} value={opt}>
              {tab === "menus"
                ? opt === "all"
                  ? "Tous les types"
                  : opt
                : opt === "all"
                ? "Toutes les catégories"
                : opt}
            </option>
          ))}
        </select>
      </div>

      {/* ===== MENUS ===== */}
      {tab === "menus" ? (
        menusGroupes.length === 0 ? (
          <p style={{ textAlign: "center" }}>Aucun avis sur vos menus.</p>
        ) : (
          menusGroupes.map(({ menu, avis }) => (
            <div
              key={menu._id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr",
                gap: 16,
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 14,
                marginBottom: 16,
                boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
              }}
            >
              {/* Colonne gauche : menu + plats */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 6,
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{menu.titre}</div>
                  <div style={{ fontWeight: 700 }}>
                    {menu.type || "—"} {menu.statut ? <> · {menu.statut}</> : null}
                  </div>
                </div>
                {menu.description && (
                  <div style={{ opacity: 0.85, marginBottom: 8 }}>{menu.description}</div>
                )}

                {Array.isArray(menu.plats) && menu.plats.length > 0 && (
                  <div style={{ display: "grid", gap: 10 }}>
                    {menu.plats.map((p) => (
                      <div
                        key={p._id}
                        style={{ border: "1px solid #eee", borderRadius: 10, overflow: "hidden" }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: p.image ? "140px 1fr" : "1fr",
                            gap: 10,
                          }}
                        >
                          {p.image && (
                            <img
                              src={`http://localhost:5000${p.image}`}
                              alt={p.nom}
                              style={{ width: "100%", height: 100, objectFit: "cover" }}
                            />
                          )}

                          
                          <div style={{ padding: 10 }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                              }}
                            >
                              <div style={{ fontWeight: 700 }}>{p.nom}</div>
                              <div>
                                {typeof p.prix === "number" ? `${p.prix.toFixed(2)} $` : "—"}
                              </div>
                            </div>
                            {p.description && (
                              <div style={{ opacity: 0.85 }}>{p.description}</div>
                            )}
                            {p?.categorie?.nom && (
                              <div style={{ fontSize: 12, opacity: 0.8 }}>
                                Catégorie : {p.categorie.nom}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  <button
                    onClick={() => goEditMenu(menu._id)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                      cursor: "pointer",
                    }}
                  >
                    Modifier ce menu
                  </button>
                  <button
                    onClick={() => publishMenu(menu._id)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "none",
                      background: "#2e7d32",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Publier
                  </button>
                </div>
              </div>

              {/* Colonne droite : avis */}
              <div>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>Avis reçus</div>
                {avis.length === 0 ? <em>Aucun avis pour ce menu.</em> : renderAvisList(avis)}
              </div>
            </div>
          ))
        )
      ) : // ===== PLATS =====
      platsGroupes.length === 0 ? (
        <p style={{ textAlign: "center" }}>Aucun avis sur vos plats.</p>
      ) : (
        platsGroupes.map(({ plat, avis }) => (
          <div
            key={plat._id}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 16,
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 14,
              marginBottom: 16,
              boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16 }}>
  {plat?.image && (
    <img
      src={`http://localhost:5000${plat.image}`}
      alt={plat.nom}
      style={{
        width: "100%",
        height: "140px",
        objectFit: "cover",
        borderRadius: 8,
      }}
    />
  )}

  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <div style={{ fontSize: 18, fontWeight: 800 }}>{plat.nom}</div>
      <div>{typeof plat.prix === "number" ? `${plat.prix.toFixed(2)} $` : "—"}</div>
    </div>

    {plat.description && (
      <div style={{ opacity: 0.85, marginTop: 4 }}>{plat.description}</div>
    )}

    {plat?.categorie?.nom && (
      <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
        Catégorie : {plat.categorie.nom}
      </div>
    )}

    <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
  <button
    onClick={() => goEditPlat(plat._id, plat.menu)}
    style={{
      padding: "8px 14px",
      borderRadius: 8,
      border: "1px solid #ddd",
      cursor: "pointer",
    }}
  >
    Modifier ce plat
  </button>

  <button
    onClick={() => publishPlat(plat._id)}
    style={{
      padding: "8px 14px",
      borderRadius: 8,
      border: "none",
      background: "#2e7d32",
      color: "#fff",
      cursor: "pointer",
    }}
  >
    Publier
  </button>
</div>
  </div>
</div>


            <div>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Avis reçus</div>
              {avis.length === 0 ? <em>Aucun avis pour ce plat.</em> : renderAvisList(avis)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
