import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/CreerPlatMenu.css";

function CreerPlatMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = useState("plat");
  const [id, setId] = useState(null);

  const [nomPlat, setNomPlat] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([""]);

  const [nomMenu, setNomMenu] = useState("");
  const [plats, setPlats] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("type");
    const idParam = params.get("id");
    if (t === "menu" || t === "plat") setType(t);
    if (idParam) setId(Number(idParam));

    if (t === "plat" && idParam) {
      const anciens = JSON.parse(localStorage.getItem("plats")) || [];
      const plat = anciens.find((p) => p.id === Number(idParam));
      if (plat) {
        setNomPlat(plat.nom);
        setDescription(plat.description);
        setIngredients(plat.ingredients.length > 0 ? plat.ingredients : [""]);
      }
    }

    if (t === "menu" && idParam) {
      const anciens = JSON.parse(localStorage.getItem("menus")) || [];
      const menu = anciens.find((m) => m.id === Number(idParam));
      if (menu) {
        setNomMenu(menu.nom);
        setPlats(menu.plats || []);
      }
    }
  }, [location.search]);

  const ajouterIngredient = () => setIngredients([...ingredients, ""]);
  const modifierIngredient = (val, i) => {
    const copie = [...ingredients];
    copie[i] = val;
    setIngredients(copie);
  };
  const supprimerIngredient = (i) => {
    const copie = [...ingredients];
    copie.splice(i, 1);
    setIngredients(copie);
  };

  const ajouterPlat = () => {
    setPlats([
      ...plats,
      {
        id: Date.now(),
        nom: "",
        description: "",
        ingredients: [""],
      },
    ]);
  };
  const supprimerPlat = (id) => setPlats(plats.filter((p) => p.id !== id));

  const modifierChampPlat = (id, champ, valeur) => {
    setPlats(
      plats.map((p) => (p.id === id ? { ...p, [champ]: valeur } : p))
    );
  };

  const modifierIngredientPlat = (platId, index, valeur) => {
    setPlats(
      plats.map((p) =>
        p.id === platId
          ? {
              ...p,
              ingredients: p.ingredients.map((ing, i) =>
                i === index ? valeur : ing
              ),
            }
          : p
      )
    );
  };

  const ajouterIngredientPlat = (platId) => {
    setPlats(
      plats.map((p) =>
        p.id === platId ? { ...p, ingredients: [...p.ingredients, ""] } : p
      )
    );
  };

  const supprimerIngredientPlat = (platId, index) => {
    setPlats(
      plats.map((p) =>
        p.id === platId
          ? {
              ...p,
              ingredients: p.ingredients.filter((_, i) => i !== index),
            }
          : p
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (type === "plat") {
      const plat = {
        id: id || Date.now(),
        nom: nomPlat,
        description,
        ingredients: ingredients.filter((i) => i.trim() !== ""),
        publie: false,
      };
      const anciens = JSON.parse(localStorage.getItem("plats")) || [];
      const maj = id
        ? anciens.map((p) => (p.id === plat.id ? plat : p))
        : [...anciens, plat];

      localStorage.setItem("plats", JSON.stringify(maj));
    } else {
      const menu = {
        id: id || Date.now(),
        nom: nomMenu,
        plats,
      };
      const anciens = JSON.parse(localStorage.getItem("menus")) || [];
      const maj = id
        ? anciens.map((m) => (m.id === menu.id ? menu : m))
        : [...anciens, menu];

      localStorage.setItem("menus", JSON.stringify(maj));
    }

    alert("✅ Sauvegarde réussie !");
    navigate(`/voir-plat-menu?type=${type}`);
  };

  return (
    <div className="page-container creer-plat-menu">
      <main className="main-content">
        <h2>{type === "plat" ? (id ? "Modifier un plat" : "Créer un plat") : id ? "Modifier un menu" : "Créer un menu"}</h2>

        <form onSubmit={handleSubmit}>
          {type === "plat" ? (
            <>
              <label>Nom du plat :</label>
              <input
                type="text"
                value={nomPlat}
                onChange={(e) => setNomPlat(e.target.value)}
                required
              />

              <label>Description :</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />

              <label>Ingrédients :</label>
              {ingredients.map((ing, i) => (
                <div key={i} style={{ display: "flex", marginBottom: "8px" }}>
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) => modifierIngredient(e.target.value, i)}
                    placeholder={`Ingrédient ${i + 1}`}
                    required
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => supprimerIngredient(i)}
                      style={{ marginLeft: "8px" }}
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={ajouterIngredient}>
                ➕ Ajouter un ingrédient
              </button>
            </>
          ) : (
            <>
              <label>Nom du menu :</label>
              <input
                value={nomMenu}
                onChange={(e) => setNomMenu(e.target.value)}
                required
              />

              <h3>Plats :</h3>
              {plats.map((plat) => (
                <div
                  key={plat.id}
                  style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}
                >
                  <label>Nom du plat :</label>
                  <input
                    type="text"
                    value={plat.nom}
                    onChange={(e) => modifierChampPlat(plat.id, "nom", e.target.value)}
                    required
                  />

                  <label>Description :</label>
                  <textarea
                    value={plat.description}
                    onChange={(e) => modifierChampPlat(plat.id, "description", e.target.value)}
                    required
                  />

                  <label>Ingrédients :</label>
                  {plat.ingredients.map((ing, idx) => (
                    <div key={idx} style={{ display: "flex", marginBottom: "8px" }}>
                      <input
                        type="text"
                        value={ing}
                        onChange={(e) => modifierIngredientPlat(plat.id, idx, e.target.value)}
                        required
                      />
                      {plat.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => supprimerIngredientPlat(plat.id, idx)}
                          style={{ marginLeft: "8px" }}
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => ajouterIngredientPlat(plat.id)}>
                    ➕ Ajouter ingrédient
                  </button>

                  <div style={{ marginTop: "10px" }}>
                    <button type="button" onClick={() => supprimerPlat(plat.id)}>
                      🗑️ Supprimer ce plat
                    </button>
                  </div>
                </div>
              ))}

              <button type="button" onClick={ajouterPlat}>
                ➕ Ajouter un plat
              </button>
            </>
          )}

          <br />
          <button type="submit">{id ? "Enregistrer les modifications" : "Créer"}</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default CreerPlatMenu;
