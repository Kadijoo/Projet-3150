import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import "../styles/CreerPlatMenu.css";

const TAG_OPTIONS = [
  { value: "épicé", label: "épicé" },
  { value: "végétarien", label: "végétarien" },
  { value: "halal", label: "halal" },
  { value: "legume", label: "legume" },
  { value: "sans gluten", label: "sans gluten" },
  { value: "sans lactose", label: "sans lactose" },
  { value: "vegan", label: "vegan" },
];

function CreerPlatMenu() {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const restaurateurId = user?.id;
useEffect(() => {
    if (!user || user.type !== "restaurateur") {
      alert("❌ Vous devez être connecté en tant que restaurateur pour créer un menu.");
      navigate("/login");
    }
  }, [navigate, user]);


  const handleAddCategory = () => {
    setCategories([
      ...categories,
      { id: Date.now(), nom: "", ingredients: [""] },
    ]);
  };

  const handleCategoryChange = (id, value) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, nom: value } : cat
      )
    );
  };

  const handleAddIngredientToCategory = (id) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id
          ? { ...cat, ingredients: [...cat.ingredients, ""] }
          : cat
      )
    );
  };

  const handleIngredientChange = (catId, index, value) => {
    setCategories(
      categories.map((cat) => {
        if (cat.id === catId) {
          const newIngredients = [...cat.ingredients];
          newIngredients[index] = value;
          return { ...cat, ingredients: newIngredients };
        }
        return cat;
      })
    );
  };

  const handleRemoveIngredient = (catId, index) => {
    setCategories(
      categories.map((cat) => {
        if (cat.id === catId) {
          const newIngredients = [...cat.ingredients];
          newIngredients.splice(index, 1);
          return { ...cat, ingredients: newIngredients };
        }
        return cat;
      })
    );
  };

  const handleRemoveCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Veuillez sélectionner une image");

    if (!restaurateurId) {
      alert("Erreur : Aucun ID restaurateur trouvé. Connectez-vous.");
      return;
    }


    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("prix", prix);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("tags", JSON.stringify(tags.map((tag) => tag.value)));
    //formData.append("ingredients", JSON.stringify(categories));
    formData.append("ingredients", JSON.stringify(categories.map(cat => ({nom: cat.nom,ingredients: cat.ingredients}))));
    //formData.append("auteur", utilisateurConnecte._id);
    formData.append("auteur", restaurateurId); 
    

    try {
      const response = await fetch("http://localhost:5000/api/plats", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error("Erreur backend : " + errText);
      }

      alert("✅ Plat ajouté avec succès !");
      navigate("/restaurateur");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("❌ Erreur : " + error.message);
    }
  };

  return (
    <div className="page-container creer-plat-menu">
      <main className="main-content">
        <h2 style={{ color: "green", textAlign: "center" }}>Création d’un plat</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-container">
          <label>Nom :</label>
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />

          <label>Prix (en $CAD) :</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="number"
              value={prix}
              step="0.01"
              min="0"
              onChange={(e) => setPrix(parseFloat(e.target.value))}
              required
            />
            <span style={{ marginRight: "5px" }}>$</span>
          </div>

          <label>Tags :</label>
          <CreatableSelect
            isMulti
            options={TAG_OPTIONS}
            value={tags}
            onChange={(selectedOptions) => setTags(selectedOptions)}
            placeholder="Sélectionner ou ajouter un tag"
            isClearable
            isSearchable
            onCreateOption={(inputValue) => {
              const newTag = { label: inputValue, value: inputValue };
              setTags((prev) => [...prev, newTag]);
            }}
            formatCreateLabel={(inputValue) => `Ajouter "${inputValue}"`}
          />

          <label>Description :</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

          <label>Image :</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />

          <h3>Ajouter un ingrédient</h3>
          <button type="button" onClick={handleAddCategory} style={{ backgroundColor: "#4CAF50", color: "white", width: "100%" }}>
            Ajouter un ingrédient
          </button>

          {categories.map((cat, catIndex) => (
            <div key={cat.id} style={{ backgroundColor: "#f9f9f9", padding: 15, margin: "15px 0", borderRadius: 8 }}>
              <h4 style={{ color: "#4CAF50" }}>Catégorie {catIndex + 1}</h4>
              <label>Sélectionner une Catégorie</label>
              <select value={cat.nom} onChange={(e) => handleCategoryChange(cat.id, e.target.value)}>
                <option value="">-- Sélectionner --</option>
                <option value="Légumes">Légumes</option>
                <option value="Viandes">Viandes</option>
                <option value="Fruits">Fruits</option>
                <option value="Épices">Épices</option>
                <option value="Proteines">Proteines</option>
                <option value="végétariens">végétariens</option>
                <option value="Céréales">Céréales</option>
                <option value="Légumineuses">Légumineuses</option>
                <option value="Huiles">Huiles</option>
                <option value="Féculent">Féculent</option>
                <option value="Produits Laitiers">Produits Laitiers</option>
                <option value="Fruits de Mer">Fruits de Mer</option>
                <option value="Sauces">Sauces</option>
                <option value="Noix & graine">Noix & graine</option>
              </select>

              <button type="button" onClick={() => handleAddIngredientToCategory(cat.id)} className="add-btn">
                Ajouter un Ingrédient à cette Catégorie
              </button>

              {cat.ingredients.map((ingredient, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(cat.id, i, e.target.value)}
                  />
                  <span
                    onClick={() => handleRemoveIngredient(cat.id, i)}
                    style={{ color: "#f44336", fontSize: 20, marginLeft: 10, cursor: "pointer" }}
                  >
                    ×
                  </span>
                </div>
              ))}

              <button type="button" onClick={() => handleRemoveCategory(cat.id)} style={{ backgroundColor: "#f44336", color: "white", marginTop: 10 }}>
                Supprimer cette Catégorie
              </button>
            </div>
          ))}

          <button type="submit" style={{ backgroundColor: "green", color: "white", marginTop: "20px" }}>
            Soumettre le Formulaire
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreerPlatMenu;
