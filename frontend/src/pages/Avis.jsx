import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import Footer from "../components/Footer.jsx";

// ✅ Données des plats (à centraliser plus tard si besoin)
const plats = [
  {
    id: 1,
    nom: "Shakshuka",
    image: "/images/Shakshuka.png",
    description: "Shakshuka aux œufs et sauce tomate épicée.",
  },
  {
    id: 2,
    nom: "Filet mignon",
    image: "/images/Filet mignon.jpg",
    description: "Filet mignon grillé aux inspirations portugaises.",
  },
  {
    id: 3,
    nom: "Sushi",
    image: "/images/Sushi.jpg",
    description: "Assortiment de sushis frais avec sauce soja.",
  },
  {
    id: 4,
    nom: "Tajine",
    image: "/images/Tajine.png",
    description: "Tajine marocain aux légumes et épices douces.",
  },
  {
    id: 5,
    nom: "Pâtes au parmesan",
    image: "/images/Pasta.png",
    description: "Pâtes crémeuses au parmesan.",
  },
  {
    id: 6,
    nom: "Pad Thai",
    image: "/images/PadThai.jpg",
    description: "Pad Thai traditionnel aux crevettes.",
  },
];

const restaurants = [
    {
        id: 1,
        nom: "Restaurant L’amrit",
        image: "./images/amrit.jpg",
        adresse: "922 Mont-Royal Ave E, Montreal, Quebec H2J 1X1, Canada",
        description: "Cuisine riche et parfumée, mêlant recettes traditionnelles et modernes.",
    },
    {
        id: 2,
        nom: "Restaurant Palomar",
        image: "./images/palomar.jpg",
        adresse: "406 Rue Saint-Jacques, Montréal, QC H2Y 1S1, Canada",
        description: "Cuisine méditerranéenne raffinée, saveurs du Moyen-Orient et d’Israël.",
    },
    {
        id: 3,
        nom: "Chez Momo",
        image: "./images/chezmomo.jpg",
        adresse: "5201 Saint-Laurent Blvd, Montreal, QC H2T 1S4, Canada",
        description: "Spécialités marocaines servies dans un cadre chaleureux et coloré.",
    },
    {
        id: 4,
        nom: "Sakura Japonais",
        image: "./images/sakura.jpg",
        adresse: "201 Rue Milton, Montréal, QC H2X 1V5, Canada",
        description: "Cuisine japonaise moderne avec sushis, ramen et grillades authentiques.",
    },
    // ajoute d’autres restaurants ici...
];

function AvisPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const plat = plats.find((p) => p.id === parseInt(id));

  const [choix, setChoix] = useState(""); // 'like' | 'dislike' | 'suggestion'
  const [commentaire, setCommentaire] = useState("");

  if (!plat) return <p>Plat introuvable.</p>;

  const handleSubmit = (e) => {
    e.preventDefault();

    const avis = {
      platId: plat.id,
      choix,
      commentaire,
    };

    console.log("Avis soumis :", avis);
    alert("Merci pour votre avis !");

    // Sauvegarder dans localStorage
    const platsVotes = JSON.parse(localStorage.getItem("platsVotes")) || [];
    if (!platsVotes.includes(plat.id)) {
      platsVotes.push(plat.id);
      localStorage.setItem("platsVotes", JSON.stringify(platsVotes));
    }

    navigate("/"); // retour à l'accueil
  };

  const isActive = (val) =>
    choix === val ? { fontWeight: "bold", opacity: 1 } : { opacity: 0.6 };

  return (
    <div className="page-container">
      <SearchBar searchTerm="" setSearchTerm={() => {}} />

      <div className="main-content" style={{ textAlign: "center" }}>
        <h2>{plat.nom}</h2>

        <img
          src={plat.image}
          alt={plat.nom}
          style={{
            width: "20%",
            borderRadius: "10px",
            marginBottom: "20px",
            maxWidth: "600px",
          }}
        />

        <p style={{ marginBottom: "30px", color: "#555" }}>{plat.description}</p>

        {/* Choix like/dislike/suggestion */}
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
            J’aime ce plat
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
            Je n'aime pas ce plat
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

        {/* Formulaire de commentaire */}
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: "700px", margin: "0 auto" }}
        >
          <h3 style={{ marginBottom: "10px" }}>
            Que pensez-vous de ce plat ? Comment peut-on l’améliorer ?
          </h3>
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
      </div>

      <Footer />
    </div>
  );
}

export default AvisPage;

