const express = require("express");
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
/*mot de passe de la bd: BvmcBd0i5S1Tu4yk  nom de la base de donne : dbprojet2*/
connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});


// Import des routeurs
const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const menuRoutes = require("./routes/menuRoutes");
const avisRoutes = require("./routes/avisRoutes");
const platRoutes = require("./routes/platRoutes");


// Utilisation des routeurs
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/avis", avisRoutes);
app.use("/api/plats", platRoutes);


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});