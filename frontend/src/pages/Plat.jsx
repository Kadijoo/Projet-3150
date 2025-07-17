import React, { useState } from "react";

function Plat() {
  const [nom, setNom] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const nouveauPlat = { nom, image, description };
    console.log("Plat créé :", nouveauPlat);
    alert("Plat ajouté !");
  };

  return (
    <div className="main-content" style={{ textAlign: "center" }}>
      <h2 style={{ color: "green" }}>Création d’un plat</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#f5f5f5",
          padding: "30px",
          maxWidth: "600px",
          margin: "auto",
          borderRadius: "10px",
        }}
      >
        <div style={formRow}>
          <label style={formLabel}>Nom du Plat</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            style={formInput}
          />
        </div>

        <div style={formRow}>
          <label style={formLabel}>Image</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            style={formInput}
          />
        </div>

        <div style={formRow}>
          <label style={formLabel}>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={formInput}
          />
        </div>

        <button type="submit" style={{ ...formButton, backgroundColor: "green", color: "white" }}>
          Ajouter
        </button>
      </form>
    </div>
  );
}

const formRow = {
  marginBottom: "15px",
  display: "flex",
};

const formLabel = {
  width: "40%",
  background: "#d3d3d3",
  padding: "10px",
  fontWeight: "bold",
  textAlign: "left",
};

const formInput = {
  flex: 1,
  padding: "10px",
  border: "1px solid #ccc",
};

const formButton = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default Plat;
