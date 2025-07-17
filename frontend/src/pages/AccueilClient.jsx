import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import "../styles/App.css";
import { useNavigate } from "react-router-dom";
import { filtrerParTerme } from "../utils/filtrage";

// Données des plats
const plats = [
    {
        id: 1,
        nom: "Shakshuka",
        image: "./images/Shakshuka.png",
        description: "Plat chaleureux du Moyen Orient...",
        ingredients: ["Huile d'olive", "Oignons", "Poivrons rouges", "Gousses d'ail", "Cafe"],
    },
    {
        id: 2,
        nom: "Filet mignon",
        image: "./images/Filet mignon.jpg",
        description: "Un filet mignon tendre et juteux...",
        ingredients: ["Filet mignon porc", "Tomates", "Chorizo", "Oignons", "Poivrons verts"],
    },
    {
        id: 3,
        nom: "Sushi",
        image: "./images/Sushi.jpg",
        description: "Assortiment de sushis frais accompagnés de sauce soja.",
        ingredients: ["Riz", "Saumon", "Avocat", "Algue nori", "Sauce soja"],
    },
    {
        id: 4,
        nom: "Tajine",
        image: "./images/Tajine.png",
        description: "Tajine marocain mijoté aux épices douces et légumes.",
        ingredients: ["Poulet", "Olives", "Citron confit", "Carottes", "Épices"],
    },
];

// Données des restaurants
const restaurants = [
    {
        id: 1,
        nom: "Restaurant L’amrit",
        image: "./images/amrit.jpg",
        adresse: "922 Mont-Royal Ave E, Montreal",
        description: "Cuisine riche et parfumée, mêlant recettes traditionnelles et modernes.",
    },
    {
        id: 2,
        nom: "Restaurant Palomar",
        image: "./images/palomar.jpg",
        adresse: "406 Rue Saint-Jacques, Montréal",
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
];

function AccueilClient() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // 🔒 Vérification de l'accès client uniquement
    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "client") {
            navigate("/login");
        }
    }, [navigate]);

    const platsVotes = JSON.parse(localStorage.getItem("platsVotes")) || [];
    const platsAffiches = plats.filter((p) => !platsVotes.includes(p.id)).slice(0, 4);
    const platsAffichesFiltres = filtrerParTerme(platsAffiches, searchTerm, ["nom", "description", "ingredients"]);
    const restaurantsFiltres = filtrerParTerme(restaurants, searchTerm, ["nom", "description", "adresse"]);

    const redirectOrLogin = (targetPath) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const isAuthenticated = !!user;
        if (!isAuthenticated) {
            navigate("/login", { state: { from: targetPath } });
        } else {
            navigate(targetPath);
        }
    };

    return (
        <div className="page-container">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <main className="main-content">
                <h2>Ces plats attendent votre avis</h2>
                <div
                    className="dish-list"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "30px",
                        padding: "0 20px",
                    }}
                >
                    {platsAffichesFiltres.map((plat) => (
                        <div
                            className="dish-section"
                            key={plat.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "12px",
                                overflow: "hidden",
                                backgroundColor: "#fff",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <img
                                src={plat.image}
                                alt={plat.nom}
                                style={{ width: "100%", height: "180px", objectFit: "cover" }}
                            />
                            <div style={{ padding: "15px", flex: "1" }}>
                                <p><strong>Description :</strong> {plat.description}</p>
                                <p><strong>Ingrédients :</strong></p>
                                <ul>
                                    {plat.ingredients.map((ing, index) => (
                                        <li key={index}>{ing}</li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => redirectOrLogin(`/avis/${plat.id}`)}
                                    style={{
                                        marginTop: "10px",
                                        backgroundColor: "#61dafb",
                                        border: "none",
                                        padding: "10px 16px",
                                        borderRadius: "6px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                    }}
                                >
                                    Donner mon avis
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button
                        style={{ backgroundColor: "#61dafb", padding: "10px 20px", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => redirectOrLogin("/menu")}
                    >
                        Parcourir plus
                    </button>
                </div>

                <h2 style={{ color: "green", margin: "40px 0 20px", textAlign: "center" }}>
                    Découvrez les menus des restaurants innovants
                </h2>

                <div
                    className="restaurant-list"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "30px",
                        padding: "0 20px",
                    }}
                >
                    {restaurantsFiltres.map((r) => (
                        <div
                            key={r.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "12px",
                                overflow: "hidden",
                                backgroundColor: "#fff",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <img
                                src={r.image}
                                alt={r.nom}
                                style={{ width: "100%", height: "180px", objectFit: "cover" }}
                            />
                            <div style={{ padding: "15px", flex: "1" }}>
                                <h3 style={{ marginBottom: "8px" }}>
                                    {r.nom}
                                    <span style={{ float: "right", color: "green", fontSize: "14px" }}>
                                        ouvert
                                    </span>
                                </h3>
                                <p style={{ color: "red", fontSize: "14px", margin: "5px 0" }}>
                                    📍 {r.adresse}
                                </p>
                                <p style={{ fontSize: "14px", color: "#444" }}>{r.description}</p>
                                <button
                                    style={{
                                        marginTop: "15px",
                                        backgroundColor: "green",
                                        color: "white",
                                        padding: "8px 16px",
                                        border: "none",
                                        borderRadius: "6px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => navigate(`/menu-restaurant/${r.id}`)}
                                >
                                    Consulter Menu
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: "center", marginTop: "30px" }}>
                    <button
                        onClick={() => {
                            const user = JSON.parse(localStorage.getItem("user"));
                            const isValidUser = user && user.email && user.role;
                            if (!isValidUser) {
                                navigate("/login", { state: { from: "/restaurants" } });
                            } else {
                                navigate("/restaurants");
                            }
                        }}
                        style={{
                            backgroundColor: "crimson",
                            color: "white",
                            padding: "12px 24px",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            fontSize: "16px",
                            cursor: "pointer",
                        }}
                    >
                        Explorer plus
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AccueilClient;