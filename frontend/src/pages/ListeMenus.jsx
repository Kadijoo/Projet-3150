import { useEffect, useState } from "react";

function ListeMenus() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const restaurateur = JSON.parse(localStorage.getItem("user"));
  const restaurateurId = restaurateur?.id;

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/menus/by-restaurateur/${restaurateurId}`);
        const data = await res.json();
        setMenus(data);
      } catch (err) {
        console.error("Erreur chargement menus :", err);
      } finally {
        setLoading(false);
      }
    };

    if (restaurateurId) {
      fetchMenus();
    }
  }, [restaurateurId]);

  if (loading) return <p>Chargement...</p>;
  if (!menus.length) return <p>Aucun menu trouvé.</p>;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
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
      {menus.map(menu => (

        <div key={menu._id} style={{ marginBottom: "40px" }}>

        <button
  onClick={async () => {
    if (window.confirm(`Voulez-vous vraiment supprimer le menu "${menu.titre}" ?`)) {
      try {
        const res = await fetch(`http://localhost:5000/api/menus/${menu._id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setMenus(prev => prev.filter(m => m._id !== menu._id));
        } else {
          alert("Erreur lors de la suppression du menu.");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur serveur lors de la suppression.");
      }
    }
  }}
  style={{
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px"
  }}
>
   Supprimer le menu
</button>


          {/* En-tête menu */}
          <div style={{
            background: "#4CAF50",
            borderRadius: "12px",
            padding: "20px",
            color: "white",
            marginBottom: "20px"
          }}>
            <h2 style={{ textAlign: "center" }}>{menu.titre}</h2>
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "15px",
              color: "#333",
              textAlign: "left"
            }}>
              <h4 style={{ textAlign: "center", marginBottom: "20px" }}>{menu.description}</h4>
              <p> <strong>Type :</strong> {menu.type}</p>
              <p> <strong>Statut :</strong> {menu.statut}</p>
              <p> <strong>Disponible :</strong> {menu.disponible ? "Oui" : "Non"}</p>
              <p> <strong>Date création :</strong> {new Date(menu.date_creation).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Liste plats */}
          {menu.plats?.length > 0 && menu.plats.map(plat => (
            <div key={plat._id} style={{
              display: "flex",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
              overflow: "hidden",
              marginBottom: "15px"
            }}>
              {plat.image && (
                <img
                  src={`http://localhost:5000${plat.image}`}
                  alt={plat.nom}
                  style={{ width: "250px", objectFit: "cover" }}
                />
              )}
              <div style={{ padding: "15px", flex: 1 }}>
                <h3 style={{ color: "green" }}>{plat.nom}</h3>
                <p><strong>Description :</strong> {plat.description}</p>
                <p><strong>Prix :</strong> {plat.prix} $</p>
                {plat.ingredients?.length > 0 && (
                  <div>
                    <strong>Ingrédients :</strong>
                    {Object.entries(
                      plat.ingredients.reduce((acc, ing) => {
                        const catNom = typeof ing.categorie === 'object' && ing.categorie !== null? ing.categorie.nom: "Autres";
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
              </div>
            </div>
          ))}

          <button
  onClick={async () => {
    if (window.confirm(`Publier le menu "${menu.titre}" pour avis client ?`)) {
      try {
        const res = await fetch(`http://localhost:5000/api/menus/${menu._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statut: "actif" })
        });
        if (res.ok) {
          alert("✅ Menu publié pour avis client !");
          setMenus(prev => prev.map(m =>
            m._id === menu._id ? { ...m, statut: "actif" } : m
          ));
        } else {
          alert("Erreur lors de la publication.");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur serveur lors de la publication.");
      }
    }
  }}
  style={{
    backgroundColor: "#3498db",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    textAlign: "center"
  }}
>
   Publier pour avis client
</button>


        </div>
      ))}
    </div>
  );
}

export default ListeMenus;
