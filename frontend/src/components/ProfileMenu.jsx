import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profil from "../pages/Profil"; // <- attention à bien ajuster le chemin selon ton arborescence

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [showProfilModal, setShowProfilModal] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const photo = user?.photo;


  const toggleMenu = () => setOpen(!open);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLogin = () => navigate("/login");

  const handleProfile = () => {
    setShowProfilModal(true); // au lieu de rediriger
    setOpen(false); // fermer le menu
  };

  return (
    <div style={{ position: "relative" }}>
      <button
  onClick={toggleMenu}
  style={{
    background: "none",
    border: "none",
    cursor: "pointer",
  }}
  title="Profil"
>
  <img
  src={photo || "/default-user-icon.png"}
  alt="profil"
  style={{
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #ccc",
  }}
/>
</button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "35px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            zIndex: 1000,
            width: "180px",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {user ? (
              <>
                <li><button onClick={handleProfile}>👤 Mon profil</button></li>
                <li style={{ borderTop: "1px solid #eee", marginTop: "10px", paddingTop: "10px" }}>
                  <button onClick={handleLogout}>🚪 Se déconnecter</button>
                </li>
              </>
            ) : (
              <li><button onClick={handleLogin}>🔐 Se connecter</button></li>
            )}
          </ul>
        </div>
      )}

      {/* Affichage de la modale */}
      {showProfilModal && <Profil onClose={() => setShowProfilModal(false)} />}
    </div>
  );
}

export default ProfileMenu;
