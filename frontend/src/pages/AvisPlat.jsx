import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AvisPlat() {
  const { platId } = useParams();
  const navigate = useNavigate();

  const [plat, setPlat] = useState(null);
  const [loading, setLoading] = useState(true);

  // NEW: pour reconstruire le nom du resto si auteur non peuplé
  const [restaurants, setRestaurants] = useState([]);

  // Form avis
  const [likeState, setLikeState] = useState(null); // "UP" | "DOWN" | null
  const [note, setNote] = useState(0);
  const [contenu, setContenu] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const run = async () => {
      try {
        // 1) plat par ID (peut être NON peuplé)
        const [byIdRes, restosRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/plats/${platId}`),
          axios.get("http://localhost:5000/api/restaurants"), // NEW
        ]);
        const byId = byIdRes.data;
        setRestaurants(Array.isArray(restosRes.data) ? restosRes.data : []);

        // 2) si ingrédients/catégorie/auteur ne sont pas peuplés, fallback sur /api/plats
        const needFallback =
          !Array.isArray(byId?.ingredients) ||
          (Array.isArray(byId?.ingredients) && byId.ingredients[0] && !byId.ingredients[0]?.nom) ||
          (byId?.categorie && typeof byId.categorie === "string") ||
          (byId?.auteur && typeof byId.auteur === "string");

        if (needFallback) {
          try {
            const allRes = await axios.get("http://localhost:5000/api/plats");
            const all = Array.isArray(allRes.data) ? allRes.data : [];
            const same = all.find((p) => p._id === platId);
            setPlat(same || byId);
          } catch {
            setPlat(byId);
          }
        } else {
          setPlat(byId);
        }
      } catch (err) {
        console.error("Erreur chargement plat :", err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [platId]);

  // NEW: index proprietaire(User) -> nom de restaurant
  const restoNameByOwner = useMemo(() => {
    const map = new Map();
    for (const r of restaurants) {
      const ownerId = r?.proprietaire?._id || r?.proprietaire;
      const name = r?.nom_restaurant || r?.nom;
      if (ownerId && name) map.set(String(ownerId), name);
    }
    return map;
  }, [restaurants]);

  // Nom du resto: auteur.nom_restaurant si peuplé, sinon via l’index restaurants
  const restoName = useMemo(() => {
    if (!plat) return "Nom du restaurant";
    const direct = plat?.auteur?.nom_restaurant || plat?.auteur?.nom;
    if (direct) return direct;
    const auteurId = plat?.auteur?._id || plat?.auteur;
    return (auteurId && restoNameByOwner.get(String(auteurId))) || "Nom du restaurant";
  }, [plat, restoNameByOwner]);

  const handleVote = async (type) => {
    const next = likeState === type ? null : type;
    setLikeState(next);
    if (!user?.id) {
      navigate("/login", { state: { from: `/avis/plat/${platId}` } });
      return;
    }
    if (!next) return;
    try {
      await axios.post("http://localhost:5000/api/votes", {
        type: next, cible: platId, cibleModel: "Plat", auteur: user.id,
      });
    } catch (err) {
      console.warn(err?.response?.data?.error || "Vote non enregistré");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      navigate("/login", { state: { from: `/avis/plat/${platId}` } });
      return;
    }
    if (!note || !contenu.trim()) {
      alert("Merci d’indiquer une note et un commentaire.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/avis", {
        contenu, note, auteur: user.id, cible: platId, cibleModel: "Plat",
      });
      alert("Merci pour votre avis !");
      navigate(-1);
    } catch (err) {
      console.error("Erreur envoi avis :", err);
      alert("Impossible d’enregistrer l’avis.");
    }
  };

  // Affichage ingrédients (objet OU ID)
  const renderIngredients = (ings = []) => {
    if (!Array.isArray(ings) || ings.length === 0) return <em>Aucun ingrédient</em>;
    // on n’affiche que si on a des noms (sinon, ça veut dire non-peuplé)
    const haveNames = ings.some((i) => i && typeof i === "object" && i.nom);
    if (!haveNames) return <em>—</em>;
    return (
      <span>
        {ings
          .map((i) => `${i?.nom || ""}${i?.categorie?.nom ? ` (${i.categorie.nom})` : ""}`)
          .filter(Boolean)
          .join(", ")}
      </span>
    );
  };

  if (loading) return <p style={{ textAlign: "center" }}>Chargement…</p>;
  if (!plat) return <p style={{ textAlign: "center" }}>Plat introuvable.</p>;

  return (
    <div style={{ maxWidth: 950, margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "transparent", border: "1px solid #ddd", padding: "8px 14px", borderRadius: 10, cursor: "pointer" }}
        >
          ← Retour
        </button>
        <h1 style={{ margin: 0, fontSize: 26, color: "#1b1b1b" }}>{plat.nom}</h1>
        <div />
      </div>

      {/* Carte Plat */}
      <div
        style={{
          background: "#fff", border: "1px solid #eee", borderRadius: 16,
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)", overflow: "hidden",
        }}
      >
        {/* Bandeau nom resto + prix */}
        <div
          style={{
            display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center",
            padding: "14px 18px", background: "linear-gradient(90deg, #e8f5e9, #f7fff7)", borderBottom: "1px solid #eef2ee",
          }}
        >
          <div style={{ fontWeight: 700, color: "#2e7d32" }}>{restoName}</div>
          <div style={{ fontWeight: 700 }}>
            {typeof plat.prix === "number" ? `${plat.prix.toFixed(2)} $` : "—"}
          </div>
        </div>

        {/* Image + desc */}
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 18, padding: 18 }}>
          {plat.image && (
            <img
              src={`http://localhost:5000${plat.image}`}
              alt={plat.nom}
              style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 14, border: "1px solid #eee" }}
            />
          )}

          <div>
            {plat.description && (
              <p style={{ marginTop: 0, marginBottom: 8, color: "#444", lineHeight: 1.4 }}>
                {plat.description}
              </p>
            )}

            {plat?.categorie?.nom && (
              <p style={{ margin: "6px 0", color: "#333" }}>
                <strong>Catégorie :</strong> {plat.categorie.nom}
              </p>
            )}

            <p style={{ margin: "6px 0", color: "#333" }}>
              <strong>Ingrédients :</strong> {renderIngredients(plat.ingredients)}
            </p>
          </div>
        </div>
      </div>

      {/* Bloc avis */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: 22, background: "#fff", border: "1px solid #eee",
          borderRadius: 16, boxShadow: "0 10px 25px rgba(0,0,0,0.06)", padding: 18,
        }}
      >
        {/* Like / dislike */}
        <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => handleVote("UP")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 14px",
              borderRadius: 12, border: `2px solid ${likeState === "UP" ? "#2e7d32" : "#cfe8cf"}`,
              background: likeState === "UP" ? "#e8f5e9" : "transparent",
              cursor: "pointer", fontWeight: 600,
            }}
          >
            👍 J’aime ce plat
          </button>

          <button
            type="button"
            onClick={() => handleVote("DOWN")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 14px",
              borderRadius: 12, border: `2px solid ${likeState === "DOWN" ? "#e57373" : "#f2cccc"}`,
              background: likeState === "DOWN" ? "#fdecec" : "transparent",
              cursor: "pointer", fontWeight: 600,
            }}
          >
            👎 Je n’aime pas ce plat
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
          <span style={{ marginLeft: 8, color: "#555" }}>
            {note ? `${note}/5` : "Cliquez pour noter"}
          </span>
        </div>

        {/* Commentaire */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
            Que pensez-vous de ce plat ? Comment peut-on l’améliorer ?
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
              backgroundColor: "#0d47a1", color: "#fff", padding: "12px 26px",
              border: "none", borderRadius: 10, fontWeight: 700, fontSize: 16,
              cursor: "pointer", width: 280, maxWidth: "100%",
            }}
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
}
