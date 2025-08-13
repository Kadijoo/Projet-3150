import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PlatsRestaurateur() {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const restaurateur = JSON.parse(localStorage.getItem("user"));
  const restaurateurId = restaurateur?.id;

  useEffect(() => {
  const fetchPlatsEtRestaurants = async () => {
    try {
      const [platsRes, restosRes] = await Promise.all([
        fetch(`http://localhost:5000/api/plats/by-restaurateur/${restaurateurId}`),
        fetch("http://localhost:5000/api/restaurants")
      ]);

      const platsData = await platsRes.json();
      const restosData = await restosRes.json();

      // Associer le nom du restaurant à chaque plat
      const platsAvecNomRestaurant = platsData.map((plat) => {
        const resto = restosData.find(r => r.proprietaire === plat.auteur);
        return {
          ...plat,
          nom_restaurant: resto?.nom || "Nom non trouvé"
        };
      });

      setPlats(platsAvecNomRestaurant);
    } catch (err) {
      console.error("Erreur chargement plats ou restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchPlatsEtRestaurants();
}, [restaurateurId]);

  const associerPlat = async (platId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/menus/${menuId}/associer-plat/${platId}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
});
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message);
    setMessage(`✅ Plat ajouté au menu !`);
    
    // ✅ Redirection
    navigate(`/voir-menu/${menuId}`);
  } catch (err) {
    setMessage(`❌ Erreur : ${err.message}`);
  }
};

  if (loading) return <p style={{ textAlign: "center" }}>Chargement...</p>;
  if (!plats.length) return <p style={{ textAlign: "center" }}>Aucun plat trouvé.</p>;

  return (
    <div style={{ maxWidth: 1000, margin: "30px auto", padding: 20 }}>
      {/* 🔙 Bouton retour */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
  <button
    style={{
      backgroundColor: "gray",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      fontWeight: "bold",
      cursor: "pointer",
      width: "150px"
    }}
    onClick={() => navigate("/restaurateur")}
  >
    Retour à l'accueil
  </button>

  <button
    style={{
      backgroundColor: "gray",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      fontWeight: "bold",
      cursor: "pointer",
      width: "150px"
    }}
    onClick={() => navigate(-1)}
  >
    Précédent
  </button>
</div>

      <h2 style={{ textAlign: "center", marginBottom: 30 }}>Plats disponibles</h2>
      {message && <p style={{ color: message.startsWith("✅") ? "green" : "red", textAlign: "center" }}>{message}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {plats.map((plat) => (
  <div key={plat._id} style={{
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  }}>
    {/* Nom du restaurant 
    {plat.nom_restaurant && (
  <h4 style={{ marginBottom: "15px", fontSize:"25px" , color: "#0077cc", fontWeight: "bold" }}>
    
    <p><strong>Restaurant</strong> {plat.nom_restaurant}</p>
  </h4>
)}*/}

    {/* Image */}
    {plat.image && (
      <img
        src={`http://localhost:5000${plat.image}`}
        alt={plat.nom}
        style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "5px" }}
      />
    )}

    {/* Infos plat */}
    <div style={{ marginTop: "10px" }}>
      <h3 style={{ marginBottom: "10px", fontSize:"20px" , color: "green", fontWeight: "bold" }}>
    
    {plat.nom}
  </h3>


      
      <p><strong>Description :</strong> {plat.description}</p>
      <p><strong>Prix :</strong> {plat.prix} $</p>

      {/* Ingrédients groupés par catégorie */}
      {Array.isArray(plat.ingredients) && plat.ingredients.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <strong>Ingrédients :</strong>
          {Object.entries(
            plat.ingredients.reduce((acc, ing) => {
              const catNom = ing?.categorie?.nom || "Autres";
              if (!acc[catNom]) acc[catNom] = [];
              acc[catNom].push(ing);
              return acc;
            }, {})
          ).map(([categorieNom, ingList], idx) => (
            <div key={idx} style={{  marginBottom: "5px" }}>
              <p><strong>Categorie :</strong> {categorieNom}</p>
              
              <ul style={{ margin: 0 }}>
                {ingList.map((ing, i) => (
                  <p key={i}>{typeof ing === "object" ? ing.nom : ing}</p>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Bouton en bas */}
    <div style={{ marginTop: "auto", textAlign: "center" }}>
      <button onClick={() => associerPlat(plat._id)}
        style={{ marginTop: "auto", backgroundColor: "#4CAF50", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >Associer ce plat au menu</button>
    </div>
  </div>
))}

      </div>
    </div>
  );
}

export default PlatsRestaurateur;
