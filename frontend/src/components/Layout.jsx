import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import SearchBar from "./SearchBar";

function Layout() {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  return (
    <div className="page-container">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="main-content">
        <Outlet context={{ searchTerm }} />
      </main>
      <Footer />
    </div>
  );
}

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px",
  backgroundColor: "#f4f4f4",
  borderBottom: "1px solid #ccc",
};

export default Layout;

