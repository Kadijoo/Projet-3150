import React, { useState, useEffect } from "react";
import "../styles/SearchBar.css";
import ProfileMenu from "./ProfileMenu";

function SearchBar({ searchTerm, setSearchTerm }) {
  const role = localStorage.getItem("role");
  const isRestaurateur = role === "restaurateur";

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(stored);
  }, []);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  // Pour fermer les popups quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".notification-wrapper") && !e.target.closest(".profile-wrapper")) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="search-header">
      <div className="logo">TestMyMenu</div>

      <input
        type="text"
        placeholder="Rechercher un restaurant ou un plat..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {isRestaurateur && (
          <div className="notification-wrapper">
            <div className="notification-icon-container" onClick={toggleNotifications}>
              <span className="notification-icon">🔔</span>
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </div>

            {showNotifications && (
              <div className="notification-dropdown">
                {notifications.length > 0 ? (
                  <ul>
                    {notifications.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucune notification.</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="profile-wrapper">
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
