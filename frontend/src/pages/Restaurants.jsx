import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Récupérer les IDs exclus depuis state OU query
  const excludedIds = useMemo(() => {
    // depuis /restaurants?exclude=...
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get("exclude")
      ? params.get("exclude").split(",").filter(Boolean)
      : [];
    // depuis location.state.exclude
    const fromState = location.state?.exclude || [];
    return Array.from(new Set([...(fromQuery || []), ...(fromState || [])]));
  }, [location.search, location.state]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/restaurants");
        const data = Array.isArray(res.data) ? res.data : [];
        // exclure ceux de l'accueil
        const excluded = new Set(excludedIds);
        const filtered = data.filter(r => !excluded.has(r._id));
        setRestaurants(filtered);
      } catch (err) {
        console.error("Erreur chargement restaurants :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [excludedIds]);

  const handleClick = (id) => {
  navigate(`/restaurant/${id}/menus`);
};

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "left", color: "green", marginBottom: "20px" }}>
        Consulter les menus des restaurants innovant
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Chargement…</p>
      ) : restaurants.length === 0 ? (
        <p style={{ textAlign: "center" }}>Aucun restaurant supplémentaire disponible.</p>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          {restaurants.map((resto) => (
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
    </div>
  );
};

export default Restaurants;
