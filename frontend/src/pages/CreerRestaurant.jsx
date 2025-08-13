import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreerRestaurant() {
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [proprietaire, setProprietaire] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    
const restaurateurId = user?.id || user?._id;
const userType = user?.type || user?.type_utilisateur;

if (restaurateurId && userType === "restaurateur") {
  setProprietaire(restaurateurId);
} else {
  alert("❌ Accès réservé aux restaurateurs connectés.");
  navigate("/login");
}

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("adresse", adresse);
    formData.append("ville", ville);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("proprietaire", proprietaire);

    console.log("Nom :", formData.get("nom"));
  console.log("Image :", formData.get("image")); 
    try {
      const token = localStorage.getItem("token");
      console.log("🧪 image =", image);
console.log("📦 FormData image =", formData.get("image"));


      await axios.post("http://localhost:5000/api/restaurants", formData, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data"
  }
});


      alert("✅ Restaurant enregistré !");
      navigate("/restaurateur");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur : " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2 style={{ color: "green", marginBottom: "30px" }}>Création d’un restaurant</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "inline-block",
          padding: "30px",
          backgroundColor: "#f6f6f6",
          borderRadius: "12px",
        }}
      >
        <FormRow label="Nom">
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required style={inputStyle} />
        </FormRow>

        <FormRow label="Adresse">
          <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} required style={inputStyle} />
        </FormRow>

        <FormRow label="Ville">
          <input type="text" value={ville} onChange={(e) => setVille(e.target.value)} required style={inputStyle} />
        </FormRow>

        <FormRow label="Description">
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />
        </FormRow>

        <FormRow label="Image">
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required style={inputStyle} />
        </FormRow>

        <button
          type="submit"
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "10px 50px",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}

function FormRow({ label, children }) {
  return (
    <div style={{ display: "flex", marginBottom: "15px" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

const labelStyle = {
  backgroundColor: "#ccc",
  width: "150px",
  padding: "10px",
  fontWeight: "bold",
  textAlign: "left",
};

const inputStyle = {
  flex: 1,
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

export default CreerRestaurant;
