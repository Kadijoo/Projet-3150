import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/VoirPlatMenu.css";
import Footer from "../components/Footer";

function VoirPlatMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const [type, setType] = useState("plat");

  const [menus, setMenus] = useState([]);
  const [plats, setPlats] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("type");
    if (t === "menu" || t === "plat") setType(t);

    const menusLocal = (JSON.parse(localStorage.getItem("menus")) || []).map((m) => ({
      ...m,
      publie: m.publie ?? false,
    }));
    setMenus(menusLocal);

    const platsLocal = (JSON.parse(localStorage.getItem("plats")) || []).map((p) => ({
      ...p,
      publie: p.publie ?? false,
    }));
    setPlats(platsLocal);
  }, [location.search]);

  const publierPlat = (id) => {
    const maj = plats.map((p) => (p.id === id ? { ...p, publie: true } : p));
    localStorage.setItem("plats", JSON.stringify(maj));
    setPlats(maj);
  };

  const depublierPlat = (id) => {
    const maj = plats.map((p) => (p.id === id ? { ...p, publie: false } : p));
    localStorage.setItem("plats", JSON.stringify(maj));
    setPlats(maj);
  };

  const supprimerPlat = (id) => {
    if (!window.confirm("Supprimer ce plat ?")) return;
    const maj = plats.filter((p) => p.id !== id);
    localStorage.setItem("plats", JSON.stringify(maj));
    setPlats(maj);
  };

  const modifierPlat = (id) => {
    navigate(`/creer-plat-menu?type=plat&id=${id}`);
  };

  const publierMenu = (id) => {
    const menusMaj = menus.map((m) =>
      m.id === id ? { ...m, publie: true } : m
    );
    localStorage.setItem("menus", JSON.stringify(menusMaj));
    setMenus(menusMaj);

    const menuCible = menus.find((m) => m.id === id);
    if (menuCible) {
      const platsExistants = JSON.parse(localStorage.getItem("plats")) || [];
      const platsMaj = platsExistants.map((p) => {
        const estDansMenu = menuCible.plats.find((mp) => mp.id === p.id);
        return estDansMenu ? { ...p, publie: true } : p;
      });
      localStorage.setItem("plats", JSON.stringify(platsMaj));
      setPlats(platsMaj);
    }
  };

  const depublierMenu = (id) => {
    const menusMaj = menus.map((m) =>
      m.id === id ? { ...m, publie: false } : m
    );
    localStorage.setItem("menus", JSON.stringify(menusMaj));
    setMenus(menusMaj);

    const menuCible = menus.find((m) => m.id === id);
    if (menuCible) {
      const platsExistants = JSON.parse(localStorage.getItem("plats")) || [];
      const platsMaj = platsExistants.map((p) => {
        const estDansMenu = menuCible.plats.find((mp) => mp.id === p.id);
        return estDansMenu ? { ...p, publie: false } : p;
      });
      localStorage.setItem("plats", JSON.stringify(platsMaj));
      setPlats(platsMaj);
    }
  };

  const supprimerMenu = (id) => {
    if (!window.confirm("Supprimer ce menu ?")) return;
    const maj = menus.filter((m) => m.id !== id);
    localStorage.setItem("menus", JSON.stringify(maj));
    setMenus(maj);
  };

  const modifierMenu = (id) => {
    navigate(`/creer-plat-menu?type=menu&id=${id}`);
  };

  return (
    <div className="voir-plat-menu-page">
      <main className="voir-plat-menu-container">
        <div className="voir-plat-menu">
          {type === "plat" && (
            <>
              <h3>🍽️ Plats</h3>
              {plats.length === 0 ? (
                <p>Aucun plat créé.</p>
              ) : (
                plats.map((plat) => (
                  <div key={plat.id} className="card">
                    <h4>{plat.nom}</h4>
                    <p>{plat.description}</p>
                    <ul>
                      {plat.ingredients.map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                      ))}
                    </ul>
                    <div style={{ marginTop: "10px" }}>
                      <button onClick={() => supprimerPlat(plat.id)}>🗑️ Supprimer</button>
                      <button onClick={() => modifierPlat(plat.id)} style={{ marginLeft: "10px" }}>
                        ✏️ Modifier
                      </button>
                      {plat.publie ? (
                        <button onClick={() => depublierPlat(plat.id)} style={{ marginLeft: "10px" }}>
                          ❌ Retirer la publication
                        </button>
                      ) : (
                        <button onClick={() => publierPlat(plat.id)} style={{ marginLeft: "10px" }}>
                          ✅ Publier
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {type === "menu" && (
            <>
              <h3>📋 Menus</h3>
              {menus.length === 0 ? (
                <p>Aucun menu créé.</p>
              ) : (
                menus.map((menu) => (
                  <div key={menu.id} className="card">
                    <h4>{menu.nom}</h4>
                    {menu.plats.length === 0 ? (
                      <p>Aucun plat</p>
                    ) : (
                      menu.plats.map((plat, i) => (
                        <div key={i} className="plat-inside-menu">
                          <strong>{plat.nom}</strong>
                          <p>{plat.description}</p>
                          <ul>
                            {plat.ingredients.map((ing, idx) => (
                              <li key={idx}>{ing}</li>
                            ))}
                          </ul>
                        </div>
                      ))
                    )}
                    <div style={{ marginTop: "10px" }}>
                      <button onClick={() => supprimerMenu(menu.id)}>🗑️ Supprimer menu</button>
                      <button onClick={() => modifierMenu(menu.id)} style={{ marginLeft: "10px" }}>
                        ✏️ Modifier
                      </button>
                      {menu.publie ? (
                        <button onClick={() => depublierMenu(menu.id)} style={{ marginLeft: "10px" }}>
                          ❌ Retirer la publication
                        </button>
                      ) : (
                        <button onClick={() => publierMenu(menu.id)} style={{ marginLeft: "10px" }}>
                          ✅ Publier
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default VoirPlatMenu;
