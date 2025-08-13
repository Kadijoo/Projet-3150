import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreeMenu() {
  const [form, setForm] = useState({
    titre: "",
    description: "",
    type: "traditionnel",
    statut: "actif",
    disponible: true,
  });

  const [createdMenuId, setCreatedMenuId] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const restaurateurId = user?.id;

  useEffect(() => {
    if (!user || user.type !== "restaurateur") {
      alert("❌ Vous devez être connecté en tant que restaurateur pour créer un menu.");
      navigate("/login");
    }
  }, [navigate, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!restaurateurId) {
      alert("Erreur : Aucun ID restaurateur trouvé. Connectez-vous.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/menus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, restaurant: restaurateurId }),
    });

    const data = await res.json();
    if (!res.ok) return alert("Erreur : " + (data.error || data.message));

    alert("✅ Menu enregistré avec succès !");
    setCreatedMenuId(data._id);
    setForm({
      titre: "",
      description: "",
      type: "traditionnel",
      statut: "actif",
      disponible: true,
    });
  };

  const handleVoirMenu = () => {
    if (createdMenuId) {
      navigate(`/voir-menu/${createdMenuId}`);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: 30,
          borderRadius: 10,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: 600,
        }}
      >
        <h2 style={{ textAlign: "center", color: "#4CAF50" }}>Créer un Menu</h2>

        <label>Titre :</label>
        <input name="titre" value={form.titre} onChange={handleChange} required style={{ width: "100%" }} />

        <label>Description :</label>
        <textarea name="description" value={form.description} onChange={handleChange} style={{ width: "100%" }} />

        <label>Type :</label>
        <select name="type" value={form.type} onChange={handleChange} style={{ width: "100%" }}>
          <option value="traditionnel">Traditionnel</option>
          <option value="vegetarien">Végétarien</option>
          <option value="brunch">Brunch</option>
          <option value="plat principal">Plat Principal</option>
          <option value="autre">Autre</option>
        </select>

        <label>Statut :</label>
        <select name="statut" value={form.statut} onChange={handleChange} style={{ width: "100%" }}>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
          <option value="archive">Archivé</option>
        </select>

        <label>
          <input
            type="checkbox"
            name="disponible"
            checked={form.disponible}
            onChange={handleChange}
          />
          Disponible ?
        </label>

        <button type="submit" style={{ backgroundColor: "#4CAF50", color: "white", padding: 10, width: "100%", marginTop: 20 }}>
          Créer Menu
        </button>
      </form>

      <button
        onClick={handleVoirMenu}
        disabled={!createdMenuId}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          backgroundColor: createdMenuId ? "#2196F3" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: 5,
          
          cursor: createdMenuId ? "pointer" : "not-allowed"
        }}
      >
        Voir ce menu
      </button>
    </div>
  );
}

export default CreeMenu;
