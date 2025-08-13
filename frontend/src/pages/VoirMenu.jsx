import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function VoirMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/menus/${id}`);
        const data = await res.json();
        setMenu(data);
      } catch (err) {
        console.error("Erreur lors du chargement du menu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>Chargement...</p>;
  if (!menu) return <p style={{ color: "red", textAlign: "center" }}>Menu non trouvé</p>;

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: "20px" }}>
      
      {/* Bouton retour */}
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

      {/* Informations du menu */}
      <div style={{
  background: "linear-gradient(90deg, #4CAF50, #81C784)",
  borderRadius: "12px",
  padding: "25px",
  color: "white",
  marginBottom: "30px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
}}>
  <h2 style={{
    fontSize: "28px",
    marginBottom: "15px",
    textAlign: "center",
    fontWeight: "bold"
  }}>
    {menu.titre}
  </h2>

  <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "15px", color: "#333" }}>
    <h3 style={{marginBottom: "15px",textAlign: "center",fontWeight: "bold"
  }}> {menu.description}</h3>
    <p> <strong>Type :</strong> {menu.type}</p>
    <p> <strong>Statut :</strong> {menu.statut}</p>
    <p> <strong>Disponible :</strong> {menu.disponible ? "Oui" : "Non"}</p>
    <p> <strong>Date création :</strong> {new Date(menu.date_creation).toLocaleDateString()}</p>
  </div>
</div>


      {/* Liste des plats */}
      {menu.plats?.length > 0 && (
  <div>
    <h3 style={{ color: "#4CAF50", marginBottom: "20px", fontSize:"25px" }}>Plats associés :</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "20px",marginTop: "20px", backgroundColor: "gray"}}>
      {menu.plats.map((plat) => (

        

        <div key={plat._id} style={{
          display: "flex",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}>

          <button
  onClick={async () => {
    if (window.confirm("Voulez-vous vraiment retirer ce plat du menu ?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/menus/${id}/plats/${plat._id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setMenu(prev => ({
            ...prev,
            plats: prev.plats.filter(p => p._id !== plat._id)
          }));
        } else {
          alert("Erreur lors de la suppression.");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la suppression.");
      }
    }
  }}
  style={{
    
    backgroundColor: "#d77e74ff",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    fontSize: "15px",
    cursor: "pointer"
  }}
>
   Supprimer du menu
</button>

          {/* Image à gauche */}
          {plat.image && (
            <img
              src={`http://localhost:5000${plat.image}`}
              alt={plat.nom}
              style={{
                width: "250px",
                height: "auto",
                objectFit: "cover",
                flexShrink: 0
              }}
            />
          )}

          {/* Contenu à droite */}
          <div style={{ padding: "15px", flex: 1 }}>
            {plat.auteur?.nom_restaurant && (
              <p style={{ color: "#0077cc", fontWeight: "bold", marginBottom: "5px" }}>
                Restaurant {plat.auteur.nom_restaurant}
              </p>
            )}
            <h3 style={{ color: "green", marginBottom: "10px" }}>{plat.nom}</h3>
            <p><strong>Description :</strong> {plat.description}</p>
            <p><strong>Prix :</strong> {plat.prix} $</p>

            {plat.ingredients?.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <strong>Ingrédients :</strong>
                {Object.entries(
                  plat.ingredients.reduce((acc, ing) => {
                    const catNom = ing?.categorie?.nom || "Autres";
                    if (!acc[catNom]) acc[catNom] = [];
                    acc[catNom].push(ing.nom);
                    return acc;
                  }, {})
                ).map(([categorieNom, noms], idx) => (
                  <div key={idx} style={{ marginTop: "5px" }}>
                    <p><strong>Catégorie :</strong> {categorieNom}</p>
                    <ul style={{ paddingLeft: "20px", margin: 0 }}>
                      {noms.map((nom, i) => <li key={i}>{nom}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}


      {/* Bouton ajout plat */}
      <button
        onClick={() => navigate(`/plats-restaurateur/${id}`)}
        style={{
          marginTop: 30,
          backgroundColor: "#4CAF50",
          color: "white",
          padding: 12,
          width: "100%",
          borderRadius: "8px",
          border: "none",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        ➕ Ajouter un plat
      </button>
    </div>
  );
}

export default VoirMenu;
