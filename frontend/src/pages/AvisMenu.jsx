// src/pages/AvisMenu.jsx
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function AvisMenu() {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // si on a déjà le menu en state (passé depuis RestaurantMenus.jsx), on le prend direct
  const menuFromState = location.state?.menu || null;

  const [menu, setMenu] = useState(menuFromState);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(!menuFromState);

  // Avis form
  const [likeState, setLikeState] = useState(null); // "UP" | "DOWN" | null
  const [note, setNote] = useState(0);
  const [contenu, setContenu] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // si on a déjà le menu depuis l'état de navigation, on évite les requêtes inutiles
    if (menuFromState) {
      (async () => {
        try {
          const restosRes = await axios.get("http://localhost:5000/api/restaurants");
          setRestaurants(Array.isArray(restosRes.data) ? restosRes.data : []);
        } catch (e) {
          console.warn("Impossible de charger les restaurants:", e?.message);
        } finally {
          setLoading(false);
        }
      })();
      return;
    }

    // sinon on va le chercher (robuste: with-plats d'abord, puis /:id)
    const run = async () => {
      setLoading(true);
      try {
        // 1) /with-plats (souvent déjà peuplé)
        let found = null;
        try {
          const resAll = await axios.get("http://localhost:5000/api/menus/with-plats");
          const all = Array.isArray(resAll.data) ? resAll.data : [];
          found = all.find((m) => m._id === menuId) || null;
        } catch (_) {
          /* ignore */
        }

        if (!found) {
          // 2) fallback /:id (si exposé)
          try {
            const resOne = await axios.get(`http://localhost:5000/api/menus/${menuId}`);
            found = resOne.data || null;
          } catch (_) {
            /* ignore */
          }
        }

        setMenu(found);

        // 3) récupérer la liste des restaurants pour recomposer le nom si besoin
        const restosRes = await axios.get("http://localhost:5000/api/restaurants");
        setRestaurants(Array.isArray(restosRes.data) ? restosRes.data : []);
      } catch (err) {
        console.error("Erreur chargement menu:", err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [menuId, menuFromState]);

  // proprietaire(User) -> nom du restaurant
  const restoNameByOwner = useMemo(() => {
    const map = new Map();
    for (const r of restaurants) {
      const owner = r?.proprietaire?._id || r?.proprietaire;
      const name = r?.nom_restaurant || r?.nom;
      if (owner && name) map.set(String(owner), name);
    }
    return map;
  }, [restaurants]);

  // nom du restaurant depuis menu.restaurant (selon que ce soit un Restaurant ou un User)
  const restoName = useMemo(() => {
    if (!menu) return "Nom du restaurant";
    const r = menu.restaurant;
    const direct = r?.nom_restaurant || r?.nom;
    if (direct) return direct;
    const asId = typeof r === "object" && r ? (r._id || r.proprietaire) : r;
    return (asId && restoNameByOwner.get(String(asId))) || "Nom du restaurant";
  }, [menu, restoNameByOwner]);

  const handleVote = async (type) => {
    const next = likeState === type ? null : type;
    setLikeState(next);
    if (!user?.id) {
      navigate("/login", { state: { from: `/avis/menu/${menuId}` } });
      return;
    }
    if (!next) return;
    try {
      await axios.post("http://localhost:5000/api/votes", {
        type: next,
        cible: menuId,
        cibleModel: "Menu",
        auteur: user.id,
      });
    } catch (err) {
      console.warn(err?.response?.data?.error || "Vote non enregistré");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      navigate("/login", { state: { from: `/avis/menu/${menuId}` } });
      return;
    }
    if (!note || !contenu.trim()) {
      alert("Merci d’indiquer une note et un commentaire.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/avis", {
        contenu,
        note,
        auteur: user.id,
        cible: menuId,
        cibleModel: "Menu",
      });
      alert("Merci pour votre avis !");
      navigate(-1);
    } catch (err) {
      console.error("Erreur envoi avis :", err);
      alert("Impossible d’enregistrer l’avis.");
    }
  };

  const renderIngredientsLine = (ings = []) => {
    if (!Array.isArray(ings) || ings.length === 0) return "—";
    const haveNames = ings.some((i) => i && typeof i === "object" && i.nom);
    if (!haveNames) return "—";
    return ings
      .map((i) => `${i?.nom || ""}${i?.categorie?.nom ? ` (${i.categorie.nom})` : ""}`)
      .filter(Boolean)
      .join(", ");
  };

  if (loading) return <p style={{ textAlign: "center" }}>Chargement…</p>;
  if (!menu) return <p style={{ textAlign: "center" }}>Menu introuvable.</p>;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "transparent", border: "1px solid #ddd", padding: "8px 14px", borderRadius: 10, cursor: "pointer" }}
        >
          ← Retour
        </button>
        <h1 style={{ margin: 0, fontSize: 26, color: "#1b1b1b" }}>{menu.titre || "Menu"}</h1>
        <div />
      </div>

      {/* Carte menu */}
      <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 16, boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
        {/* Bandeau resto + type/statut */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 12,
            padding: "14px 18px",
            background: "linear-gradient(90deg,#e8f5e9,#f7fff7)",
            borderBottom: "1px solid #eef2ee",
          }}
        >
          <div style={{ fontWeight: 700, color: "#2e7d32" }}>{restoName}</div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontWeight: 700 }}>{menu.type || "—"}</span>
            {menu.statut && <span style={{ marginLeft: 10, opacity: 0.7 }}>· {menu.statut}</span>}
          </div>
        </div>

        {/* Description */}
        {menu.description && (
          <div style={{ padding: "12px 18px", color: "#444" }}>{menu.description}</div>
        )}
      </div>

      {/* Plats du menu */}
      <div style={{ marginTop: 18, display: "grid", gap: 16 }}>
        {Array.isArray(menu.plats) && menu.plats.length > 0 ? (
          menu.plats.map((p) => (
            <div
              key={p._id}
              style={{
                display: "grid",
                gridTemplateColumns: p.image ? "260px 1fr" : "1fr",
                gap: 16,
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #eee",
                boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
                overflow: "hidden",
              }}
            >
              {p.image && (
                <img
                  src={`http://localhost:5000${p.image}`}
                  alt={p.nom}
                  style={{ width: "100%", height: 180, objectFit: "cover" }}
                />
              )}
              <div style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <h3 style={{ margin: 0, color: "green" }}>{p.nom}</h3>
                  <div style={{ fontWeight: 700 }}>{typeof p.prix === "number" ? `${p.prix.toFixed(2)} $` : "—"}</div>
                </div>
                {p.description && <p style={{ margin: "0 0 6px 0", color: "#444" }}>{p.description}</p>}
                {p?.categorie?.nom && (
                  <p style={{ margin: "0 0 6px 0" }}>
                    <strong>Catégorie :</strong> {p.categorie.nom}
                  </p>
                )}
                <p style={{ margin: 0 }}>
                  <strong>Ingrédients :</strong> {renderIngredientsLine(p.ingredients)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>Aucun plat lié à ce menu.</p>
        )}
      </div>

      {/* Bloc avis (pour le menu) */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: 22,
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 16,
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          padding: 18,
        }}
      >
        {/* Like / Dislike */}
        <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => handleVote("UP")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 12,
              border: `2px solid ${likeState === "UP" ? "#2e7d32" : "#cfe8cf"}`,
              background: likeState === "UP" ? "#e8f5e9" : "transparent",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            👍 J’aime ce menu
          </button>
          <button
            type="button"
            onClick={() => handleVote("DOWN")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 12,
              border: `2px solid ${likeState === "DOWN" ? "#e57373" : "#f2cccc"}`,
              background: likeState === "DOWN" ? "#fdecec" : "transparent",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            👎 Je n’aime pas ce menu
          </button>
        </div>

        {/* Étoiles */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              onClick={() => setNote(i)}
              style={{ fontSize: 26, cursor: "pointer", userSelect: "none", filter: i <= note ? "none" : "grayscale(100%)" }}
              title={`${i} étoile${i > 1 ? "s" : ""}`}
            >
              ★
            </span>
          ))}
          <span style={{ marginLeft: 8, color: "#555" }}>{note ? `${note}/5` : "Cliquez pour noter"}</span>
        </div>

        {/* Commentaire */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
            Que pensez-vous de ce menu ? Comment peut-on l’améliorer ?
          </label>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder="Insérer votre commentaire ici..."
            rows={6}
            style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd", outline: "none", resize: "vertical" }}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#0d47a1",
              color: "#fff",
              padding: "12px 26px",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              width: 280,
              maxWidth: "100%",
            }}
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
}
