import React from "react";
import "../styles/SearchBar.css";
import ProfileMenu from "./ProfileMenu";

function SearchBar({ searchTerm = "", setSearchTerm = () => {} }) {
  return (
    <header className="search-header">
      <div className="logo">TestMyMenu</div>

      <input
        type="text"
        placeholder="Rechercher un restaurant ou un menu..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <ProfileMenu />
    </header>
  );
}

export default SearchBar;


