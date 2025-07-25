import {
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import PrivateRoute from "./components/PrivateRoute";
import AccueilClient from "./pages/AccueilClient.jsx";
import AccueilRestaurant from "./pages/AccueilRestaurant.jsx";
import AfficherMenus from "./pages/AfficherMenus";
import AfficherPlats from "./pages/AfficherPlats";
import AjouterPlat from "./pages/AjouterPlat";
import Avis from "./pages/Avis.jsx";
import AvisRestaurant from "./pages/AvisRestaurant";
import CreerMenu from "./pages/CreerMenu";
import CreerPlat from "./pages/CreerPlat";
import Inscription from "./pages/Inscription.jsx";
import ListePlats from "./pages/ListePlats";
import Login from "./pages/Login.jsx";
import Menu from "./pages/Menu.jsx";
import MenuRestaurant from "./pages/MenuRestaurant.jsx";
import Plat from "./pages/Plat.jsx";
import Profil from "./pages/Profil";
import Restaurants from "./pages/Restaurants.jsx";
import Unauthorized from "./pages/Unauthorized";

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
        <Route path="/" element={<AccueilClient />} />

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
        <Route path="/profil" element={<Profil />} />

        <Route path="/client" element={<PrivateRoute role="client">
        <AccueilClient /> </PrivateRoute>} />

        <Route path="/restaurateur" element={<PrivateRoute role="restaurateur">
      <AccueilRestaurant /> </PrivateRoute>}/>

         <Route path="/unauthorized" element={<Unauthorized />} />



        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;


