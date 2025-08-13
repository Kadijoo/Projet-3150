import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccueilClient = () => {
  // === Plats ===
  const [plats, setPlats] = useState([]);
  const [loadingPlats, setLoadingPlats] = useState(true);

  // === Restaurants (inchangé visuellement) ===
  const [restaurants, setRestaurants] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const navigate = useNavigate();

  // === Recherche ===
  const [searchType, setSearchType] = useState("plats"); // "plats" | "restaurants"
  const [searchQuery, setSearchQuery] = useState("");

  // Index ownerId -> nom du resto (sert pour afficher le nom au-dessus des plats)
  const restoNameByOwner = useMemo(() => {
    const map = new Map();
    for (const r of restaurants) {
      const ownerId = r?.proprietaire?._id || r?.proprietaire || r?.owner; // id ou objet
      const rName = r?.nom_restaurant || r?.nom;
      if (ownerId && rName) map.set(String(ownerId), rName);
    }
    return map;
  }, [restaurants]);

  useEffect(() => {
    const fetchPlats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/plats");
        setPlats(res.data || []);
      } catch (err) {
        console.error("Erreur chargement plats :", err);
      } finally {
        setLoadingPlats(false);
      }
    };

    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/restaurants");
        setRestaurants(res.data || []);
      } catch (err) {
        console.error("Erreur chargement restaurants :", err);
      }
    };

    fetchPlats();
    fetchRestaurants();
  }, []);

  const handleClick = (restaurantId) => {
  navigate(`/restaurant/${restaurantId}/menus`);
};

  const donnerAvis = (platId) => {
    navigate(`/avis/plat/${platId}`);
  };

  // 4 plats d'accueil
  const platsAccueil = (plats || []).slice(0, 4);

  // 4 restaurants d'accueil (pour l’exclusion du bouton “Explorer plus”)
  const restaurantsAccueil = (restaurants || []).slice(0, visibleCount);

  // Bouton "Découvrir plus de plats"
  const decouvrirPlusPlats = () => {
    const excludeIds = platsAccueil.map((p) => p._id);
    navigate(`/plats?exclude=${excludeIds.join(",")}`, { state: { exclude: excludeIds } });
  };

  // Chips ingrédients "nom — catégorie"
  const renderIngredients = (ings = []) => {
    if (!Array.isArray(ings) || ings.length === 0) return <em>Aucun ingrédient</em>;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {ings.map((ing) => {
          const catNom = ing?.categorie?.nom || "—";
          return (
            <span
              key={ing._id || `${ing.nom}-${catNom}`}
              style={{
                border: "1px solid #ddd",
                borderRadius: "20px",
                padding: "6px 10px",
                fontSize: "12px",
                background: "#f9f9f9",
              }}
            >
              {ing.nom} — {catNom}
            </span>
          );
        })}
      </div>
    );
  };

  // ========= Logique de recherche =========
  const q = searchQuery.trim().toLowerCase();

  const filteredPlats = useMemo(() => {
    if (!q) return [];
    return plats.filter((p) => {
      const auteurName =
        p?.auteur?.nom_restaurant ||
        p?.auteur?.nom ||
        (p?.auteur?._id && restoNameByOwner.get(String(p.auteur._id))) ||
        (typeof p?.auteur === "string" && restoNameByOwner.get(String(p.auteur))) ||
        "";

      const ingredientsText = Array.isArray(p.ingredients)
        ? p.ingredients.map((i) => `${i?.nom || ""} ${i?.categorie?.nom || ""}`).join(" ")
        : "";

      const fields = [
        p?.nom,
        p?.description,
        String(p?.prix ?? ""),
        p?.categorie?.nom,
        auteurName,
        ingredientsText,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return fields.includes(q);
    });
  }, [q, plats, restoNameByOwner]);

  const filteredRestaurants = useMemo(() => {
    if (!q) return [];
    return restaurants.filter((r) => {
      const fields = [
        r?.nom_restaurant,
        r?.nom,
        r?.ville,
        r?.adresse,
        r?.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return fields.includes(q);
    });
  }, [q, restaurants]);

  // ========= UI helpers (cartes) =========
  const RestoHeaderForPlat = (plat) => {
    const direct = plat?.auteur?.nom_restaurant || plat?.auteur?.nom;
    if (direct) return direct;
    const auteurId = plat?.auteur?._id || plat?.auteur;
    const viaIndex = auteurId ? restoNameByOwner.get(String(auteurId)) : null;
    return viaIndex || "Nom du restaurant";
  };

  return (
    <div style={{ padding: "30px" }}>
      {/* =====================  BARRE DE RECHERCHE (NOUVEAU)  ===================== */}
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            background:
              "linear-gradient(135deg, rgba(237,247,237,0.9) 0%, rgba(255,255,255,0.95) 100%)",
            border: "1px solid #e6e6e6",
            boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
            borderRadius: "16px",
            padding: "14px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {/* Toggle type */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              background: "#f3f6f3",
              borderRadius: "12px",
              padding: "6px",
            }}
          >
            <button
              onClick={() => setSearchType("plats")}
              style={{
                border: "none",
                padding: "8px 14px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 600,
                background: searchType === "plats" ? "#2e7d32" : "transparent",
                color: searchType === "plats" ? "#fff" : "#2e7d32",
                transition: "all .2s",
              }}
            >
              Plats
            </button>
            <button
              onClick={() => setSearchType("restaurants")}
              style={{
                border: "none",
                padding: "8px 14px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 600,
                background: searchType === "restaurants" ? "#2e7d32" : "transparent",
                color: searchType === "restaurants" ? "#fff" : "#2e7d32",
                transition: "all .2s",
              }}
            >
              Restaurants
            </button>
          </div>

          {/* Champ recherche */}
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchType === "plats"
                  ? "Rechercher un plat (nom, ingrédient, catégorie, restaurant...)"
                  : "Rechercher un restaurant (nom, ville, adresse...)"
              }
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                outline: "none",
                fontSize: "15px",
              }}
            />
            {/* petite icône loupe */}
            <div
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "18px",
                opacity: 0.6,
              }}
              aria-hidden
              title="Rechercher"
            >
              🔎
            </div>
          </div>
        </div>
      </div>

      {/* =====================  RÉSULTATS DE RECHERCHE  ===================== */}
      {searchQuery.trim() && (
        <>
          <h2 style={{ textAlign: "center", color: "green", marginBottom: "18px" }}>
            Résultats de recherche
          </h2>

          {searchType === "plats" ? (
            filteredPlats.length === 0 ? (
              <p style={{ textAlign: "center" }}>Aucun plat trouvé.</p>
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginBottom: "40px",
                }}
              >
                {filteredPlats.map((plat) => (
                  <div
                    key={plat._id}
                    style={{
                      width: "320px",
                      border: "1px solid #ccc",
                      borderRadius: "15px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      overflow: "hidden",
                      background: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        background: "#e8f5e9",
                        padding: "10px 15px",
                        fontWeight: "bold",
                        color: "#2e7d32",
                      }}
                    >
                      {RestoHeaderForPlat(plat)}
                    </div>

                    {plat?.image ? (
                      <img
                        src={`http://localhost:5000${plat.image}`}
                        alt={plat.nom}
                        style={{ width: "100%", height: "200px", objectFit: "cover" }}
                      />
                    ) : null}

                    <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <h3 style={{ margin: 0 }}>{plat.nom}</h3>
                        <span style={{ fontWeight: "bold", color: "#333" }}>
                          {typeof plat.prix === "number" ? `${plat.prix.toFixed(2)} $` : "--"}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: "#555" }}>{plat.description || "—"}</p>
                      {plat?.categorie?.nom && (
                        <p style={{ margin: 0, color: "#666" }}>
                          <strong>Catégorie du plat :</strong> {plat.categorie.nom}
                        </p>
                      )}
                      <div>
                        <p style={{ margin: "6px 0 8px 0" }}><strong>Ingrédients</strong></p>
                        {renderIngredients(plat.ingredients)}
                      </div>
                      <button
                        onClick={() => donnerAvis(plat._id)}
                        style={{
                          marginTop: "12px",
                          backgroundColor: "green",
                          color: "#fff",
                          padding: "10px 15px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "14px",
                          alignSelf: "flex-end",
                        }}
                      >
                        Donner mon avis
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : filteredRestaurants.length === 0 ? (
            <p style={{ textAlign: "center" }}>Aucun restaurant trouvé.</p>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: "40px",
              }}
            >
              {filteredRestaurants.map((resto) => (
                <div
                  key={resto._id}
                  style={{
                    width: "300px",
                    border: "1px solid #ccc",
                    borderRadius: "15px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <img
                    src={`http://localhost:5000${resto.image}`}
                    alt={resto.nom}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      padding: "15px",
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1
                    }}
                  >
                    <div style={{ flexGrow: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "5px"
                        }}
                      >
                        <h3 style={{ margin: 0, fontWeight: "bold" }}>
                          {resto.nom_restaurant}
                        </h3>
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          ouvert
                        </span>
                      </div>
                      <p style={{ margin: "5px 0",fontSize: "20px", color: "#332c2cff" }}>
                        {resto.nom}
                      </p>
                      <p style={{ margin: "5px 0", color: "#c77070ff" }}>
                        📍 {resto.adresse}
                      </p>
                      <p style={{ margin: "5px 0", fontWeight: "#686868" }}>
                        🏙 Ville : {resto.ville || "Non spécifiée"}
                      </p>
                      <p style={{ fontSize: "16px" }}>{resto.description}</p>
                    </div>

                    <button
                      onClick={() => handleClick(resto._id)}
                      style={{
                        backgroundColor: "green",
                        color: "#fff",
                        padding: "10px 15px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "14px",
                        marginTop: "10px"
                      }}
                    >
                      Consulter Menu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* =====================  SECTIONS PAR DÉFAUT (si pas de recherche)  ===================== */}
      {!searchQuery.trim() && (
        <>
          {/* PLATS */}
          <h2 style={{ textAlign: "center", color: "green", marginBottom: "20px" }}>
            Plats du moment
          </h2>

          {loadingPlats ? (
            <p style={{ textAlign: "center" }}>Chargement des plats…</p>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                {platsAccueil.map((plat) => (
                  <div
                    key={plat._id}
                    style={{
                      width: "320px",
                      border: "1px solid #ccc",
                      borderRadius: "15px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      overflow: "hidden",
                      background: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        background: "#e8f5e9",
                        padding: "10px 15px",
                        fontWeight: "bold",
                        color: "#2e7d32",
                      }}
                    >
                      {RestoHeaderForPlat(plat)}
                    </div>

                    {plat?.image ? (
                      <img
                        src={`http://localhost:5000${plat.image}`}
                        alt={plat.nom}
                        style={{ width: "100%", height: "200px", objectFit: "cover" }}
                      />
                    ) : null}

                    <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <h3 style={{ margin: 0 }}>{plat.nom}</h3>
                        <span style={{ fontWeight: "bold", color: "#333" }}>
                          {typeof plat.prix === "number" ? `${plat.prix.toFixed(2)} $` : "--"}
                        </span>
                      </div>

                      <p style={{ margin: 0, color: "#555" }}>{plat.description || "—"}</p>

                      {plat?.categorie?.nom && (
                        <p style={{ margin: 0, color: "#666" }}>
                          <strong>Catégorie du plat :</strong> {plat.categorie.nom}
                        </p>
                      )}

                      <div>
                        <p style={{ margin: "6px 0 8px 0" }}><strong>Ingrédients</strong></p>
                        {renderIngredients(plat.ingredients)}
                      </div>

                      <button
                        onClick={() => donnerAvis(plat._id)}
                        style={{
                          marginTop: "12px",
                          backgroundColor: "green",
                          color: "#fff",
                          padding: "10px 15px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "14px",
                          alignSelf: "flex-end",
                        }}
                      >
                        Donner mon avis
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: "center", marginTop: "10px", marginBottom: "40px" }}>
                <button
                  onClick={decouvrirPlusPlats}
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Découvrir plus de plats
                </button>
              </div>
            </>
          )}

          {/* RESTAURANTS */}
          <h2 style={{ textAlign: "center", color: "green", marginBottom: "40px" }}>
            Découvrez les menus des restaurants innovants
          </h2>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center"
            }}
          >
            {restaurants.slice(0, visibleCount).map((resto) => (
              <div
                key={resto._id}
                style={{
                  width: "300px",
                  border: "1px solid #ccc",
                  borderRadius: "15px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <img
                  src={`http://localhost:5000${resto.image}`}
                  alt={resto.nom}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <div
                  style={{
                    padding: "15px",
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1
                  }}
                >
                  <div style={{ flexGrow: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "5px"
                      }}
                    >
                      <h3 style={{ margin: 0, fontWeight: "bold" }}>
                        {resto.nom_restaurant}
                      </h3>
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        ouvert
                      </span>
                    </div>
                    <p style={{ margin: "5px 0",fontSize: "20px", color: "#332c2cff" }}>
                      {resto.nom}
                    </p>
                    <p style={{ margin: "5px 0", color: "#c77070ff" }}>
                      📍 {resto.adresse}
                    </p>
                    <p style={{ margin: "5px 0", fontWeight: "#686868" }}>
                      🏙 Ville : {resto.ville || "Non spécifiée"}
                    </p>
                    <p style={{ fontSize: "16px" }}>{resto.description}</p>
                  </div>

                  <button
                    onClick={() => handleClick(resto._id)}
                    style={{
                      backgroundColor: "green",
                      color: "#fff",
                      padding: "10px 15px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "14px",
                      marginTop: "10px"
                    }}
                  >
                    Consulter Menu
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button
              onClick={() => {
                const user = JSON.parse(localStorage.getItem("user"));
                const isValidUser = user && user.email && user.role;

                const excludeIds = restaurantsAccueil.map((r) => r._id);
                const targetPath = `/restaurants?exclude=${excludeIds.join(",")}`;
                const targetState = { state: { exclude: excludeIds } };

                if (!isValidUser) {
                  navigate("/login", { state: { from: targetPath, exclude: excludeIds } });
                } else {
                  navigate(targetPath, targetState);
                }
              }}
              style={{
                backgroundColor: "crimson",
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Explorer plus
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AccueilClient;
