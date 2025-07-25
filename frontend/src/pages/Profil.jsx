import axios from "axios";
import { useEffect, useState } from "react";

const modalStyle = {
  backdrop: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modal: {
    background: "#fff",
    padding: "30px 40px",
    borderRadius: "15px",
    minWidth: "350px",
    maxWidth: "90%",
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
    position: "relative",
    fontFamily: "'Segoe UI', sans-serif"
  },
  closeBtn: {
    position: "absolute",
    top: "15px", right: "20px",
    background: "transparent",
    border: "none",
    fontSize: "1.4rem",
    cursor: "pointer"
  },
  title: {
    marginBottom: "20px",
    fontSize: "1.8rem",
    color: "#333"
  },
  label: {
    fontWeight: "bold",
    color: "#555"
  },
  info: {
    marginBottom: "10px",
    fontSize: "1rem"
  },
  fileInput: {
    marginTop: "15px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    width: "100%",
    fontSize: "1rem"
  }
};

const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("photo", file);

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post("http://localhost:5000/api/users/profile/photo", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    setUtilisateur(prev => ({ ...prev, photo: response.data.photo }));
  } catch (err) {
    console.error("Erreur upload photo :", err);
  }
};


const Profil = ({ onClose }) => {
  const [utilisateur, setUtilisateur] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUtilisateur = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUtilisateur(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUtilisateur();
  }, []);

  if (loading) {
    return (
      <div style={modalStyle.backdrop}>
        <div style={modalStyle.modal}>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!utilisateur) {
    return (
      <div style={modalStyle.backdrop}>
        <div style={modalStyle.modal}>
          <p>Impossible de charger les informations utilisateur.</p>
          <button style={modalStyle.closeBtn} onClick={onClose}>✖</button>
        </div>
      </div>
    );
  }

  return (
    <div style={modalStyle.backdrop}>
      <div style={modalStyle.modal}>
        <button style={modalStyle.closeBtn} onClick={onClose}>✖</button>
        <h2 style={modalStyle.title}>Mon Profil</h2>

{utilisateur.photo && (
  <div style={{ textAlign: "center", marginBottom: "20px" }}>
    <img
      src={`http://localhost:5000/uploads/${utilisateur.photo}`}
      alt="Photo de profil"
      style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
    />
  </div>
)}

        <p style={modalStyle.info}><span style={modalStyle.label}>Nom :</span> {utilisateur.nom}</p>
        <p style={modalStyle.info}><span style={modalStyle.label}>Email :</span> {utilisateur.email}</p>
        <p style={modalStyle.info}>
          <span style={modalStyle.label}>Dernière connexion :</span> {utilisateur.lastLogin ? new Date(utilisateur.lastLogin).toLocaleString() : "Non disponible"}
        </p>
                <div style={{ marginTop: "20px" }}>
          <label style={modalStyle.label}>Ajouter une photo de profil :</label>
          <input
            type="file"
            accept="image/*"
            style={modalStyle.fileInput}
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("photo", file);

              try {
                const token = localStorage.getItem("token");
                const response = await axios.post("http://localhost:5000/api/users/profile/photo", formData, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                  }
                });

                // ➕ Mise à jour de l'utilisateur localement
                setUtilisateur(prev => ({ ...prev, photo: response.data.photo }));

                // ➕ Mise à jour dans localStorage pour la navbar
                const oldUser = JSON.parse(localStorage.getItem("user"));
                localStorage.setItem("user", JSON.stringify({
                  ...oldUser,
                  photo: response.data.photo
                }));

              } catch (err) {
                console.error("Erreur upload photo :", err);
              }
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default Profil;
