// server.js
require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");


const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

//app.use(cors({ origin: "http://localhost:5173", credentials: true }));

mongoose.connect(uri);
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Successfully connected to MongoDB");
});

connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});



/*const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Successfully connected to MongoDB");
});
/*mot de passe de la bd: BvmcBd0i5S1Tu4yk  nom de la base de donne : dbprojet2
connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});


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


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});*/