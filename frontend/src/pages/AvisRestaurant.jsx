// src/pages/AvisRestaurant.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

// Simuler des menus
const menus = [
  {
    id: 1,
    nom: "Menu Oriental",
    image: "/images/tajineexpress.jpg",
    description: "Un menu aux saveurs du Maghreb, avec tajine, couscous et thé à la menthe.",
  },
  {
    id: 2,
    nom: "Menu Indien",
    image: "/images/palaisindien.jpg",
    description: "Un assortiment d’épices et de plats indiens typiques avec curry, naan, etc.",
  },
];

function AvisRestaurant() {
  const { nom } = useParams();
  const navigate = useNavigate();
  const [choix, setChoix] = useState("");
  const [commentaire, setCommentaire] = useState("");

  const menu = menus.find((m) => m.nom === nom);

  if (!menu) return <p>Menu introuvable.</p>;

  const handleSubmit = (e) => {
    e.preventDefault();
    const avis = {
      menuNom: nom,
      choix,
      commentaire,
    };

    const anciens = JSON.parse(localStorage.getItem("avis")) || [];
    localStorage.setItem("avis", JSON.stringify([...anciens, avis]));
    alert("Merci pour votre avis sur ce menu !");
    navigate("/accueil-restaurateur");
  };

  const isActive = (val) =>
    choix === val ? { fontWeight: "bold", opacity: 1 } : { opacity: 0.6 };

  return (
    <div className="page-container">
      <main className="main-content" style={{ textAlign: "center" }}>
        <h2>{menu.nom}</h2>

        <img
          src={menu.image}
          alt={menu.nom}
          style={{
            width: "30%",
            borderRadius: "10px",
            marginBottom: "20px",
            maxWidth: "600px",
          }}
        />

        <p style={{ marginBottom: "30px", color: "#555" }}>{menu.description}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setChoix("like")}
            style={{
              border: "2px solid red",
              background: "white",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              ...isActive("like"),
            }}
          >
            J’aime ce menu
          </button>
          <button
            onClick={() => setChoix("dislike")}
            style={{
              border: "2px solid #61dafb",
              background: "white",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              ...isActive("dislike"),
            }}
          >
            Je n’aime pas ce menu
          </button>
          <button
            onClick={() => setChoix("suggestion")}
            style={{
              background: "blue",
              color: "white",
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              ...isActive("suggestion"),
            }}
          >
            Suggestion
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h3 style={{ marginBottom: "10px" }}>Comment peut-on améliorer ce menu ?</h3>
          <textarea
            placeholder="Insérer votre commentaire ici..."
            rows={6}
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              fontStyle: "italic",
              fontSize: "16px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginBottom: "20px",
            }}
            required
          ></textarea>
          <button
            type="submit"
            style={{
              backgroundColor: "blue",
              color: "white",
              padding: "10px 25px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Envoyer
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default AvisRestaurant;
