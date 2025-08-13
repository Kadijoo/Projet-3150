import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const [role, setRole] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Redirection après login (par défaut vers "/")
  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = await loginUser({
      email,
      mot_de_passe: password,
      type_utilisateur: role,
    });

    

    console.log("Login réussi:", data);
    if (data.utilisateur.type === "client") {
    navigate("/client", { replace: true });
      } else if (data.utilisateur.type === "restaurateur") {
    navigate("/restaurateur", { replace: true });
      } else {
    navigate("/", { replace: true }); 
    }

    // Stocker l'utilisateur dans localStorage
    
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ ...data.utilisateur, role: data.utilisateur.type }));

  } catch (err) {
    console.error(err);
    alert("Échec de la connexion : " + (err.response?.data?.message || "Erreur serveur"));
  }
};


  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          background: "#f1f3f4",
          padding: "40px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "450px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "green", marginBottom: "30px" }}>
          Authentification
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Choix du rôle */}
          <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginBottom: "20px" }}>
            <label>
              <input
                type="radio"
                value="client"
                checked={role === "client"}
                onChange={(e) => setRole(e.target.value)}
              />
              Client
            </label>
            <label>
              <input
                type="radio"
                value="restaurateur"
                checked={role === "restaurateur"}
                onChange={(e) => setRole(e.target.value)}
              />
              Restaurateur
            </label>
          </div>

          {/* Email */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "10px" }}
            />
          </div>

          {/* Mot de passe */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="password"
              placeholder="Mot de passe"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "10px" }}
            />
          </div>

          {/* Bouton Connexion et mot de passe oublié */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Se connecter
            </button>
            <a href="#" style={{ fontSize: "14px", color: "#333" }}>
              Mot de passe oublié ?
            </a>
          </div>

          {/* Lien vers inscription */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px" }}>Pas de compte ?</span>
            <button
              type="button"
              onClick={() => navigate("/inscription")}
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              S’inscrire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;


