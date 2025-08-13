// app.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));


// Import des routeurs
const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const menuRoutes = require("./routes/menuRoutes");
const platRoutes = require("./routes/platRoutes");
const avisRoutes = require("./routes/avisRoutes");
const voteRoutes = require("./routes/voteRoutes");
const propositionRoutes = require("./routes/propositionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const ingredientRoutes = require("./routes/ingredientRoutes");
const categorieRoutes = require("./routes/categorieRoutes");
const menuItemRoutes = require("./routes/menuItemRoutes");
const sectionRoutes = require("./routes/sectionRoutes");

// Utilisation des routeurs
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/plats", platRoutes);
app.use("/api/avis", avisRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/propositions", propositionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/categories", categorieRoutes);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static("images"));
app.use(express.urlencoded({ extended: true })); // pour multipart/form-data (FormData)

module.exports = app;
