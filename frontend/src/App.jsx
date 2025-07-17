import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Avis from "./pages/Avis.jsx";
import Login from "./pages/Login.jsx";
import Inscription from "./pages/Inscription.jsx";
import Menu from "./pages/Menu.jsx";
import MenuRestaurant from "./pages/MenuRestaurant.jsx";
import Plat from "./pages/Plat.jsx";
import Restaurants from "./pages/Restaurants.jsx";
import AccueilClient from "./pages/AccueilClient.jsx";
import AccueilRestaurant from "./pages/AccueilRestaurant.jsx";
import Layout from "./components/Layout.jsx";
import AjouterPlat from "./pages/AjouterPlat";
import ListePlats from "./pages/ListePlats";
import AvisRestaurant from "./pages/AvisRestaurant";
import CreerPlat from "./pages/CreerPlat";
import CreerMenu from "./pages/CreerMenu";
import AfficherPlats from "./pages/AfficherPlats";
import AfficherMenus from "./pages/AfficherMenus";
import "./styles/App.css";

function AccueilRedirect() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  if (role === "restaurateur") {
    return <AccueilRestaurant />;
  }
  return <AccueilClient />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccueilRedirect />} />

        <Route element={<Layout />}>
          <Route path="/accueil" element={<AccueilClient />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/restaurateur" element={<AccueilRestaurant />} />
          <Route path="/client" element={<AccueilClient />} />
          <Route path="/creer-plat" element={<Plat />} />
          <Route path="/restaurants" element={<Restaurants />} />
        </Route>

        <Route path="/avis/:id" element={<Avis />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/menu-restaurant/:id" element={<MenuRestaurant />} />
        <Route path="/ajouter-plat" element={<AjouterPlat />} />
        <Route path="/mes-plats" element={<ListePlats />} />
        <Route path="/avis-restaurant/:nom" element={<AvisRestaurant />} />
        <Route path="/creer-plat" element={<CreerPlat />} />
        <Route path="/creer-menu" element={<CreerMenu />} />
        <Route path="/afficher-plats" element={<AfficherPlats />} />
        <Route path="/afficher-menus" element={<AfficherMenus />} />

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;


