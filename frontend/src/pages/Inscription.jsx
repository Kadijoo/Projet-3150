import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
function Inscription() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialRole = location.state?.role || "client";
  const [role, setRole] = useState(initialRole);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  //const [telephone, setTelephone] = useState("");
  //const [nomResto, setNomResto] = useState("");
  //const [adresse, setAdresse] = useState("");
  //const [typeCuisine, setTypeCuisine] = useState("");
  //const [logo, setLogo] = useState("");
  //const [description, setDescription] = useState("");


  // const [logo, setLogo] = useState(null);

/*const handleFileChange = (e) => {
  setLogo(e.target.files[0]);
};*/

 
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (role === "client" && password !== confirm) {
    alert("Les mots de passe ne correspondent pas.");
    return;
  }

  if (password.length < 6) {
    alert("Le mot de passe doit contenir au moins 6 caractères");
    return;
  }

  const formData = new FormData();
  formData.append("email", email);
  formData.append("mot_passe", password);
  formData.append("type_utilisateur", role);

  if (role === "client") {
    formData.append("nom", nom);
  }

  if (role === "restaurateur") {
    formData.append("nom", nom);
  }

  try {
    const response = await registerUser(formData, role); // passez aussi le rôle
    alert("Inscription réussie !");
    navigate("/login");
  } catch (err) {
    console.error("Erreur complète :", err);
    if (err.response) {
      alert("Erreur lors de l'inscription : " + JSON.stringify(err.response.data));
    } else {
      alert("Erreur inattendue : " + err.message);
    }
  }
};


    return (
        <div
            style={{
                height: "100vh", // toute la page
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff", // ou une autre couleur si besoin
            }}
        >
            <div
                style={{
                    background: "#f1f3f4",
                    padding: "40px",
                    borderRadius: "12px",
                    width: "90%",
                    maxWidth: "450px", // contrôle la largeur
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
            >
                <h2 style={{ textAlign: "center", color: "green", marginBottom: "30px" }}>
                    Inscription
                </h2>


                <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginBottom: "20px" }}>
                    <label>
                        <input
                            type="radio"
                            value="client"
                            checked={role === "client"}
                            onChange={() => setRole("client")}
                        />
                        Client
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="restaurateur"
                            checked={role === "restaurateur"}
                            onChange={() => setRole("restaurateur")}
                        />
                        Restaurateur
                    </label>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    {role === "client" && (
                        <input
                            type="password"
                            placeholder="Confirmer le mot de passe"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    )}

                    {role === "restaurateur" && (
                        <input
                            type="password"
                            placeholder="Confirmer le mot de passe"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    )}

                    <button type="submit" style={buttonStyle}>
                        S'inscrire
                    </button>
                </form>
            </div>
        </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "5px",
  fontWeight: "bold",
};

export default Inscription;
