import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleMenu = () => setOpen(!open);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLogin = () => navigate("/login");

  const handleProfile = () => navigate("/profil");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        onClick={toggleMenu}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "22px",
        }}
        title="Profil"
      >
        👤
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "35px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            zIndex: 1000,
            width: "180px",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {user ? (
              <>
                <li><button onClick={handleProfile}>👤 Mon profil</button></li>
                <li style={{ borderTop: "1px solid #eee", marginTop: "10px", paddingTop: "10px" }}>
                  <button onClick={handleLogout}>🚪 Se déconnecter</button>
                </li>
              </>
            ) : (
              <li><button onClick={handleLogin}>🔐 Se connecter</button></li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
