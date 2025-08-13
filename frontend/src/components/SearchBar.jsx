import "../styles/SearchBar.css";
import ProfileMenu from "./ProfileMenu";

function SearchBar({ searchTerm = "", setSearchTerm = () => {} }) {
  return (
    <header className="search-header">
      <div className="logo">TestMyMenu</div>

      

      <ProfileMenu />
    </header>
  );
}

export default SearchBar;


