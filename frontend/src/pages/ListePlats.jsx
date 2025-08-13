import { useEffect, useState } from "react";

function ListePlats() {
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlats = async () => {
      try {
        const restaurateur = JSON.parse(localStorage.getItem("user"));
        const restaurateurId = restaurateur?.id;

        if (!restaurateurId) {
          console.error("❌ Aucun restaurateur trouvé dans le localStorage");
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:5000/api/plats/by-restaurateur/${restaurateurId}`);
        const data = await res.json();

        setPlats(data);
      } catch (err) {
        console.error("Erreur lors du chargement des plats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlats();
  }, []);

  // 🔹 Suppression d'un plat
  const supprimerPlat = async (platId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce plat ?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/plats/${platId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPlats((prev) => prev.filter((p) => p._id !== platId));
        alert("✅ Plat supprimé avec succès !");
      } else {
        alert("❌ Erreur lors de la suppression du plat.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erreur serveur.");
    }
  };

  // 🔹 Publier un plat pour avis client
  const publierPlat = async (platId) => {
    if (!window.confirm("Publier ce plat pour avis client ?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/plats/${platId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: "actif" }),
      });

      if (res.ok) {
        alert("✅ Plat publié pour avis client !");
      } else {
        alert("❌ Erreur lors de la publication du plat.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erreur serveur.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!plats.length) return <p>Aucun plat trouvé.</p>;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* 🔹 Titre de la page */}
      <h2 style={{ textAlign: "center",justifyContent: "center", margin: "20px 0", height:"50px", color: "#fff", backgroundColor: "#4CAF50" }}>
         Liste des plats
      </h2>

      {plats.map((plat) => (
        <div
          key={plat._id}
          style={{
            display: "flex",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          {/* Image à gauche */}
          {plat.image && (
            <img
              src={`http://localhost:5000${plat.image}`}
              alt={plat.nom}
              style={{ width: "250px", objectFit: "cover" }}
            />
          )}

          {/* Contenu à droite */}
          <div style={{ padding: "15px", flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Ligne titre + bouton supprimer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: "green", margin: 0 }}>{plat.nom}</h3>
              <button
                onClick={() => supprimerPlat(plat._id)}
                style={{
                  backgroundColor: "#e74c3c",
                  color: "white",
                  padding: "6px 10px",
                  width: "155px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                 Supprimer
              </button>
            </div>

            {plat.auteur?.nom_restaurant && (
              <p style={{ color: "#0077cc", fontWeight: "bold" }}>
                Restaurant {plat.auteur.nom_restaurant}
              </p>
            )}
            <p><strong>Description :</strong> {plat.description}</p>
            <p><strong>Prix :</strong> {plat.prix} $</p>

            {/* Ingrédients */}
            {plat.ingredients?.length > 0 && (
              <div>
                <strong>Ingrédients :</strong>
                {Object.entries(
                  plat.ingredients.reduce((acc, ing) => {
                    const catNom = ing?.categorie?.nom || "Autres";
                    if (!acc[catNom]) acc[catNom] = [];
                    acc[catNom].push(ing.nom);
                    return acc;
                  }, {})
                ).map(([cat, noms], idx) => (
                  <div key={idx}>
                    <p><strong>Catégorie :</strong> {cat}</p>
                    <ul>
                      {noms.map((nom, i) => <p key={i}>{nom}</p>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Bouton publier en bas */}
            <div style={{ marginTop: "auto", textAlign: "right" }}>
              <button
                onClick={() => publierPlat(plat._id)}
                style={{
                  backgroundColor: "#3498db",
                  color: "white",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                 Publier pour avis client
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListePlats;
