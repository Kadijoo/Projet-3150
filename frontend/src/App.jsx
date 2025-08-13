import {
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import PrivateRoute from "./components/PrivateRoute";
import AccueilClient from "./pages/AccueilClient.jsx";
import AccueilRestaurant from "./pages/AccueilRestaurant.jsx";
import AjouterPlat from "./pages/AjouterPlat";
import AvisMenu from "./pages/AvisMenu";
import AvisPlat from "./pages/AvisPlat";
import AvisRecusRestaurateur from "./pages/AvisRecusRestaurateur";
import CreeMenu from "./pages/CreeMenu";
import CreerPlatMenu from "./pages/CreerPlatMenu";
import CreerRestaurant from "./pages/CreerRestaurant";
import Inscription from "./pages/Inscription.jsx";
import ListeMenus from "./pages/ListeMenus";
import ListePlats from "./pages/ListePlats";
import Login from "./pages/Login.jsx";
import Menu from "./pages/Menu.jsx";
import Plats from "./pages/Plats";
import PlatsAutres from "./pages/PlatsAutres";
import PlatsRestaurateur from "./pages/PlatsRestaurateur";
import Profil from "./pages/Profil";
import RestaurantMenus from "./pages/RestaurantMenus";
import Restaurants from "./pages/Restaurants";
import Unauthorized from "./pages/Unauthorized";
import VoirMenu from "./pages/VoirMenu";
import VoirPlatMenu from "./pages/VoirPlatMenu";

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
        
        <Route element={<Layout />}>
          <Route path="/accueil" element={<AccueilClient />} />
          <Route path="/" element={<AccueilClient />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/restaurateur" element={<AccueilRestaurant />} />
          <Route path="/client" element={<AccueilClient />} />
          <Route path="/mes-avis" element={<AvisRecusRestaurateur />} />
          <Route path="/plats" element={<Plats />} />
          <Route path="/avis/plat/:platId" element={<AvisPlat />} />
          <Route path="/voir-menu/:id" element={<VoirMenu />} />
          <Route path="/plats-restaurateur/:menuId" element={<PlatsRestaurateur />} />
          <Route path="/creer-restaurant" element={<CreerRestaurant />} />
          <Route path="/creer-plat-menu" element={<CreerPlatMenu />} />
          <Route path="/creer-menu" element={<CreeMenu />} />
          <Route path="/liste-menus" element={<ListeMenus />} />
          <Route path="/avis/menu/:menuId" element={<AvisMenu />} />
          <Route path="/liste-plats" element={<ListePlats />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurateur/avis" element={<PrivateRoute role="restaurateur"><AvisRecusRestaurateur /></PrivateRoute>} />
          <Route path="/restaurant/:restaurantId/menus" element={<RestaurantMenus />} />
          <Route path="/plats-autres" element={<PlatsAutres />} />

        </Route>

        
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        
        <Route path="/ajouter-plat" element={<AjouterPlat />} />
        
        
        <Route path="/creer-restaurant" element={<CreerRestaurant />} />
        <Route path="/creer-plat-menu" element={<CreerPlatMenu />} />
        <Route path="/voir-plat-menu" element={<VoirPlatMenu />} />
        <Route path="/profil" element={<Profil />} />

        <Route path="/client" element={<PrivateRoute role="client">
          <AccueilClient /> </PrivateRoute>} />

        <Route path="/restaurateur" element={<PrivateRoute role="restaurateur">
          <AccueilRestaurant /> </PrivateRoute>} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
